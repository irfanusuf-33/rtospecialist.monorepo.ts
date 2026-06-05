// src/orders/dto/update-order.dto.ts
import { PartialType } from '@nestjs/swagger'; // <-- Change this from @nestjs/mapped-types
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from './create-order.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({ enum: OrderStatus, example: 'succeeded' })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}