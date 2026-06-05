import { PartialType } from '@nestjs/swagger';
import { CreatePdevUserDto } from './create-pdev-user.dto';

export class UpdatePdevUserDto extends PartialType(CreatePdevUserDto) {}