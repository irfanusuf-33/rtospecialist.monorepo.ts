import { 
  IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, 
  IsNumber, IsEnum, IsBoolean, ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { GroupType, QualificationLevel, VersionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDetailsBulletDto {
  @ApiProperty({ example: 'Prerequisites' })
  @IsString()
  @MaxLength(500)
  name: string = '';

  @ApiProperty({ example: 'Basic understanding of JavaScript ES6+' })
  @IsString()
  @MaxLength(2000)
  description: string = '';
}

export class ProductDetailsSectionDto {
  @ApiProperty({ example: 'Course Overview' })
  @IsString()
  @MaxLength(500)
  title: string = '';

  @ApiProperty({ example: 'This section covers fundamental concepts.' })
  @IsString()
  @MaxLength(2000)
  description: string = '';

  @ApiProperty({ type: [ProductDetailsBulletDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailsBulletDto)
  bullets: ProductDetailsBulletDto[] = [];
}

export class CreateProductDto {
  @ApiProperty({ example: 'NESTJS-CORE-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  productId: string = '';

  @ApiProperty({ example: 'Mastering NestJS Architecture' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  name: string = '';

  @ApiProperty({ example: 'A complete guide to scaling backend enterprise applications.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string = '';

  @ApiProperty({ example: ['Includes certificate', 'Lifetime access'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  aboutUnit?: string[];

  @ApiProperty({ example: 'Ideal for Express developers looking to level up.', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  targetLearnerDescription?: string;

  @ApiProperty({ example: ['Backend Engineers', 'Full Stack Developers'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetLearnerBullets?: string[];

  @ApiProperty({ example: 'By the end of this module, you will build fully typed APIs.', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  learningOutcomesDescription?: string;

  @ApiProperty({ example: ['Understand Dependency Injection', 'Implement Guard Auths'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  learningOutcomesBullets?: string[];

  @ApiProperty({ example: ['12 Modules', '24 High-Quality Videos'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  productDetails?: string[];

  @ApiProperty({
    type: [ProductDetailsSectionDto],
    required: false,
    example: [
      {
        title: 'Module 1: Introduction',
        description: 'Getting started with NestJS CLI and basic setup.',
        bullets: [
          { name: 'Installation', description: 'Setting up Node and globally installing CLI.' }
        ]
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailsSectionDto)
  @IsOptional()
  productDetailsSections?: ProductDetailsSectionDto[];

  @ApiProperty({ example: 'https://example.com/courses/nestjs-core', required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number = 0;

  @ApiProperty({ example: 149.99 })
  @IsNumber()
  @IsNotEmpty()
  salePrice: number = 0;

  @ApiProperty({ example: ['a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'], required: false, description: 'Array of Category UUIDs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiProperty({ example: ['z9y8x7w6-v5u4-3t2s-1r0q-9p8o7n6m5l4k'], required: false, description: 'Array of Subcategory UUIDs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subcategoryIds?: string[];

  @ApiProperty({ enum: GroupType, example: GroupType.Core_Units })
  @IsEnum(GroupType)
  @IsNotEmpty()
  group: GroupType = GroupType.Core_Units;

  @ApiProperty({ enum: QualificationLevel, isArray: true, example: [QualificationLevel.Diploma], required: false })
  @IsArray()
  @IsEnum(QualificationLevel, { each: true })
  @IsOptional()
  qualificationLevel?: QualificationLevel[];

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  preOrder?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  fileUploaded?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  versionNumber?: number;

  @ApiProperty({ enum: VersionStatus, example: VersionStatus.available, required: false })
  @IsEnum(VersionStatus)
  @IsOptional()
  versionStatus?: VersionStatus;
}