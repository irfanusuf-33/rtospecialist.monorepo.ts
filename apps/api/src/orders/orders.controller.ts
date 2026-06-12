import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetAllOrdersQueryDto, OrderPaginationDto } from './dto/order-pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user's orders history" })
  @ApiOkResponse({ description: 'Returns matching historical order items.' })
  async getMyOrders(
    @Req() req: any,
    @Query() query: OrderPaginationDto
  ) {
    const userId = req.user.sub;
    return this.ordersService.getUserOrders(userId, query);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Global admin panel: view and filter all orders across the system' })
  @ApiOkResponse({ description: 'Returns aggregate administrative billing logs mapping information.' })
  async getAllOrders(@Query() query: GetAllOrdersQueryDto) {
    return this.ordersService.getAllOrders(query);
  }
}