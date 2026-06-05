import { PartialType } from '@nestjs/swagger';
import { CreateLogTrailDto } from './create-log-trail.dto';

export class UpdateLogTrailDto extends PartialType(CreateLogTrailDto) {}
