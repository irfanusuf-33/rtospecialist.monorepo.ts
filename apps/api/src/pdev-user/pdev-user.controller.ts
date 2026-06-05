import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PdevUsersService } from './pdev-user.service';
import { CreatePdevUserDto } from './dto/create-pdev-user.dto';
import { UpdatePdevUserDto } from './dto/update-pdev-user.dto';

@Controller('pdev-users')
export class PdevUsersController {
  constructor(private readonly service: PdevUsersService) {}

  @Post()
  create(@Body() createDto: CreatePdevUserDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdatePdevUserDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}