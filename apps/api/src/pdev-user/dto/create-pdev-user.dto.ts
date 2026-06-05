import { IsString, IsEmail, IsNotEmpty, IsBoolean, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePdevUserDto {
  @ApiProperty({ example: 'cl01234567890abcdefgh', description: 'The parent User CUID ID' })
  @IsString()
  @IsNotEmpty()
  user: string = ''; // Maps incoming string identifier cleanly

  @ApiProperty({ example: 'Sarah' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string = '';

  @ApiProperty({ example: 'Connor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string = '';

  @ApiProperty({ example: 'sarah.connor@pdev.net' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string = '';

  @ApiProperty({ example: '+12025550143' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phoneNumber: string = '';

  @ApiProperty({ example: 'v3ryS3cur3P@ss!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(70)
  password: string = '';

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @ApiProperty({ example: 'raw-session-jwt-string', required: false })
  @IsString()
  @IsOptional()
  authToken?: string;
}