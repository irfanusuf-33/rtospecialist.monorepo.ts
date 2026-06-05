import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponType, TargetProductType } from '@prisma/client';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Directly queries the model specified by the type property dynamically using string bracket index syntax.
   */
  private async validateProductExists(productId: string, modelName: TargetProductType) {
    const targetModel = this.prisma[modelName] as any;

    if (!targetModel) {
      throw new BadRequestException(`Model "${modelName}" is missing on current Prisma client instance configuration.`);
    }

    const targetInstance = await targetModel.findUnique({
      where: { id: productId },
    });

    if (!targetInstance) {
      throw new NotFoundException(`Resource with ID "${productId}" not found inside targeted table structure "${modelName}".`);
    }
    
    return targetInstance;
  }

  async create(createCouponDto: CreateCouponDto) {
    const { applicableProducts, code, ...couponData } = createCouponDto;
    const formattedCode = code.toUpperCase().trim();

    if (couponData.type === CouponType.percentage && couponData.value > 100) {
      throw new BadRequestException('Percentage discount value cannot exceed 100%.');
    }

    const start = new Date(couponData.startDate || new Date().toISOString());
    const end = new Date(couponData.endDate);
    if (end <= start) throw new BadRequestException('End date must be after the start date.');

    const existing = await this.prisma.coupon.findUnique({ where: { code: formattedCode } });
    if (existing) throw new ConflictException(`Coupon code "${formattedCode}" already exists.`);

    // Perform dynamic lookup across distinct tables dynamically via user input runtime variables
    if (applicableProducts && applicableProducts.length > 0) {
      for (const item of applicableProducts) {
        await this.validateProductExists(item.productId, item.productType);
      }
    }

    return this.prisma.coupon.create({
      data: {
        ...couponData,
        code: formattedCode,
        startDate: start,
        endDate: end,
        applicableProducts: applicableProducts && applicableProducts.length > 0
          ? {
              create: applicableProducts.map(item => ({
                productId: item.productId,
                productType: item.productType,
              })),
            }
          : undefined,
      },
      include: { applicableProducts: true }
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      include: { applicableProducts: true }
    });
  }

  async findOne(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { applicableProducts: true }
    });
    if (!coupon) throw new NotFoundException(`Coupon with ID "${id}" not found`);
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    await this.findOne(id);
    const { applicableProducts, code, ...couponData } = updateCouponDto;
    
    const dataUpdate: any = { ...couponData };
    if (code) dataUpdate.code = code.toUpperCase().trim();
    if (couponData.startDate) dataUpdate.startDate = new Date(couponData.startDate);
    if (couponData.endDate) dataUpdate.endDate = new Date(couponData.endDate);

    if (applicableProducts && applicableProducts.length > 0) {
      for (const item of applicableProducts) {
        await this.validateProductExists(item.productId, item.productType);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (applicableProducts) {
        await tx.couponProduct.deleteMany({ where: { couponId: id } });
        dataUpdate.applicableProducts = {
          create: applicableProducts.map(item => ({
            productId: item.productId,
            productType: item.productType,
          })),
        };
      }

      return tx.coupon.update({
        where: { id },
        data: dataUpdate,
        include: { applicableProducts: true }
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coupon.delete({ where: { id } });
  }
}