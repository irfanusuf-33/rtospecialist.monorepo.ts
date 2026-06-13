import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ example: 'SUMMER50', description: 'The unique coupon code to apply' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}

export class CartIdParamDto {
  @ApiProperty({ example: 'cart-uuid-1234', description: 'The unique UUID of the cart' })
  @IsUUID()
  @IsNotEmpty()
  cartId!: string;
}