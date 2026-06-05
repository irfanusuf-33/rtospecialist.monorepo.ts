import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const formattedProductId = createProductDto.productId.trim().toUpperCase();
      const formattedLink = createProductDto.link?.trim().toLowerCase();
      
      // 1. Extract categoryIds, subcategoryIds, and JSON sections from the DTO payload
      const { categoryIds, subcategoryIds, productDetailsSections, ...restOfDto } = createProductDto;

      return await this.prisma.product.create({
        data: {
          ...restOfDto,
          productId: formattedProductId,
          link: formattedLink,
          productDetailsSections: productDetailsSections as any,
          
          // 2. Map the ID strings to true PostgreSQL relational connections
          categories: {
            connect: categoryIds?.map(id => ({ id })) || [],
          },
          subcategories: {
            connect: subcategoryIds?.map(id => ({ id })) || [],
          },
        },
        // Automatically fetch and include the relation objects in the returned API response
        include: {
          categories: true,
          subcategories: true,
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Product ID or Link already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      // Includes the mapped categories and subcategories when fetching lists
      include: {
        categories: true,
        subcategories: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ 
      where: { id },
      include: {
        categories: true,
        subcategories: true,
      },
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async findByProductId(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { productId: productId.toUpperCase() },
      include: {
        categories: true,
        subcategories: true,
      },
    });
    
    if (!product) {
      throw new NotFoundException(`Product with product ID "${productId}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Ensures the product exists first

    const formattedData = { ...updateProductDto };
    if (formattedData.productId) formattedData.productId = formattedData.productId.trim().toUpperCase();
    if (formattedData.link) formattedData.link = formattedData.link.trim().toLowerCase();

    // 1. Extract relation arrays so they don't corrupt the shallow update spread
    const { categoryIds, subcategoryIds, productDetailsSections, ...restOfData } = formattedData;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...restOfData,
        ...(productDetailsSections && {
          productDetailsSections: productDetailsSections as any,
        }),
        
        // 2. Re-map the structural relationships safely if provided in request
        ...(categoryIds && {
          categories: {
            set: categoryIds.map(id => ({ id })),
          },
        }),
        ...(subcategoryIds && {
          subcategories: {
            set: subcategoryIds.map(id => ({ id })),
          },
        }),
      },
      include: {
        categories: true,
        subcategories: true,
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}