import { PartialType } from '@nestjs/swagger';
import { CreateHelpTicketDto } from './create-help-and-support.dto';

export class UpdateHelpTicketDto extends PartialType(CreateHelpTicketDto) {}