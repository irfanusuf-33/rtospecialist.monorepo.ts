import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { calculateCartTotals, CartItemCalculatorInput } from '../carts/utils/cart-calculator.util';
import { calculateTax } from '../checkout/utils/tax-calculator.util';
import { OrderStatus, PaymentMethod, PlanStatus, Prisma } from '@prisma/client';
import { StripeService } from '../stripe/stripe.service'; // 👈 Import your StripeService wrapper

type UserWithMemberships = Prisma.UserGetPayload<{
  include: { memberships: true; billingAddresses: true };
}>;

@Injectable()
export class PaymentsService {
  // Inject StripeService via NestJS dependency injection container
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService, // 👈 Injected here
  ) {}

  private static readonly pdevDefinedPrice: number = 55;

  async confirmPayment(userId: string, userEmail: string, dto: ConfirmPaymentDto) {
    const { paymentMethodId, notes } = dto;

    // 1. Fetch user's active cart with product data configurations
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        coupon: true,
        products: {
          include: {
            product: true,
            pdevProduct: true,
          },
        },
      },
    });

    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Your checkout processing failed because the cart container is empty.');
    }

    // 2. Fetch user wallet balances, memberships, and billing addresses
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: { where: { status: PlanStatus.paid } },
        billingAddresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Target account reference execution missing for user "${userId}".`);
    }

    const userWithRelations = user as UserWithMemberships;
    const availableUnitCredits = userWithRelations.unitCredits ?? 0;
    const availableCertCredits = userWithRelations.certCredits ?? 0;

    // 3. Find the single highest available group plan tier for pricing discounts
    let highestGroupPlanTier: string | null = null;
    const tierWeights: Record<string, number> = { BASIC: 1, STARTER: 2, ESSENTIAL: 3, GROWTH: 4, ENTERPRISE: 5 };

    userWithRelations.memberships.forEach((membership) => {
      const currentTierStr = membership.planTier.toString().toUpperCase();
      const currentWeight = tierWeights[currentTierStr] || 0;
      const highestWeight = tierWeights[highestGroupPlanTier || ''] || 0;

      if (currentWeight > highestWeight) highestGroupPlanTier = currentTierStr;
    });

    const groupPlanPayload = highestGroupPlanTier ? { planId: highestGroupPlanTier } : null;

    // 4. Compute core financial calculations with our centralized helper logic
    const baseTotals = calculateCartTotals(
      cart.products as unknown as CartItemCalculatorInput[],
      availableUnitCredits,
      groupPlanPayload,
      availableCertCredits,
      cart.coupon
    );

    // 5. Calculate taxes using the 10% tax utility function
    let finalCartTotal = baseTotals.cartTotal;
    let taxAmount = 0;
    let grandTotal = 0;

    if (finalCartTotal > 0) {
      const taxSummary = calculateTax(finalCartTotal, 10);
      taxAmount = taxSummary.taxAmount;
      grandTotal = taxSummary.grandTotal;
    }

    const amountInCents = Math.round(grandTotal * 100);
    const isZeroDecimalOrder = amountInCents <= 0;

    // 6. Handle customer lookup or assignment using your injected StripeService instance 💳
    let stripeCustomerId = userWithRelations.stripeId;
    if (!stripeCustomerId) {
      const customer = await this.stripeService.client.customers.create({
        email: userEmail,
        name: `${userWithRelations.firstName} ${userWithRelations.lastName}`,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      // Persist the newly created customer record inside your database layer
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeId: stripeCustomerId },
      });
    }

    let stripePaymentIntentId: string | null = null;

    // 7. Execute Stripe charge processing using your injected service instance
    if (!isZeroDecimalOrder) {
      try {
        const paymentIntent = await this.stripeService.client.paymentIntents.create({
          amount: amountInCents,
          currency: 'aud',
          payment_method: paymentMethodId,
          customer: stripeCustomerId,
          confirm: true,
          automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
          metadata: {
            type: 'ORDER',
            userId: userId,
            creditsUsed: baseTotals.creditsToApply.toString(),
            certCreditsUsed: baseTotals.certCreditsApplied.toString(),
          },
        });

        if (paymentIntent.status !== 'succeeded') {
          throw new BadRequestException('Payment gateway settlement failed. Transaction not approved.');
        }

        stripePaymentIntentId = paymentIntent.id;
      } catch (stripeErr: any) {
        throw new BadRequestException(`Stripe rejection: ${stripeErr.message}`);
      }
    }

    // 8. Locate your default billing snapshot components
    const targetAddress = userWithRelations.billingAddresses.find(addr => addr.active) 
      || userWithRelations.billingAddresses[0];

    // 9. Execute all operations atomically inside a Prisma transaction block
    try {
      const finalPlacedOrder = await this.prisma.$transaction(async (tx) => {
        
        // A) Enforce strict checking parameters on wallet credits before deduction
        if (baseTotals.creditsToApply > 0 || baseTotals.certCreditsApplied > 0) {
          const freshUserCheck = await tx.user.findUnique({
            where: { id: userId },
            select: { unitCredits: true, certCredits: true }
          });

          if (
            (freshUserCheck?.unitCredits ?? 0) < baseTotals.creditsToApply ||
            (freshUserCheck?.certCredits ?? 0) < baseTotals.certCreditsApplied
          ) {
            throw new BadRequestException('Transaction canceled: Available credit balances are insufficient.');
          }

          // B) Safely decrement spent token amounts from user record
          await tx.user.update({
            where: { id: userId },
            data: {
              unitCredits: { decrement: baseTotals.creditsToApply },
              certCredits: { decrement: baseTotals.certCreditsApplied },
              moneySavedWithMembership: { increment: baseTotals.moneySavedWithMembership }
            }
          });
        }

        // C) Map cart data objects to your exact OrderProduct format
        const productRecordsData = cart.products.map((item) => {
          const isPdev = item.productType === 'PdevProduct';
          const name = isPdev ? item.pdevProduct?.name : item.product?.name;
          const exactPrice = isPdev 
            ? (PaymentsService.pdevDefinedPrice) 
            : (item.product?.salePrice ?? item.product?.price ?? 0);

          return {
            productId: item.productId || '',
            name: name || 'Unknown Catalog Product',
            quantity: item.quantity,
            salePrice: new Prisma.Decimal(exactPrice),
            type: item.productType,
          };
        });

        // D) Assemble the main order entry record 
        const order = await tx.order.create({
          data: {
            userId: userId,
            email: userEmail,
            referralId: cart.referralId,
            paymentId: stripePaymentIntentId,
            status: OrderStatus.succeeded,
            method: isZeroDecimalOrder ? PaymentMethod.CREDITS : PaymentMethod.CARD,
            currency: 'AUD',
            subTotal: new Prisma.Decimal(baseTotals.trainingCount > 0 ? finalCartTotal : baseTotals.cartTotal),
            discountAmount: new Prisma.Decimal(baseTotals.membershipDiscountValue + baseTotals.couponDiscountValue),
            taxAmount: new Prisma.Decimal(taxAmount),
            amount: new Prisma.Decimal(grandTotal),
            creditsApplied: baseTotals.creditsToApply,
            certCreditsApplied: baseTotals.certCreditsApplied,
            notes: notes || null,
            coupon: cart.coupon ? (cart.coupon as any) : Prisma.JsonNull,
            products: {
              createMany: {
                data: productRecordsData,
              },
            },
          },
        });

        // E) Generate historic billing snapshot if data exists
        if (targetAddress) {
          await tx.orderBillingAddress.create({
            data: {
              orderId: order.id,
              title: targetAddress.title || 'Billing Snapshot',
              postalAddress: targetAddress.postalAddress || `${targetAddress.street}, ${targetAddress.city}`,
              street: targetAddress.street,
              city: targetAddress.city,
              state: targetAddress.state,
              postalCode: targetAddress.postalCode,
              country: targetAddress.country,
            },
          });
        }

        // F) Wipe items from the checkout cart table container
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        await tx.cart.update({
          where: { id: cart.id },
          data: { couponId: null, referralId: null },
        });

        return order;
      });

      return {
        success: true,
        orderId: finalPlacedOrder.id,
        amount: grandTotal.toFixed(2),
        creditsUsed: baseTotals.creditsToApply,
        certCreditsUsed: baseTotals.certCreditsApplied,
        billingAddressSnapshot: targetAddress || null,
      };

    } catch (txError: any) {
      throw new InternalServerErrorException(`Database transaction processing failure: ${txError.message}`);
    }
  }
}