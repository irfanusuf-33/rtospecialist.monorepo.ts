import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TargetProductType } from '@prisma/client';

export class RemoveCartItemDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', description: 'Product or PdevProduct ID (UUID)' })
  @IsString()
  productId!: string;

  @ApiProperty({ enum: TargetProductType, example: TargetProductType.Product })
  @IsEnum(TargetProductType)
  productType!: TargetProductType;
}