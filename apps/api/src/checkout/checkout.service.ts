import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { calculateCartTotals, CartItemCalculatorInput } from '../carts/utils/cart-calculator.util';
import { calculateTax } from './utils/tax-calculator.util';
import { BillingAddress, OrderStatus, PaymentMethod, PlanStatus, Prisma } from '@prisma/client';
import { PaymentsService } from '../payment/payment.service';
import { ValidateBillingAddressDto } from './dto/billing-address-validation.dto';

type UserWithMemberships = Prisma.UserGetPayload<{
  include: { memberships: true };
}>;

@Injectable()
export class CheckoutService {
  private static readonly pdevDefinedPrice: number = 55;
  constructor(private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  validateBillingAddress(address: ValidateBillingAddressDto | BillingAddress): void {
    if (!address) {
      throw new BadRequestException('Billing validation failed: Address details are completely missing.');
    }

    // 1. Strict String Trimming & Emptiness Verification Guardrails
    const criticalFields: (keyof ValidateBillingAddressDto)[] = [
      'street',
      'city',
      'state',
      'postalCode',
      'country',
      'postalAddress'
    ];

    for (const field of criticalFields) {
      const value = address[field as keyof typeof address];
      if (!value || String(value).trim() === '') {
        throw new BadRequestException(`Billing validation failed: Field "${field}" cannot be blank.`);
      }
    }

    // 2. Regional Logic: Australian Compliance (Since rtospecialist.com.au is AU-focused)
    const upperCountry = address.country.trim().toUpperCase();
    if (upperCountry === 'AU' || upperCountry === 'AUSTRALIA') {

      // Ensure AU postcodes are exactly 4 digits long
      const auPostcodeRegex = /^\d{4}$/;
      if (!auPostcodeRegex.test(address.postalCode.trim())) {
        throw new BadRequestException('Billing validation failed: Australian postal codes must be exactly 4 digits.');
      }

      // Check for valid AU state abbreviations
      const validAuStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
      const upperState = address.state.trim().toUpperCase();
      if (!validAuStates.includes(upperState)) {
        throw new BadRequestException(
          `Billing validation failed: "${address.state}" is not a recognized Australian state/territory abbreviation. Use one of: ${validAuStates.join(', ')}`
        );
      }
    }
  }

  async addBillingAddress(userId: string, dto: ValidateBillingAddressDto) {
    this.validateBillingAddress(dto);
    const existingAddressesCount = await this.prisma.billingAddress.count({
      where: { userId },
    });
    const shouldBeActive = existingAddressesCount === 0;
    const newAddress = await this.prisma.billingAddress.create({
      data: {
        userId,
        title: dto.title || 'Billing Profile',
        postalAddress: dto.postalAddress.trim(),
        street: dto.street.trim(),
        city: dto.city.trim(),
        state: dto.state.trim().toUpperCase(),
        postalCode: dto.postalCode.trim(),
        country: dto.country.trim(),
        active: shouldBeActive,
      },
    });

    return {
      success: true,
      message: 'Billing address has been successfully saved to your profile.',
      address: newAddress,
    };
  }

  async makeAddressActive(userId: string, addressId: string) {
    await this.prisma.$transaction([
      this.prisma.billingAddress.updateMany({
        where: { userId },
        data: { active: false },
      }),
      this.prisma.billingAddress.update({
        where: { id: addressId, userId },
        data: { active: true },
      }),
    ]);
  }

async getCheckoutSummary(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        coupon: true,
        products: {
          include: { product: true, pdevProduct: true },
        },
      },
    });

    if (!cart || cart.products.length === 0) {
      throw new BadRequestException('Cannot initiate a checkout session with an empty cart.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: { where: { status: PlanStatus.paid } },
        billingAddresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Target user with identity identifier "${userId}" was not found.`);
    }

    const userWithRelations = user as UserWithMemberships;
    const availableUnitCredits = userWithRelations.unitCredits ?? 0;
    const availableCertCredits = userWithRelations.certCredits ?? 0;

    let highestGroupPlanTier: string | null = null;
    const tierWeights: Record<string, number> = { BASIC: 1, STARTER: 2, ESSENTIAL: 3, GROWTH: 4, ENTERPRISE: 5 };

    userWithRelations.memberships.forEach((membership) => {
      const currentTierStr = membership.planTier.toString().toUpperCase();
      const currentWeight = tierWeights[currentTierStr] || 0;
      const highestWeight = tierWeights[highestGroupPlanTier || ''] || 0;

      if (currentWeight > highestWeight) highestGroupPlanTier = currentTierStr;
    });

    const groupPlanPayload = highestGroupPlanTier ? { planId: highestGroupPlanTier } : null;

    // 1. Extract pricing metrics from helper
    const baseTotals = calculateCartTotals(
      cart.products as unknown as CartItemCalculatorInput[],
      availableUnitCredits,
      groupPlanPayload,
      cart.coupon as any,
    );

    // 2. Capture the TRUE gross amount before credits are subtracted.
    const grossTaxSummary = calculateTax(baseTotals.grossSubtotal, 10);

    // 3. Apply tax surcharge layer on top of the final post-credit cart total
    const taxSummary = calculateTax(baseTotals.cartTotal, 10);

    return {
      cartId: cart.id,
      userWalletBalances: {
        unitCredits: availableUnitCredits,
        certCredits: availableCertCredits,
      },
      pricingBreakdown: baseTotals,
      taxBreakdown: taxSummary, 
      grossAmountBreakdown: {
        subtotal: baseTotals.grossSubtotal,
        taxAmount: grossTaxSummary.taxAmount,
        grandTotal: grossTaxSummary.grandTotal, // This is the original price before credits brought it to 0
      },
      cart,
      user,
    };
  }

  /**
   * Final Order Placement execution block
   */
  async placeOrder(userId: string, userEmail: string, dto: PlaceOrderDto) {
    const { paymentMethodId, notes } = dto;

    // 1. Fetch entire pre-calculated user context structures
    const { cart, user, pricingBreakdown, taxBreakdown, grossAmountBreakdown } = await this.getCheckoutSummary(userId);

    const amountInCents = Math.round(taxBreakdown.grandTotal * 100);
    const isZeroDecimalOrder = amountInCents <= 0;

    // --- CRITICAL FIX: VALIDATE CREDITS BEFORE CHARGING STRIPE ---
    if (pricingBreakdown.creditsToApply > 0 || pricingBreakdown.certCreditsApplied > 0) {
      if (
        (user.unitCredits ?? 0) < pricingBreakdown.creditsToApply ||
        (user.certCredits ?? 0) < pricingBreakdown.certCreditsApplied
      ) {
        throw new BadRequestException('Transaction canceled: Available credit balances are insufficient.');
      }
    }

    let stripePaymentIntentId: string | null = null;

    // 2. Process payments if there is a remaining cash balance due
    if (!isZeroDecimalOrder) {
      if (!paymentMethodId) {
        throw new BadRequestException('Payment token missing; validation required for cash checkouts.');
      }

      const stripeCustomerId = await this.paymentsService.getOrCreateCustomer(
        userEmail,
        `${user.firstName} ${user.lastName}`,
        userId,
        user.stripeId,
      );

      if (!user.stripeId) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { stripeId: stripeCustomerId },
        });
      }

      stripePaymentIntentId = await this.paymentsService.processCardCharge(
        amountInCents,
        paymentMethodId,
        stripeCustomerId,
        {
          type: 'ORDER',
          userId,
          creditsUsed: pricingBreakdown.creditsToApply.toString(),
          certCreditsUsed: pricingBreakdown.certCreditsApplied.toString(),
        },
      );
    }

    const targetAddress = user.billingAddresses.find((addr: BillingAddress) => addr.active) 
      || user.billingAddresses[0];

    this.validateBillingAddress(targetAddress);

    // 3. Commit atomic states to DB via a clean transaction block
    try {
      const finalPlacedOrder = await this.prisma.$transaction(async (tx) => {
        
        // Re-verify balances inside the write-lock transaction block to handle race-conditions safely
        if (pricingBreakdown.creditsToApply > 0 || pricingBreakdown.certCreditsApplied > 0) {
          const freshUserCheck = await tx.user.findUnique({
            where: { id: userId },
            select: { unitCredits: true, certCredits: true },
          });

          if (
            (freshUserCheck?.unitCredits ?? 0) < pricingBreakdown.creditsToApply ||
            (freshUserCheck?.certCredits ?? 0) < pricingBreakdown.certCreditsApplied
          ) {
            throw new BadRequestException('Transaction canceled: Credit balances changed mid-flight.');
          }

          // Safely decrement internal wallet tokens
          await tx.user.update({
            where: { id: userId },
            data: {
              unitCredits: { decrement: pricingBreakdown.creditsToApply },
              certCredits: { decrement: pricingBreakdown.certCreditsApplied },
              moneySavedWithMembership: { increment: pricingBreakdown.moneySavedWithMembership },
            },
          });
        }

        const productRecordsData = cart.products.map((item) => {
          const isPdev = item.productType === 'PdevProduct';
          const name = isPdev ? item.pdevProduct?.name : item.product?.name;
          const exactPrice = isPdev
            ? CheckoutService.pdevDefinedPrice
            : item.product?.salePrice ?? item.product?.price ?? 0;

          return {
            productId: item.productId || '',
            name: name || 'Unknown Catalog Product',
            quantity: item.quantity,
            salePrice: new Prisma.Decimal(exactPrice),
            type: item.productType,
          };
        });

        // Initialize historical permanent order logs
        const order = await tx.order.create({
          data: {
            userId,
            email: userEmail,
            referralId: cart.referralId,
            paymentId: stripePaymentIntentId,
            status: OrderStatus.succeeded,
            method: isZeroDecimalOrder ? PaymentMethod.CREDITS : PaymentMethod.CARD,
            currency: 'AUD',
            subTotal: new Prisma.Decimal(grossAmountBreakdown.grandTotal), // total amount before applying any credits
            discountAmount: new Prisma.Decimal(pricingBreakdown.membershipDiscountValue + pricingBreakdown.couponDiscountValue),
            taxAmount: new Prisma.Decimal(taxBreakdown.taxAmount),
            amount: new Prisma.Decimal(taxBreakdown.grandTotal), // This will correctly record 0.00
            creditsApplied: pricingBreakdown.creditsToApply,
            certCreditsApplied: pricingBreakdown.certCreditsApplied,
            notes: notes || null,
            coupon: cart.coupon ? (cart.coupon as any) : Prisma.JsonNull,
            products: { createMany: { data: productRecordsData } },
          },
        });

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

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.cart.update({
          where: { id: cart.id },
          data: { couponId: null, referralId: null },
        });

        return order;
      });

      return {
        success: true,
        orderId: finalPlacedOrder.id,
        amount: taxBreakdown.grandTotal.toFixed(2),
        grossAmount: grossAmountBreakdown.grandTotal.toFixed(2), // Returned in the response payload
        creditsUsed: pricingBreakdown.creditsToApply,
        certCreditsUsed: pricingBreakdown.certCreditsApplied,
        billingAddressSnapshot: targetAddress || null,
      };
    } catch (txError: any) {
      throw new InternalServerErrorException(`Database transaction processing failure: ${txError.message}`);
    }
  }
}