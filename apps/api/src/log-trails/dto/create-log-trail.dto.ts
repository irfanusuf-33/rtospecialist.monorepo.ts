import { IsString, IsNotEmpty, IsEnum, IsOptional, IsEmail, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LogCategory, LogStatus, LogStage } from '@prisma/client';

class TargetDto {
  @ApiPropertyOptional({ example: 'products', description: 'The related database mapping source name context' })
  @IsString()
  @IsOptional()
  collectionName?: string;

  @ApiPropertyOptional({ example: '8cfda241-1123-4567-b89c-cc7190d7cde3', description: 'Target entity key pointer' })
  @IsString()
  @IsOptional()
  documentId?: string;

  @ApiPropertyOptional({ example: 'Premium Course Bundle Plan', description: 'Human-readable descriptor fallback flag' })
  @IsString()
  @IsOptional()
  displayName?: string;
}

class MetaDataDto {
  @ApiPropertyOptional({ example: 'User updated profile configuration settings' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '192.168.1.1' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...' })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({ example: '/api/v1/users/profile' })
  @IsString()
  @IsOptional()
  route?: string;

  @ApiPropertyOptional({ example: { status: 'pending' }, description: 'Pre-mutation document copy layer state block' })
  @IsObject()
  @IsOptional()
  previousState?: any;

  @ApiPropertyOptional({ example: { status: 'active' }, description: 'Post-mutation applied confirmation modifications layout trace' })
  @IsObject()
  @IsOptional()
  newState?: any;

  @ApiPropertyOptional({ example: 'JWT token expired validation fault trace context.' })
  @IsString()
  @IsOptional()
  errorMessage?: string;
}

export class CreateLogTrailDto {
  @ApiPropertyOptional({ example: 'usr_cl78abc123', description: 'Optional execution source primary unique operator ID string' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ example: 'ADMIN' })
  @IsString()
  @IsOptional()
  accountType?: string;

  @ApiPropertyOptional({ example: 'security@enterprise.io' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'PRODUCT_PRICE_UPDATE', description: 'Uppercase structural operation activity key name string' })
  @IsString()
  @IsNotEmpty()
  action: string='SYSTEM_EVENT';

  @ApiProperty({ enum: LogCategory, example: 'PRODUCT' })
  @IsEnum(LogCategory)
  @IsNotEmpty()
  category: LogCategory=LogCategory.PRODUCT;

  @ApiPropertyOptional({ enum: LogStatus, example: 'SUCCESS', default: 'SUCCESS' })
  @IsEnum(LogStatus)
  @IsOptional()
  status?: LogStatus = LogStatus.SUCCESS;

  @ApiPropertyOptional({ enum: LogStage, example: 'COMPLETED', default: 'COMPLETED' })
  @IsEnum(LogStage)
  @IsOptional()
  stage?: LogStage = LogStage.COMPLETED;

  @ApiPropertyOptional({ type: TargetDto, description: 'Composite resource relational telemetry snapshot mapping package block' })
  @IsObject()
  @IsOptional()
  target?: TargetDto;

  @ApiPropertyOptional({ type: MetaDataDto, description: 'Unstructured operational tracing fields, environmental metadata, and error context data parameters' })
  @IsObject()
  @IsOptional()
  metaData?: MetaDataDto;
}