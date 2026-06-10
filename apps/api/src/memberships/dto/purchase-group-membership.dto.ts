import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PlanTier } from '@prisma/client';

class GroupMembershipAddonsDto {
  @ApiProperty({ example: 1, description: 'Quantity of Professional Development packages purchased' })
  @IsNumber()
  @Min(0)
  pdPackQty: number=0;

  @ApiProperty({ example: 5, description: 'Quantity of new staff user entries requested' })
  @IsNumber()
  @Min(0)
  newUsersQty: number=0;

  @ApiProperty({ example: 2, description: 'Quantity of dedicated professional development seats purchased' })
  @IsNumber()
  @Min(0)
  pdUsersQty: number=0;

  @ApiProperty({ example: 0, description: 'Historical legacy Pdev counter flag mapping' })
  @IsNumber()
  @Min(0)
  pdevUsersBought: number=0;
}

export class PurchaseGroupMembershipDto {
  @ApiProperty({ enum: PlanTier, example: 'ESSENTIAL', description: 'Target tier profile structural alignment goal' })
  @IsEnum(PlanTier)
  @IsNotEmpty()
  id: PlanTier=PlanTier.ESSENTIAL;

  @ApiProperty({ example: 'pm_1MvLYwLkdIwHu7ixX', description: 'Stripe token representing authorized card details' })
  @IsString()
  @IsNotEmpty()
  cardId: string='';

  @ApiProperty({ type: GroupMembershipAddonsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => GroupMembershipAddonsDto)
  @IsNotEmpty()
  addons: GroupMembershipAddonsDto=new GroupMembershipAddonsDto();
}