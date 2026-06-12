// src/payment/payments.service.ts
import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Resolves an existing Stripe Customer ID or provisions a new profile 
   */
  async getOrCreateCustomer(
    email: string, 
    name: string, 
    userId: string, 
    currentStripeId?: string | null
  ): Promise<string> {
    if (currentStripeId) return currentStripeId;

    const customer = await this.stripeService.createCustomer(email, name, userId);
    return customer.id;
  }

  /**
   * Dispatches automated credit card charges directly via Stripe
   */
  async processCardCharge(
    amountInCents: number, 
    paymentMethodId: string, 
    stripeCustomerId: string, 
    metadata: Record<string, string>
  ): Promise<string> {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      amountInCents,
      paymentMethodId,
      stripeCustomerId,
      metadata,
    );

    return paymentIntent.id;
  }
}