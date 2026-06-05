import { IsString, IsEmail, IsNotEmpty, MaxLength, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAffiliateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string = '';

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string = '';

  @ApiProperty({ example: 'john.doe@affiliate.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string = '';

  @ApiProperty({ example: 'superSecretPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  password: string = '';

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber: string = '';

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  termAndCondAgreed?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  privacyPolicyAgeed?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  cookiePolicyAgreed?: boolean;

  @ApiProperty({ example: 'raw-jwt-or-session-token-string', required: false })
  @IsString()
  @IsOptional()
  authToken?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  scheduledDeletion?: boolean;

  @ApiProperty({ example: '2026-07-15T10:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  deletionAt?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDisabled?: boolean;
}