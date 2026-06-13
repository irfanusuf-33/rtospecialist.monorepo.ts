import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class InitiateEmailChangeDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;
}

export class VerifyEmailChangeDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters.' })
  otp!: string;
}