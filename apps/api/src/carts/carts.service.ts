import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { TargetProductType } from '@prisma/client';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateProductExists(productId: string, modelName: TargetProductType) {
    const targetModel = this.prisma[modelName] as any;
    if (!targetModel) {
      throw new BadRequestException(`Target model "${modelName}" does not exist on your Prisma client.`);
    }

    const item = await targetModel.findUnique({ where: { id: productId } });
    if (!item) {
      throw new NotFoundException(`Product item "${productId}" not found in model "${modelName}".`);
    }
    return item;
  }

  async create(createCartDto: CreateCartDto) {
    const { products, userId, ...cartData } = createCartDto;

    // Ensure a user doesn't already have an active cart record
    const existingCart = await this.prisma.cart.findUnique({ where: { userId } });
    if (existingCart) {
      throw new ConflictException(`Cart entity profile already exists for user context ID "${userId}".`);
    }

    // Run polymorphic validation across lists via dynamic lookup
    for (const item of products) {
      await this.validateProductExists(item.productId, item.productType);
    }

    return this.prisma.cart.create({
      data: {
        userId,
        ...cartData,
        products: {
          create: products.map(item => ({
            productId: item.productId,
            productType: item.productType,
            quantity: item.quantity,
          })),
        },
      },
      include: { products: true },
    });
  }

  async findByUserId(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { products: true, coupon: true },
    });
    if (!cart) throw new NotFoundException(`No active cart container built for User ID "${userId}".`);
    return cart;
  }

  async update(userId: string, updateCartDto: UpdateCartDto) {
    const cart = await this.findByUserId(userId);
    const { products, ...cartData } = updateCartDto;

    if (products) {
      for (const item of products) {
        await this.validateProductExists(item.productId, item.productType);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (products) {
        // Wipe old session rows and replace them completely
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        (cartData as any).products = {
          create: products.map(item => ({
            productId: item.productId,
            productType: item.productType,
            quantity: item.quantity,
          })),
        };
      }

      return tx.cart.update({
        where: { userId },
        data: cartData as any,
        include: { products: true },
      });
    });
  }

  async clearCart(userId: string) {
    const cart = await this.findByUserId(userId);
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}