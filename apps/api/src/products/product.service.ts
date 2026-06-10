import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryPaginationDto } from './dto/query-pagination.dto';
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

  async findByCategory(categoryId: string, pagination: QueryPaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip = (page - 1) * limit;

    // check if category exits
    const cateogryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!cateogryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} does not exists`);
    }

    const [products, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          categories: {
            some: { id: categoryId }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: {
          categories: {
            some: { id: categoryId },
          }
        }
      })
    ]);

    return {
      data: products,
      meta: {
        totalItems,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      }
    }
  }

  async findBySubCategory(subCategoryId: string, filters: QueryPaginationDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const subCategoryExists = await this.prisma.subcategory.findUnique({
      where: { id: subCategoryId },
    });

    if (!subCategoryExists) {
      throw new NotFoundException(`Subcategory with ID ${subCategoryId} not found`);
    }
    const whereConditions: Prisma.ProductWhereInput = {
      subcategories: {
        some: { id: subCategoryId },
      },
    };

    if (filters.preOrder !== undefined) {
      whereConditions.preOrder = filters.preOrder;
    }

    const [products, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: whereConditions,
      }),
    ]);

    return {
      data: products,
      meta: {
        totalItems,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}