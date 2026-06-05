import { PartialType } from '@nestjs/swagger';
import { CreatePdevProductDto } from './create-pdevProduct.dto';

export class UpdatePdevProductDto extends PartialType(CreatePdevProductDto) {}