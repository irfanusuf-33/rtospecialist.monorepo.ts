import { IsString, IsNotEmpty, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PdevFileDataDto {
  @ApiProperty({ example: 'What is the runtime environment for NestJS?' })
  @IsString()
  @IsNotEmpty()
  question: string = '';

  @ApiProperty({ example: ['Visual Context snippet'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  questionData?: string[];

  @ApiProperty({ example: ['Node.js', 'Python JVM', 'Browser Engine', 'Ruby Core'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  options: string[] = [];

  @ApiProperty({ example: ['Node.js'] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  answer: string[] = [];
}

export class CreatePdevProductDto {
  @ApiProperty({ example: 'file_ref_998877' })
  @IsString()
  @IsNotEmpty()
  fileId: string = '';

  @ApiProperty({ type: [PdevFileDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PdevFileDataDto)
  fileData: PdevFileDataDto[] = [];

  @ApiProperty({ example: 'category-uuid-string' })
  @IsString()
  @IsNotEmpty()
  parentId: string = '';

  @ApiProperty({ example: 'TypeScript Advanced Mock Quiz' })
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty({ example: 'admin-uuid-string' })
  @IsString()
  @IsNotEmpty()
  createdBy: string = ''; // Handled as string input to match Mongoose controller styles

  @ApiProperty({ example: 'Deep-dive validation questions for engineers.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['Instant results', 'Detailed feedback'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({ example: ['Backend Developers'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  courseFor?: string[];

  @ApiProperty({ example: ['Master architectural pipelines'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  objectives?: string[];

  @ApiProperty({ example: ['Full lifetime validation access'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includes?: string[];

  @ApiProperty({ example: 'https://cdn.example.com/icons/ts.png' })
  @IsString()
  @IsNotEmpty()
  iconUrl: string = '';

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  fileUploaded?: boolean;
}