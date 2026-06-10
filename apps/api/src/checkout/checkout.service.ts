import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { calculateCartTotals, CartItemCalculatorInput } from '../carts/utils/cart-calculator.util';
import { calculateTax } from './utils/tax-calculator.util';
import { PlanStatus, Prisma } from '@prisma/client';

type UserWithMemberships = Prisma.UserGetPayload<{
  include: { memberships: true };
}>;

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Pre-checkout breakdown verification engine
   */
  async getCheckoutSummary(userId: string) {
    // 1. Fetch live cart items accompanied by active coupon parameters
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
      throw new BadRequestException('Cannot initiate a checkout session with an empty cart.');
    }

    // 2. Extract active user records accompanied by valid permission tiers
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: PlanStatus.paid },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Target user with identity identifier "${userId}" was not found.`);
    }

    const userWithRelations = user as UserWithMemberships;
    const availableUnitCredits = userWithRelations.unitCredits ?? 0;
    const availableCertCredits = userWithRelations.certCredits ?? 0;

    // 3. Evaluate the single highest group tier available
    let highestGroupPlanTier: string | null = null;
    const tierWeights: Record<string, number> = { BASIC: 1, STARTER: 2, ESSENTIAL: 3, GROWTH: 4, ENTERPRISE: 5 };

    userWithRelations.memberships.forEach((membership) => {
      const currentTierStr = membership.planTier.toString().toUpperCase();
      const currentWeight = tierWeights[currentTierStr] || 0;
      const highestWeight = tierWeights[highestGroupPlanTier || ''] || 0;

      if (currentWeight > highestWeight) highestGroupPlanTier = currentTierStr;
    });

    const groupPlanPayload = highestGroupPlanTier ? { planId: highestGroupPlanTier } : null;

    // 4. Extract base pricing metrics using the reusable helper function
    const baseTotals = calculateCartTotals(
      cart.products as unknown as CartItemCalculatorInput[],
      availableUnitCredits,
      groupPlanPayload,
      cart.coupon as any,
    );

    // 5. Apply the 10% tax surcharge layer on top of the final cart total
    const taxSummary = calculateTax(baseTotals.cartTotal, 10);

    return {
      cartId: cart.id,
      userWalletBalances: {
        unitCredits: availableUnitCredits,
        certCredits: availableCertCredits,
      },
      pricingBreakdown: baseTotals,
      taxBreakdown: taxSummary, // Holds subtotal, taxAmount (10%), and grandTotal
    };
  }

  /**
   * Final Order Placement execution block
   */
  async placeOrder(userId: string, dto: PlaceOrderDto) {
    const summary = await this.getCheckoutSummary(userId);
    
    // Core payment gateway handshakes (Stripe PaymentIntent generation triggers) would execute here.
    // For now, this prepares the application structure to map out order logging workflows cleanly.
    return {
      success: true,
      message: 'Checkout calculation validated successfully. Processing order routing...',
      checkoutData: summary,
    };
  }
}