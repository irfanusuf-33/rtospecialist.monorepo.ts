import { Module } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeModule } from '../stripe/stripe.module'; // 👈 Import your existing module here

@Module({
  imports: [PrismaModule, StripeModule], // 👈 Added StripeModule to imports array
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}