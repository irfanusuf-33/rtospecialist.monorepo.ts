import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class FileDataDto {
  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsArray()
  @IsString({each: true })
  @IsOptional()
  questionData?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  answer!: string[];
}

export class CreateQuizQuestionsBodyDto {
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDataDto)
  fileData!: FileDataDto[];
}

// Wrapper DTO to replicate your exact 'req.body.formData' structure
export class SetQuizQuestionsDto {
  @ValidateNested()
  @Type(() => CreateQuizQuestionsBodyDto)
  formData!: CreateQuizQuestionsBodyDto;
}