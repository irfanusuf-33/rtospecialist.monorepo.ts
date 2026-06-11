import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: "example@xyz.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Hello@123" })
  @IsString()
  password!: string;

  @ApiProperty({ example: "client" })
  @IsString()
  accountType: string | undefined;
}