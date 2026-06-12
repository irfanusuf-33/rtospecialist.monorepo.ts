import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoryProductsQueryDto, QueryPaginationDto } from './dto/query-pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('sku/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.productsService.findByProductId(productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products grouped by Category UUID with pagination' })
  @ApiParam({ name: 'categoryId', description: 'The Postgres UUID of the category' })
  async getProductsByCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string, // Enforces valid UUID format checking at runtime
    @Query() paginationDto: QueryPaginationDto,
  ) {
    return this.productsService.findByCategory(categoryId, paginationDto);
  }

  @Get('subcategory/:subcategoryId')
  @ApiOperation({ summary: 'Get products grouped by Subcategory UUID with pagination' })
  @ApiParam({ name: 'subcategoryId', description: 'The Postgres UUID of the subcategory' })
  async getProductsBySubcategory(
    @Param('subcategoryId', ParseUUIDPipe) subcategoryId: string,
    @Query() paginationDto: QueryPaginationDto,
  ) {
    return this.productsService.findBySubCategory(subcategoryId, paginationDto);
  }

  @Get('catalog/:categoryId')
  @ApiOperation({ summary: 'Get category meta data, its subcategories, and paginated products' })
  @ApiParam({ name: 'categoryId', type: 'string', description: 'UUID of the parent category' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: 'Page number (defaults to 1)', example: 1 })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Items per page (defaults to 10)', example: 10 })
  @ApiOkResponse({ description: 'Returns organized category catalog information successfully.' })
  async getCategoryCatalog(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string, // Enforces UUID check at routing level
    @Query() query: CategoryProductsQueryDto,
  ) {
    return this.productsService.getCategoryCatalog(categoryId, query);
  }

  @Post(':productId/upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an attachment course asset file for a product (Admin Only)' })
  @ApiParam({ name: 'productId', type: 'string', description: 'Target Product UUID record' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The binary document or zip archive file to save to AWS S3',
        },
      },
    },
  })
  async uploadProductFile(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.uploadProductFile(productId, file);
  }
}