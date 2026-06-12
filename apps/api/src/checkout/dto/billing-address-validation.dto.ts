import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ValidateBillingAddressDto {
  @ApiProperty({ example: 'Headquarters', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '123 Business Rd, Sydney NSW 2000' })
  @IsString()
  @IsNotEmpty({ message: 'Postal address summary line is required.' })
  postalAddress!: string;

  @ApiProperty({ example: '123 Business Rd' })
  @IsString()
  @IsNotEmpty({ message: 'Street name is required.' })
  street!: string;

  @ApiProperty({ example: 'Sydney' })
  @IsString()
  @IsNotEmpty({ message: 'City is required.' })
  city!: string;

  @ApiProperty({ example: 'NSW' })
  @IsString()
  @IsNotEmpty({ message: 'State or territory is required.' })
  state!: string;

  @ApiProperty({ example: '2000' })
  @IsString()
  @IsNotEmpty({ message: 'Postal code is required.' })
  @Length(4, 10, { message: 'Postal code must be a valid length.' })
  postalCode!: string;

  @ApiProperty({ example: 'Australia' })
  @IsString()
  @IsNotEmpty({ message: 'Country is required.' })
  country!: string;
}