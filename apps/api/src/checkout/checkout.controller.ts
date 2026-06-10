import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Checkout & Order Processing Gateway')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Retrieve verified order pricing and tax summary metrics before executing payments' })
  async getSummary(@Req() req: any) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.checkoutService.getCheckoutSummary(userId);
  }

  @Post('place-order')
  @ApiOperation({ summary: 'Commit current cart items to finalize processing operations' })
  async placeOrder(@Req() req: any, @Body() dto: PlaceOrderDto) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.checkoutService.placeOrder(userId, dto);
  }
}