import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class ForgotPasswordDto {
  @ApiProperty({example: "johndoe@example.com"})
  @IsEmail()
  email!: string;
}

export class ForgotPasswordConfirmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}