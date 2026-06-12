import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceOrderDto {
  @ApiProperty({ description: 'Optional referral tracking ID' })
  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @ApiProperty({ description: 'Optional referral tracking ID' })
  @IsString()
  @IsOptional()
  notes?: string;
}