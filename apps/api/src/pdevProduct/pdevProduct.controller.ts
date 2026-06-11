import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query, ParseUUIDPipe } from '@nestjs/common';
import { PdevProductsService } from './pdevProduct.service';
import { CreatePdevProductDto } from './dto/create-pdevProduct.dto';
import { UpdatePdevProductDto } from './dto/update-pdevProduct.dto';
import { SetQuizQuestionsDto } from './dto/create-quiz-questions.dto';
import { PaginationQueryDto } from './dto/get-products-query.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('pdev-products')
export class PdevProductsController {
  constructor(private readonly pdevProductsService: PdevProductsService) {}

  @Post()
  create(@Body() createDto: CreatePdevProductDto) {
    return this.pdevProductsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all the professional development products.' })
  async getAllProducts(@Query() query: PaginationQueryDto) {
    return this.pdevProductsService.findAllProducts(query);
  }

  @Get('/product/:id')
  @ApiOperation({ summary: 'Fetch single professional development product without fileData' })
  findOne(@Param('id') id: string) {
    return this.pdevProductsService.findOne(id);
  }

  @Get('/product/data/:id')
  @ApiOperation({ summary: 'Fetch single professional development product with fileData (quiz questions, answers' })
  findOneWithFileData(@Param('id') id: string) {
    return this.pdevProductsService.findOneWithFileData(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePdevProductDto) {
    return this.pdevProductsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdevProductsService.remove(id);
  }

  @Post('General-SetQuizQuestions')
  @HttpCode(HttpStatus.OK)
  async setQuizQuestions(@Body() setQuizQuestionsDto: SetQuizQuestionsDto) {
    return this.pdevProductsService.setQuizQuestions(setQuizQuestionsDto);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Fetch all the professional development products that belong to a specific category.' })
  async getProductsByCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.pdevProductsService.findProductsByCategoryId(categoryId, query);
  }

  @Get('file/:fileId')
  @ApiOperation({ summary: 'Fetch a single professional development product with filed data filter.' })
  async getProductByFileId(@Param('fileId') fileId: string) {
    return this.pdevProductsService.findProductByFileId(fileId);
  }
}