import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PdevProductCourseResultsService } from './pdev-product-course-results.service';
import { CreatePdevProductCourseResultDto } from './dto/create-pdev-product-course-result.dto';
import { UpdatePdevProductCourseResultDto } from './dto/update-pdev-product-course-result.dto';

@Controller('pdev-product-course-results')
export class PdevProductCourseResultsController {
  constructor(private readonly service: PdevProductCourseResultsService) {}

  @Post()
  create(@Body() createDto: CreatePdevProductCourseResultDto) {
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
  update(@Param('id') id: string, @Body() updateDto: UpdatePdevProductCourseResultDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}