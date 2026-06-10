import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto, AddCartItemDto, AddMultipleCartItemsDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { TargetProductType, Prisma, PlanStatus } from '@prisma/client';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { calculateCartTotals, CartItemCalculatorInput } from './utils/cart-calculator.util';

type UserWithMemberships = Prisma.UserGetPayload<{
  include: { memberships: true };
}>;

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) { }

  // helper function to ensure a cart exists for a user or create one if does not exists.
  private async getOrCreateCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  private async validateProductExists(productId: string, type: TargetProductType) {
    const targetModel = this.prisma[type] as any;
    if (!targetModel) {
      throw new BadRequestException(`Target model "${type}" does not exist on your Prisma client.`);
    }
    if (type === TargetProductType.Product) {
      const item = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!item) throw new NotFoundException(`Product with ID "${productId}" not found`);
    } else if (type === TargetProductType.PdevProduct) {
      const item = await this.prisma.pdevProduct.findUnique({ where: { id: productId } });
      if (!item) throw new NotFoundException(`PdevProduct with ID "${productId}" not found`);
    }
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
    // 1. Fetch the user's cart along with product catalog definitions across schemas
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        coupon: true,
        products: {
          include: {
            product: true,
            pdevProduct: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`No active cart container built for User ID "${userId}".`);
    }

    // 2. Fetch the User profile to get live credit balances, including active memberships
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: {
            status: PlanStatus.paid,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User record not found for ID "${userId}".`);
    }

    // 3. Cast the user safely to our local intersection type to satisfy the TS compiler
    const userWithRelations = user as UserWithMemberships;

    // Pull balances directly from the User wallet properties (deposited values)
    const availableUnitCredits = userWithRelations.unitCredits ?? 0;
    const availableCertCredits = userWithRelations.certCredits ?? 0;

    // 4. Determine the highest active group plan tier for membership discounts
    let highestGroupPlanTier: string | null = null;
    const tierWeights: Record<string, number> = { 
      BASIC: 1, 
      STARTER: 2, 
      ESSENTIAL: 3, 
      GROWTH: 4, 
      ENTERPRISE: 5 
    };

    userWithRelations.memberships.forEach((membership) => {
      const currentTierStr = membership.planTier.toString().toUpperCase();
      const currentWeight = tierWeights[currentTierStr] || 0;
      const highestWeight = tierWeights[highestGroupPlanTier || ''] || 0;

      if (currentWeight > highestWeight) {
        highestGroupPlanTier = currentTierStr;
      }
    });

    const groupPlanPayload = highestGroupPlanTier ? { planId: highestGroupPlanTier } : null;
    const totals = calculateCartTotals(
      cart.products as unknown as CartItemCalculatorInput[],
      availableUnitCredits,
      groupPlanPayload,
      availableCertCredits,
      cart.coupon,
    );

    return {
      id: cart.id,
      userId: cart.userId,
      referralId: cart.referralId,
      couponId: cart.couponId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      coupon: cart.coupon,
      userWalletBalances: {
        unitCredits: availableUnitCredits,
        certCredits: availableCertCredits,
      },
      activePlansSummary: userWithRelations.memberships.map((m) => ({
        type: m.type,
        tier: m.planTier,
      })),
      totals,
      items: cart.products.map((item) => ({
        id: item.id,
        productType: item.productType,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        details: item.product || item.pdevProduct, // Polymorphic resolution branch
      })),
    };
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

  async addToCart(userId: string, dto: AddCartItemDto) {
    const { productId, productType } = dto;

    await this.validateProductExists(productId, productType);
    const cart = await this.getOrCreateCart(userId);
    const trackingClause = productType === TargetProductType.Product
      ? { cartId: cart.id, productId, productType }
      : { cartId: cart.id, pdevProductId: productId, productType };
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: trackingClause,
    });

    if (existingCartItem) {
      return {
        ...existingCartItem,
        message: 'Product already present in cart, skipped increment.',
      };
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productType,
        quantity: 1,
        ...(productType === TargetProductType.Product
          ? { productId: productId }
          : { pdevProductId: productId }  // Fills pdev column, leaves productId as null
        ),
      },
    });
  }

  async addMultipleItemsToCart(userId: string, dto: AddMultipleCartItemsDto) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    if (dto.items.length === 0) {
      return { success: true, itemsAdded: 0, data: [] };
    }

    const cartItemsData = dto.items.map((item) => {
      const isStandardProduct = item.productType === TargetProductType.Product;

      return {
        cartId: cart.id,
        productType: item.productType,
        quantity: 1,
        productId: isStandardProduct ? item.productId : null,
        pdevProductId: !isStandardProduct ? item.productId : null,
      };
    });

    const result = await this.prisma.cartItem.createMany({
      data: cartItemsData,
      skipDuplicates: true,
    });

    return {
      success: true,
      message: 'Cart processing complete.',
      newItemsInserted: result.count,
    };
  }

  async removeSingleItem(userId: string, dto: RemoveCartItemDto) {
    const { productId, productType } = dto;
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart not found for this user.`);
    }

    try {
      const deletedItem = await this.prisma.cartItem.delete({
        where: {
          cartId_productId_productType: {
            cartId: cart.id,
            productId,
            productType,
          },
        },
      });

      return {
        success: true,
        message: 'Item successfully removed from cart.',
        removedItem: deletedItem,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`This item does not exist in your cart.`);
      }
      throw error;
    }
  }
}