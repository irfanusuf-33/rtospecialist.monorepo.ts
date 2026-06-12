import { CouponType, PlanTier, TargetProductType } from '@prisma/client';

export interface CartItemCalculatorInput {
  quantity: number;
  productType: TargetProductType;
  product?: {
    price: number;
    salePrice: number | null;
    [key: string]: any;
  } | null;
  pdevProduct?: {
    price: number;
    [key: string]: any;
  } | null;
}

export interface GroupPlanCalculatorInput {
  planId: string;
}

// Added explicit input type for the coupon matching your Prisma Schema properties
export interface CouponCalculatorInput {
  code: string;
  type: 'FIXED' | 'PERCENTAGE' | string; // Matches your CouponType enum
  value: number | any; // Decimal fields might come as strings/objects from Prisma
  minOrderAmount: number | any;
}

export interface CartTotalsResponse {
  len: number;
  membershipDiscount: number | null;
  unitCredits: number;
  creditsToApply: number;
  membershipDiscountValue: number;
  couponDiscountValue: number;
  cartTotal: number;
  trainingCount: number;
  pdevCount: number;
  payableTrainingCount: number;
  certCreditsApplied: number;
  remainingCertCredits: number;
  payablePdevCount: number;
  moneySavedWithMembership: number;
  grossSubtotal: number;
}

/**
 * Centered Pure Calculator Engine for Shopping Carts
 */
export function calculateCartTotals(
  cartItems: CartItemCalculatorInput[],
  availableCredits = 0,
  groupPlan: GroupPlanCalculatorInput | null = null,
  availableCertCredits = 0,
  coupon: CouponCalculatorInput | null = null
): CartTotalsResponse {
  const DEFAULT_PDEV_PRICE = 55;

  let trainingProductCount = 0;
  let pdevProductCount = 0;

  let trainingSubtotalBeforeCredits = 0;
  let pdevSubtotalBeforeCredits = 0;

  cartItems.forEach((item) => {
    const qty = item.quantity || 1;

    if (item.productType === TargetProductType.PdevProduct) {
      pdevProductCount += qty;
      const unitPrice = item.pdevProduct?.price || DEFAULT_PDEV_PRICE;
      pdevSubtotalBeforeCredits += unitPrice * qty;
    } else {
      trainingProductCount += qty;
      const unitPrice = item.product?.salePrice ?? item.product?.price ?? 0;
      trainingSubtotalBeforeCredits += unitPrice * qty;
    }
  });

  const basketLength = trainingProductCount + pdevProductCount;

  const grossSubtotal = trainingSubtotalBeforeCredits + pdevSubtotalBeforeCredits;
  // 2. Allocate Unit Credits (Only applied to standard Training Products)
  const creditsToApply = Math.min(availableCredits, trainingProductCount);
  const payableTrainingCount = Math.max(0, trainingProductCount - creditsToApply);

  const avgTrainingUnitPrice = trainingProductCount > 0 ? trainingSubtotalBeforeCredits / trainingProductCount : 0;
  const trainingCreditsSavings = creditsToApply * avgTrainingUnitPrice;
  const finalTrainingCost = Math.max(0, trainingSubtotalBeforeCredits - trainingCreditsSavings);

  // 3. Allocate Cert Credits (Only applied to Pdev Products)
  const certCreditsToApply = Math.min(availableCertCredits, pdevProductCount);
  const payablePdevCount = Math.max(0, pdevProductCount - certCreditsToApply);
  const remainingCertCredits = Math.max(0, availableCertCredits - certCreditsToApply);

  const avgPdevUnitPrice = pdevProductCount > 0 ? pdevSubtotalBeforeCredits / pdevProductCount : DEFAULT_PDEV_PRICE;
  const pdevCreditsSavings = certCreditsToApply * avgPdevUnitPrice;
  const finalPdevCost = Math.max(0, pdevSubtotalBeforeCredits - pdevCreditsSavings);

  // Dynamic baseline cost after user has applied structural wallet credits
  let cartTotal = finalTrainingCost + finalPdevCost;
  const totalCreditSavings = trainingCreditsSavings + pdevCreditsSavings;

  // 4. Calculate Coupon Deductions 🎫
  let couponDiscountValue = 0;

  if (coupon && cartTotal > 0) {
    const minAmountNeeded = parseFloat(coupon.minOrderAmount?.toString() || '0');
    const couponValue = parseFloat(coupon.value?.toString() || '0');

    // Only apply if the current baseline meets the minimum threshold requirement
    if (cartTotal >= minAmountNeeded) {
      if (coupon.type === CouponType.percentage) {
        couponDiscountValue = cartTotal * (couponValue / 100);
      } else if (coupon.type === CouponType.fixed) {
        couponDiscountValue = couponValue;
      }

      // Ensure the coupon never discounts more than the actual cost of the cart
      couponDiscountValue = Math.min(couponDiscountValue, cartTotal);
      cartTotal -= couponDiscountValue;
    }
  }

  // 5. Calculate Tier-based Membership Discounts (Applied to the remaining balance)
  let discountPercent: number | null = null;
  let membershipDiscountValue = 0;

  if (groupPlan && cartTotal > 0) {
    const plan = groupPlan.planId.toUpperCase();
    discountPercent =
      plan === PlanTier.ESSENTIAL ? 3.5 :
      plan === PlanTier.GROWTH ? 10 :
      plan === PlanTier.ESSENTIAL ? 15 : null;

    if (discountPercent) {
      membershipDiscountValue = cartTotal * (discountPercent / 100);
      cartTotal -= membershipDiscountValue;
    }
  }

  // Combine total dynamic dollar value reductions (excluding credits)
  const totalMoneySavedThisOrder = totalCreditSavings + couponDiscountValue + membershipDiscountValue;

  return {
    len: basketLength,
    membershipDiscount: discountPercent,
    unitCredits: availableCredits,
    creditsToApply: creditsToApply,
    membershipDiscountValue: parseFloat(membershipDiscountValue.toFixed(2)),
    couponDiscountValue: parseFloat(couponDiscountValue.toFixed(2)),
    cartTotal: parseFloat(Math.max(0, cartTotal).toFixed(2)),
    trainingCount: trainingProductCount,
    pdevCount: pdevProductCount,
    payableTrainingCount,
    certCreditsApplied: certCreditsToApply,
    remainingCertCredits,
    payablePdevCount,
    moneySavedWithMembership: parseFloat(totalMoneySavedThisOrder.toFixed(2)),
    grossSubtotal: parseFloat(grossSubtotal.toFixed(2))
  };
}