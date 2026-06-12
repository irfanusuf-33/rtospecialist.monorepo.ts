// src/aws/aws.module.ts
import { Module, Global } from '@nestjs/common';
import { AwsS3Service } from './aws.service';

@Global()
@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}