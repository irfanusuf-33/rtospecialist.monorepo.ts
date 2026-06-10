import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddCartItemDto, AddMultipleCartItemsDto, CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

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

  @Post('add-single')
  @ApiOperation({ summary: 'Add a single product to cart (Increments if existing)' })
  async addSingleItemToCart(
    @Body() addCartItemDto: AddCartItemDto,
    @Req() req: any
  ) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.cartsService.addToCart(userId, addCartItemDto);
  }

  @Post('add-multiple')
  @ApiOperation({ summary: 'Add an array block of product/pdev elements to cart' })
  async addMultipleItemsToCart(
    @Body() addMultipleCartItemsDto: AddMultipleCartItemsDto,
    @Req() req: any
  ) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.cartsService.addMultipleItemsToCart(userId, addMultipleCartItemsDto);
  }

  @Delete('remove-item')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a single item from the cart entirely' })
  async removeSingleItemFromCart(
    @Body() removeCartItemDto: RemoveCartItemDto,
    @Req() req: any
  ) {
    const userId = req.user?.id || 'cmq1xw6790000vj2809dnzrkk';
    return this.cartsService.removeSingleItem(userId, removeCartItemDto);
  }
}