import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Shopping Carts Engine')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialize a new shopping cart entity profile instance' })
  @ApiResponse({ status: 201, description: 'The basket container space has been cleanly created.' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve active shopping cart item lists targeting explicit User IDs' })
  findByUser(@Param('userId') userId: string) {
    return this.cartsService.findByUserId(userId);
  }

  @Patch('user/:userId')
  @ApiOperation({ summary: 'Atomically sync or rewrite product items allocations currently active inside a user cart' })
  update(@Param('userId') userId: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(userId, updateCartDto);
  }

  @Delete('user/:userId/clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Flush out all tracking item allocations from an active session cart' })
  clear(@Param('userId') userId: string) {
    return this.cartsService.clearCart(userId);
  }
}