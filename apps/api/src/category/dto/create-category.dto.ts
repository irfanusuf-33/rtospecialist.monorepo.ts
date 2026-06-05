import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Information Technology' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  name: string = '';

  @ApiProperty({ example: 'IT' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15)
  abbreviation: string = '';

  @ApiProperty({ example: 'Advance your tech career', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  headline?: string;

  @ApiProperty({ example: 'Explore certified global training units', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  subHeadline?: string;

  @ApiProperty({ example: 'https://example.com/icons/it.png' })
  @IsString()
  @IsNotEmpty()
  iconUrl: string = '';

  @ApiProperty({ example: 'information-technology', required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  disable?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isNewlyUpdated?: boolean;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', required: false })
  @IsDateString()
  @IsOptional()
  newProductFlagExpiry?: string;
}