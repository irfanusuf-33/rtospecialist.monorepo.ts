import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePdevProductCourseResultDto {
  @ApiProperty({ example: 'pdev-user-uuid-here', description: 'The operational PdevUser ID' })
  @IsString()
  @IsNotEmpty()
  user: string = ''; // Preserves legacy payload variable fields cleanly

  @ApiProperty({ example: 'cl01234567890abcdefgh', description: 'The foundational General User CUID ID' })
  @IsString()
  @IsNotEmpty()
  generalUser: string = '';

  @ApiProperty({ example: '42' })
  @IsString()
  @IsNotEmpty()
  correctAnswers: string = '';

  @ApiProperty({ example: '50' })
  @IsString()
  @IsNotEmpty()
  totalQuestions: string = '';

  @ApiProperty({ example: 'file_ref_idx_101' })
  @IsString()
  @IsNotEmpty()
  fileId: string = '';

  @ApiProperty({ example: 84.0, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number = 0;
}