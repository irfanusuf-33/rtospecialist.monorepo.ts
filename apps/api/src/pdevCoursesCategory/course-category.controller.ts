import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PdevProductCategoryService } from './course-category.service'
import { CreatePdevProductCategoryDto, UpdatePdevProductCategoryDto } from './dto/create-course-category.dto';

@Controller('pdev-product-categories')
export class PdevProductCategoryController {
  constructor(private readonly categoryService: PdevProductCategoryService) {}

  @Post()
  async create(@Body() createDto: CreatePdevProductCategoryDto) {
    return this.categoryService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDto: UpdatePdevProductCategoryDto
  ) {
    return this.categoryService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }
}