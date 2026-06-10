import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SubcategoriesService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }

  @Get('subcategories')
  @ApiOperation({ summary: 'Get all subcategories globally' })
  async getAllSubcategories() {
    return this.subcategoriesService.findAllSubcategories();
  }

  @Get('category/:categoryId/subcategories')
  @ApiOperation({ summary: 'Get all subcategories belonging to a specific category' })
  @ApiParam({ name: 'categoryId', description: 'The Postgres UUID of the parent category' })
  async getSubcategoriesByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ) {
    return this.subcategoriesService.findSubcategoriesByCategory(categoryId);
  }
}