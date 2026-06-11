import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Length, 
  MaxLength, 
  MinLength 
} from 'class-validator';
import { CreateUserDto } from 'types';

export class RegisterDto implements CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email address of the user' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securePassword123', description: 'The password (min length 6)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastName!: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  jobRole?: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ example: 'ICT qualification' })
  @IsString()
  @IsOptional()
  interestType?: string;

  @ApiPropertyOptional({ example: "4685224" })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  otp: string='';
}