import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Cloud Computing' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  name: string = '';

  @ApiProperty({ example: 'cloud-computing', required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  disable?: boolean;

  @ApiProperty({ 
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 
    description: 'The parent Category UUID primary key' 
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID() // Enforces a valid relational PostgreSQL UUID format
  categoryId: string = '';
}