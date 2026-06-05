import { IsString, IsEmail, IsNotEmpty, MaxLength, IsArray, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string = '';

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string = '';

  @ApiProperty({ example: 'jane.smith@enterprise.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string = '';

  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  companyName: string = '';

  @ApiProperty({ example: 'Chief Technology Officer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  position: string = '';

  @ApiProperty({ example: '+15550199' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber: string = '';

  @ApiProperty({ example: 'NY' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  state: string = '';

  @ApiProperty({ example: 'We would like to request a discovery session for cloud migration architecture.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  message: string = '';

  @ApiProperty({ example: ['Cloud Consulting', 'Dedicated Support Teams'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services?: string[];

  @ApiProperty({ enum: AppointmentStatus, default: AppointmentStatus.Pending, required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiProperty({ example: '2026-06-15T14:30:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  scheduledDateTime?: string;
}