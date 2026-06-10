type CartLikeItem = {
  id?: string;
  type?: string;
};

type GuestCartLikeItem = {
  productId?: string;
  type?: string;
};

export const getPdevCartCount = (
  cartItems: CartLikeItem[] = [],
  guestCartProducts: GuestCartLikeItem[] = []
) => {
  const authenticatedPdevCount = cartItems.filter((item) => item.type === "pdev_product").length;
  const guestPdevCount = guestCartProducts.filter((item) => item.type === "pdev_product").length;
  return authenticatedPdevCount + guestPdevCount;
};

export const getRemainingPdevCredits = (
  certCredits: number | undefined,
  usedPdevCreditsInCart: number
) => Math.max((Number(certCredits) || 0) - usedPdevCreditsInCart, 0);
