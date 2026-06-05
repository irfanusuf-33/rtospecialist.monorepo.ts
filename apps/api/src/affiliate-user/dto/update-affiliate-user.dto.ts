import { PartialType } from '@nestjs/swagger';
import { CreateAffiliateUserDto } from './create-affiliate-user.dto';

export class UpdateAffiliateUserDto extends PartialType(CreateAffiliateUserDto) {}