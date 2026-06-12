import { Controller } from '@nestjs/common';
import { AwsS3Service } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsS3Service) {}
}
