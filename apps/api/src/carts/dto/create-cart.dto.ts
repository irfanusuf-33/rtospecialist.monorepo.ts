import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TargetProductType } from '@prisma/client';

class AddCartItemDto {
  @ApiProperty({ example: '8cfda241-1123-4567-b89c-cc7190d7cde3', description: 'The absolute unique database ID of the item' })
  @IsString()
  @IsNotEmpty()
  productId: string = '';

  @ApiProperty({ enum: TargetProductType, example: 'Product', description: 'The exact Prisma model collection to route dynamic find queries to' })
  @IsEnum(TargetProductType)
  @IsNotEmpty()
  productType: TargetProductType = TargetProductType.Product;

  @ApiProperty({ example: 1, minimum: 1, description: 'Line item quantity volume allocation threshold' })
  @IsNumber()
  @Min(1)
  quantity: number = 1;
}

export class CreateCartDto {
  @ApiProperty({ example: 'usr_cl78abc123', description: 'The unique ID owner of this persistent session container' })
  @IsString()
  @IsNotEmpty()
  userId: string = '';

  @ApiPropertyOptional({ example: 'aff_772183', description: 'Associated affiliate referral reference tag parameter' })
  @IsString()
  @IsOptional()
  referralId?: string;

  @ApiPropertyOptional({ example: 'cpn_uuid887123', description: 'Applied voucher promotion constraint ID mapping value' })
  @IsString()
  @IsOptional()
  couponId?: string;

  @ApiProperty({ type: [AddCartItemDto], description: 'List of line item entries placed inside this active basket segment' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddCartItemDto)
  products: AddCartItemDto[] = [];
}