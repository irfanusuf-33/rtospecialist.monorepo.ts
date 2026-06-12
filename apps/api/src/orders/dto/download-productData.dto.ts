import { IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadProductDto {
  @ApiProperty({ description: 'The custom product ID string or product link reference', example: 'PROD-123' })
  @IsString()
  productUuid!: string;

  @ApiProperty({ description: 'The parent Order UUID string', example: 'e4b449b0-9854-47db-ad90-67df76f13bda' })
  @IsUUID()
  activeOrderUuid!: string;

  @ApiProperty({ description: 'The unique OrderProduct table row UUID', example: 'faa6e632-4753-488b-be15-189f7f4bd999' })
  @IsUUID()
  fileId!: string;
}