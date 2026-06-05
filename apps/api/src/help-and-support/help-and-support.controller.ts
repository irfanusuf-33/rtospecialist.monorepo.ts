import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HelpAndSupportService } from './help-and-support.service';
import { CreateHelpTicketDto } from './dto/create-help-and-support.dto';
import { UpdateHelpTicketDto } from './dto/update-help-and-support.dto';

@Controller('help-and-support')
export class HelpAndSupportController {
  constructor(private readonly service: HelpAndSupportService) {}

  @Post()
  create(@Body() createDto: CreateHelpTicketDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateHelpTicketDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}