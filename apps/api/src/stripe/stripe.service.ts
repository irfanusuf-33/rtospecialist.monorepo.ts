// src/stripe/stripe.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe'; 

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  
  // 1. ✅ Type the client instance using the standard TypeScript constructor extraction utility
  public readonly client: InstanceType<typeof Stripe>;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_API_SECRET_KEY');
    
    if (!secretKey) {
      throw new Error('Stripe secret key is not configured.');
    }
    
    this.client = new Stripe(secretKey);
  }

  /**
   * 1. Creates a brand new Customer account profile inside Stripe dashboard
   * 💡 FIX: Infer type directly from Stripe's native class instance method signature
   */
  async createCustomer(
    email: string, 
    name: string, 
    userId: string
  ): Promise<Awaited<ReturnType<InstanceType<typeof Stripe>['customers']['create']>>> {
    try {
      this.logger.log(`Creating Stripe customer profile for user ID: ${userId}`);
      
      return await this.client.customers.create({
        email,
        name,
        metadata: { userId },
      });
    } catch (error: any) {
      throw new BadRequestException(`Stripe customer creation failed: ${error.message}`);
    }
  }

  /**
   * 2. Issues an immediate automatic payment capture intent challenge execution
   * 💡 FIX: Infer type directly from Stripe's native class instance method signature
   */
  async createPaymentIntent(
    amountInCents: number,
    paymentMethodId: string,
    stripeCustomerId: string,
    metadata: Record<string, string>,
  ): Promise<Awaited<ReturnType<InstanceType<typeof Stripe>['paymentIntents']['create']>>> {
    try {
      this.logger.log(`Initiating Stripe PaymentIntent for customer: ${stripeCustomerId}`);
      
      return await this.client.paymentIntents.create({
        amount: amountInCents,
        currency: 'aud',
        customer: stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: { 
          enabled: true, 
          allow_redirects: 'never' 
        },
        metadata,
      });
    } catch (stripeErr: any) {
      throw new BadRequestException(`Payment Processing Rejected: ${stripeErr.message}`);
    }
  }
}