// src/stripe/stripe.module.ts
import { Global, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Makes the module globally available across your entire app
@Module({
  imports: [ConfigModule],
  providers: [StripeService],
  exports: [StripeService], // Essential so other modules can access the service
})
export class StripeModule {}