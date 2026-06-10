import { Coupon, OrderStatus, PaymentMethod, PdevProduct, Product, TargetProductType } from "./product.entity";
import { User } from "./user.entity";

export interface Order {
  id: string;
  userId: string;
  email: string;
  referralId: string | null;
  paymentId: string | null;
  status: OrderStatus; // From your initial schema definitions
  method: PaymentMethod; // From your initial schema definitions
  currency: string;
  subTotal: number | string; // Handled as Decimal
  discountAmount: number | string; // Handled as Decimal
  taxAmount: number | string; // Handled as Decimal
  amount: number | string; // Handled as Decimal
  certCreditsApplied: number;
  creditsApplied: number;
  notes: string | null;
  coupon: Record<string, any> | null; // JSON Field
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  billingAddress?: OrderBillingAddress | null;
  products?: OrderProduct[];
}

export interface OrderBillingAddress {
  id: string;
  orderId: string;
  title: string | null;
  postalAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Relations
  order?: Order;
}

export interface OrderProduct {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  salePrice: number | string; // Handled as Decimal
  type: TargetProductType;

  // Relations
  order?: Order;
}

export interface Cart {
  id: string;
  userId: string;
  referralId: string | null;
  couponId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: User;
  coupon?: Coupon | null;
  products?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string | null;
  pdevProductId: string | null;
  productType: TargetProductType;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  cart?: Cart;
  product?: Product | null;
  pdevProduct?: PdevProduct | null;
}