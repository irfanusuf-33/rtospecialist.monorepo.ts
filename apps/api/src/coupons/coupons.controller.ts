import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { PaginationQueryDto } from './dto/coupon-pagination.dto';

@ApiTags('Polymorphic Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a coupon with cross-model dynamic mapping verification tracks' })
  @ApiResponse({ status: 201, description: 'Coupon generated and relationships built successfully.' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all coupons with pagination' })
  @ApiResponse({ status: 200, description: 'Returns a paginated list of coupons.' })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.couponsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch single coupon by database reference key' })
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Disable a coupon by turning isActive to false' })
  @ApiParam({ name: 'id', description: 'Coupon UUID' })
  @ApiResponse({ status: 200, description: 'Coupon has been successfully disabled.' })
  @ApiResponse({ status: 404, description: 'Coupon not found.' })
  async disable(@Param('id') id: string) {
    return this.couponsService.disable(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete a coupon' })
  @ApiParam({ name: 'id', description: 'Coupon UUID' })
  @ApiResponse({ status: 244, description: 'Coupon has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Coupon not found.' })
  async remove(@Param('id') id: string) {
    await this.couponsService.remove(id);
  }
}