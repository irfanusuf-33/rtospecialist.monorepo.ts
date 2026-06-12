import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path based on your Prisma module layout
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetAllOrdersQueryDto, OrderPaginationDto } from './dto/order-pagination.dto';
import { AwsS3Service } from '../aws/aws.service';
import { DownloadProductDto } from './dto/download-productData.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
  ) {}

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
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: {
        ...orderData,
        coupon: coupon ? JSON.parse(JSON.stringify(coupon)) : undefined,
      },
      include: {
        products: true,
        billingAddress: true,
      },
    });
  }

  async getUserOrders(userId: string, query: OrderPaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          products: true,
          billingAddress: true,
        },
      }),
      this.prisma.order.count({
        where: { userId },
      }),
    ]);

    return {
      orders,
      pagination: this.mapPaginationMeta(total, page, limit, orders.length),
    };
  }

  async getAllOrders(query: GetAllOrdersQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (query.status) whereClause.status = query.status;
    if (query.email) whereClause.email = { contains: query.email, mode: 'insensitive' };

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          products: true,
          billingAddress: true,
          user: {
            select: { id: true, email: true },
          },
        },
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    return {
      orders,
      pagination: this.mapPaginationMeta(total, page, limit, orders.length),
    };
  }

  private mapPaginationMeta(total: number, page: number, limit: number, count: number) {
    return {
      totalItems: total,
      itemCount: count,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async verifyAndGetProductStream(userId: string, userEmail: string, accountType: string, ip: string, url: string, dto: DownloadProductDto) {
    // validate if request is comming form client account
    if (accountType !== 'client') {
      throw new BadRequestException('Only client can download the product data for any order.');
    }
    const order = await this.prisma.order.findUnique({
      where: {
        id: dto.activeOrderUuid,
        userId: userId,
      },
      include: {
        products: {
          where: {
            id: dto.fileId,
            productId: dto.productUuid
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found, or authorization access was denied.');
    }

    if (order.status !== 'succeeded') {
      throw new BadRequestException('Order lifecycle is not completed. Asset download locked.');
    }

    if (!order.products || order.products.length === 0) {
      throw new NotFoundException('Mismatched item validation: Target file parameters not found in this order sequence.');
    }

    const targetOrderProduct = order.products[0];
    const fileName = `${targetOrderProduct.productId}.zip`;
    const filePath = `product-attachments/${fileName}`;

    try {
      const logTrailPayload: any = {
        userId: userId,
        email: userEmail,
        action: 'TRAINING_PRODUCT_DOWNLOADED',
        category: 'ORDER',
        status: 'SUCCESS',
        metaData: {
          description: `User successfully validated credentials and downloaded: ${fileName}.`,
          ipAddress: ip,
          route: url,
          fileRecordId: dto.fileId
        }
      };

      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: { trainingResourcesDownloads: { increment: 1 } },
        }),

        this.prisma.logTrail.create({
          data: logTrailPayload,
        }),
      ]);

      const downloadBucket = this.configService.get<string>('AWS_BUCKET_NAME_DOWNLOAD');
      const stream = await this.awsS3Service.downloadStream(filePath, downloadBucket);

      return {
        stream,
        fileName,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(`Secure Stream Pipeline Exception aborted: ${error.message}`);
    }
  }
}