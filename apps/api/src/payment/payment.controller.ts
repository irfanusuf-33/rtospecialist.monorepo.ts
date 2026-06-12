import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payment Processing Infrastructure')
@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
}