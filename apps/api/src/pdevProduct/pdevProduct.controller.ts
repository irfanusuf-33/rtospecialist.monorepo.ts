import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PdevProductsService } from './pdevProduct.service';
import { CreatePdevProductDto } from './dto/create-pdevProduct.dto';
import { UpdatePdevProductDto } from './dto/update-pdevProduct.dto';

@Controller('pdev-products')
export class PdevProductsController {
  constructor(private readonly pdevProductsService: PdevProductsService) {}

  @Post()
  create(@Body() createDto: CreatePdevProductDto) {
    return this.pdevProductsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.pdevProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdevProductsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePdevProductDto) {
    return this.pdevProductsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdevProductsService.remove(id);
  }
}