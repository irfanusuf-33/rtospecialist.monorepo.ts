// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  // Expose the Stripe client instance as a public, read-only property
  public readonly client: InstanceType<typeof Stripe>;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_API_SECRET_KEY') || process.env.STRIPE_API_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('Stripe secret key is not configured. Please set STRIPE_API_SECRET_KEY in your environment variables.');
    }
    this.client = new Stripe(secretKey, {
      apiVersion: '2025-05-28.basil' as any, 
    });
  }
}