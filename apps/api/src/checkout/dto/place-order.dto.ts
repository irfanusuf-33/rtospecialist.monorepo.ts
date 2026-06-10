import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceOrderDto {
  @ApiProperty({ description: 'Optional saved billing address ID to associate with the invoice record' })
  @IsUUID()
  @IsOptional()
  billingAddressId?: string;

  @ApiProperty({ description: 'Optional referral tracking ID' })
  @IsString()
  @IsOptional()
  referralId?: string;
}