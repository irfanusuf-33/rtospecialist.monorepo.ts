import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path based on your Prisma module layout
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { products, billingAddress, coupon, ...orderData } = createOrderDto;

    // Financial Rule: paymentId & billingAddress are required unless paid purely with CREDITS
    if (orderData.method !== PaymentMethod.CREDITS) {
      if (!orderData.paymentId) {
        throw new BadRequestException('Payment ID is required for non-credit transactions.');
      }
      if (!billingAddress) {
        throw new BadRequestException('Billing address details are required for non-credit transactions.');
      }
    }

    return this.prisma.order.create({
      data: {
        ...orderData,
        // Coupon stored as historical JSON
        coupon: coupon ? JSON.parse(JSON.stringify(coupon)) : undefined,
        products: {
          create: products,
        },
        billingAddress: billingAddress ? { create: billingAddress } : undefined,
      },
      include: {
        products: true,
        billingAddress: true,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { products: true, billingAddress: true },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { products: true, billingAddress: true },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { products, billingAddress, coupon, ...orderData } = updateOrderDto;

    // Check if order exists first
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        ...orderData,
        coupon: coupon ? JSON.parse(JSON.stringify(coupon)) : undefined,
        // Nested updates for products or billingAddresses can be expanded here if your app allows modifying placed orders
      },
      include: {
        products: true,
        billingAddress: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({
      where: { id },
    });
  }
}