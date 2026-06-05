import { 
  IsString, IsNotEmpty, IsEnum, IsNumber, Min, 
  IsOptional, IsInt, IsBoolean, IsDateString, IsArray, ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponType, TargetProductType } from '@prisma/client';

class TargetProductDto {
  @ApiProperty({ example: '8cfda241-1123-4567-b89c-cc7190d7cde3', description: 'The unique ID identifier of the product record' })
  @IsString()
  @IsNotEmpty()
  productId: string = '';

  @ApiProperty({ enum: TargetProductType, example: 'Product', description: 'The exact Prisma model name to search dynamically' })
  @IsEnum(TargetProductType)
  @IsNotEmpty()
  productType: TargetProductType = TargetProductType.Product;
}

export class CreateCouponDto {
  @ApiProperty({ example: 'WINTER20', description: 'Unique uppercase coupon tracking alphanumeric code' })
  @IsString()
  @IsNotEmpty()
  code: string = '';

  @ApiProperty({ example: 'Get 20% off selected products.', description: 'Campaign description summary' })
  @IsString()
  @IsNotEmpty()
  description: string = '';

  @ApiProperty({ enum: CouponType, example: 'PERCENTAGE_OFF', description: 'Discount calculation methodology' })
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType = CouponType.fixed;

  @ApiProperty({ example: 20.00, description: 'Percentage or absolute currency metrics markdown magnitude' })
  @IsNumber()
  @Min(0.01)
  value: number = 0;

  @ApiPropertyOptional({ example: 1000, default: null, description: 'Maximum universal redemption volume capacity (null for unlimited)' })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxRedemptions?: number = 0;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Caps limit allowed allocations per individual user ID' })
  @IsInt()
  @Min(1)
  @IsOptional()
  limitPerUser?: number = 1;

  @ApiPropertyOptional({ example: 50.00, default: 0.00, description: 'Basket requirement threshold' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number = 0.00;

  @ApiPropertyOptional({ type: [TargetProductDto], description: 'Dynamic list of products this coupon applies to' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TargetProductDto)
  @IsOptional()
  applicableProducts?: TargetProductDto[] = [];

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z', default: 'Now' })
  @IsDateString()
  @IsOptional()
  startDate?: string = new Date().toISOString();

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string = '';
}