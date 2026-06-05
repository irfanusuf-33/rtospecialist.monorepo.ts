import { IsString, IsNotEmpty, MaxLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { TicketStatus, TicketGroup } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHelpTicketDto {
  @ApiProperty({ example: 'Payment Failure' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  // Replicates: /^[A-Za-z0-9 _-]+$/
  @Matches(/^[A-Za-z0-9 _-]+$/, { message: 'Please enter a valid title (letters, numbers, spaces, underscores, and hyphens only)' })
  title: string = '';

  @ApiProperty({ example: 'My card was charged but the subscription is not active.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  // Replicates script validation check: /<script.*?>.*?<\/script>/i
  @Matches(/^(?!.*<script.*?>.*?<\/script>).*$/is, { message: 'Invalid input. Scripts are not allowed in description' })
  body: string = '';

  @ApiProperty({ enum: TicketStatus, default: TicketStatus.pending, required: false })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiProperty({ enum: TicketGroup, example: TicketGroup.PAYMENT })
  @IsEnum(TicketGroup)
  @IsNotEmpty()
  group!: TicketGroup;

  @ApiProperty({ example: 'cl01234567890abcdefgh', required: false })
  @IsString()
  @IsOptional()
  user?: string; // Tracks legacy user incoming property format

  @ApiProperty({ example: 'In-App billing', required: false })
  @IsString()
  @IsOptional()
  type?: string;
}