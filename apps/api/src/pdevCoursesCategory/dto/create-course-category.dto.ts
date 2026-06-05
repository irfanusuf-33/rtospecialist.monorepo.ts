import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePdevProductCategoryDto {
  @ApiProperty({ example: 'Information Technology' })
  @IsString()
  @IsNotEmpty()
  name: string='';

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isDisabled?: boolean;

  @ApiProperty({ example: 'uuid-v4' })
  @IsUUID() // Enforces that the passed string must be a valid UUID v4
  @IsNotEmpty()
  createdBy: string='';
}

export class UpdatePdevProductCategoryDto extends PartialType(CreatePdevProductCategoryDto) {}