import { Controller, Get, Post, Body, Req, UseGuards, Param, HttpCode, HttpStatus, Patch, ValidationPipe, UsePipes } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { ApiOperation, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ValidateBillingAddressDto } from './dto/billing-address-validation.dto';

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
  @ApiOperation({ summary: 'Place your order' })
  async placeOrder(@Req() req: any, @Body() dto: PlaceOrderDto) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    const userEmail = req.uesr?.email || 'mohammad.iqram@voctrum.com';
    return this.checkoutService.placeOrder(userId, userEmail, dto);
  }

  @Post('/add-billing-address')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new billing address to the authenticated user account' })
  @ApiResponse({ status: 201, description: 'Billing address successfully registered.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addBillingAddress(
    @Req() req: any, 
    @Body() dto: ValidateBillingAddressDto
  ) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.checkoutService.addBillingAddress(userId, dto);
  }

  @Patch(':id/set-active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set a specific billing address as the primary active default' })
  @ApiParam({ name: 'id', description: 'The unique ID string of the billing address record' })
  @ApiResponse({ status: 200, description: 'Primary active default billing location updated successfully.' })
  async setActiveAddress(
    @Req() req: any,
    @Param('id') addressId: string,
  ) {
    const userId = req.user.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.checkoutService.makeAddressActive(userId, addressId);
  }
}