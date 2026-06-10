import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payment Processing Infrastructure')
@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('ConfirmPayment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit payment tokens to verify Stripe balances and compile completed invoice sheets' })
  @ApiResponse({ status: 200, description: 'Payment authorized, order committed, and item registers cleared out successfully.' })
  async confirmPayment(@Req() req: any, @Body() dto: ConfirmPaymentDto) {
    // Extract account payload details out from your custom Decoded JWT passport context maps
    const userId = req.customer?.id || req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    const email = req.customer?.email || req.user?.email || 'billing@domain.com';

    return this.paymentsService.confirmPayment(userId, email, dto);
  }
}