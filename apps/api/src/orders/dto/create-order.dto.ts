import { 
  IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, 
  IsString, Min, ValidateNested, IsArray, ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TargetProductType } from '../../../../../packages/types/src/entities/product.entity';

export enum OrderStatus {
  pending = 'pending',
  processing = 'processing',
  succeeded = 'succeeded',
  failed = 'failed',
  refunded = 'refunded',
  cancelled = 'cancelled',
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK = 'BANK',
  CREDITS = 'CREDITS',
}

export enum CouponType {
  percentage = 'percentage',
  fixed = 'fixed',
}

class OrderBillingAddressDto {
  @ApiPropertyOptional({ example: 'Home', description: 'Label title for the address' })
  @IsString()
  @IsOptional()
  title?: string = 'None';

  @ApiProperty({ example: '123 Business Corp Suite 400', description: 'Postal address or company name' })
  @IsString()
  @IsNotEmpty()
  postalAddress: string = '';

  @ApiProperty({ example: 'Broadway Street 45', description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  street: string = '';

  @ApiProperty({ example: 'New York', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string = '';

  @ApiProperty({ example: 'NY', description: 'State or Province' })
  @IsString()
  @IsNotEmpty()
  state: string = '';

  @ApiProperty({ example: '10001', description: 'Postal or ZIP code' })
  @IsString()
  @IsNotEmpty()
  postalCode: string = '';

  @ApiProperty({ example: 'United States', description: 'Country name' })
  @IsString()
  @IsNotEmpty()
  country: string = '';
}

class OrderProductDto {
  @ApiProperty({ example: 'prod_958fbc8d31', description: 'The database unique identifier for the product' })
  @IsString()
  @IsNotEmpty()
  productId: string = '';

  @ApiProperty({ example: 'Premium Subscription Plan', description: 'Snapshot name of product at purchase' })
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty({ example: 2, description: 'Quantity purchased', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number = 1;

  @ApiProperty({ example: 49.99, description: 'Sale price per individual item unit' })
  @IsNumber()
  @Min(0)
  salePrice: number = 0;

  @ApiPropertyOptional({ example: 'digital', description: 'Product classification type' })
  @IsEnum(TargetProductType)
  @IsNotEmpty()
  type: TargetProductType=TargetProductType.Product;
}

class CouponDto {
  @ApiProperty({ example: 'SUMMER50', description: 'Uppercase promo code string' })
  @IsString()
  @IsNotEmpty()
  code: string = '';

  @ApiProperty({ enum: CouponType, example: 'percentage', description: 'Discount calculation mechanism type' })
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType = CouponType.percentage;

  @ApiProperty({ example: 50.00, description: 'Value amount removed by coupon application' })
  @IsNumber()
  @Min(0)
  amount: number = 0;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'usr_cl78abc123', description: 'The unique ID of the customer placing the order' })
  @IsString()
  @IsNotEmpty()
  userId: string = '';

  @ApiProperty({ example: 'john.doe@example.com', description: 'Primary transaction contact email' })
  @IsEmail()
  email: string = '';

  @ApiPropertyOptional({ example: 'aff_772183', description: 'Associated affiliate partner account identifier tracking code' })
  @IsString()
  @IsOptional()
  referralId?: string;

  @ApiPropertyOptional({ example: 'ch_3MvLYwLkdIwHu7ixX', description: 'Gateway processing engine identifier string (Required unless method is CREDITS)' })
  @IsString()
  @IsOptional()
  paymentId?: string;

  @ApiProperty({ enum: PaymentMethod, example: 'CARD', description: 'The chosen settlement settlement engine track' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod = PaymentMethod.CARD;

  @ApiPropertyOptional({ example: 'USD', default: 'USD', description: 'Three-letter currency standard layout denomination' })
  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @ApiProperty({ example: 99.98, description: 'Calculated item cumulative financial cost breakdown before taxes and coupons' })
  @IsNumber()
  @Min(0)
  subTotal: number = 0;

  @ApiPropertyOptional({ example: 10.00, default: 0, description: 'Total currency values trimmed off subtotal aggregate metrics' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number = 0;

  @ApiPropertyOptional({ example: 8.25, default: 0, description: 'Aggregated governmental processing compliance collection surcharges' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number = 0;

  @ApiProperty({ example: 98.23, description: 'Final financial checkout metric calculation payload' })
  @IsNumber()
  @Min(0)
  amount: number = 0;

  @ApiProperty({ type: [OrderProductDto], description: 'List of line item entries tied directly to this transaction profile' })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[] = [];

  @ApiPropertyOptional({ type: OrderBillingAddressDto, description: 'Permanent historical record layout tracing location metadata profile' })
  @ValidateNested()
  @IsOptional()
  @Type(() => OrderBillingAddressDto)
  billingAddress?: OrderBillingAddressDto;

  @ApiPropertyOptional({ type: CouponDto, description: 'Applied voucher properties applied to mutate check metrics parameters' })
  @ValidateNested()
  @IsOptional()
  @Type(() => CouponDto)
  coupon?: CouponDto;

  @ApiPropertyOptional({ example: 0, default: 0, description: 'Certification balances redeemed' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  certCreditsApplied?: number = 0;

  @ApiPropertyOptional({ example: 15.50, default: 0, description: 'Standard consumer digital store wallet units applied' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  creditsApplied?: number = 0;

  @ApiPropertyOptional({ example: 'Customer requested contactless delivery if physical packaging applies.', description: 'Internal support notations logs tracking storage field' })
  @IsString()
  @IsOptional()
  notes?: string;
}