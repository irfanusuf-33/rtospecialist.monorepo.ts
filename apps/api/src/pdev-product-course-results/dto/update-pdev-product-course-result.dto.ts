import { PartialType } from '@nestjs/swagger';
import { CreatePdevProductCourseResultDto } from './create-pdev-product-course-result.dto';

export class UpdatePdevProductCourseResultDto extends PartialType(CreatePdevProductCourseResultDto) {}