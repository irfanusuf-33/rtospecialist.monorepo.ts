import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdevProductDto } from './dto/create-pdevProduct.dto';
import { UpdatePdevProductDto } from './dto/update-pdevProduct.dto';
import { SetQuizQuestionsDto } from './dto/create-quiz-questions.dto';
import { PaginationQueryDto } from './dto/get-products-query.dto';

@Injectable()
export class PdevProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePdevProductDto) {
    const { fileData, createdBy, parentId, ...restOfDto } = dto;

    // 1. Structural Safeguards: Ensure referenced Parent Category and Admin exist
    const categoryExists = await this.prisma.pdevProductCategory.findUnique({ where: { id: parentId } });
    if (!categoryExists) throw new BadRequestException(`Category with ID "${parentId}" does not exist.`);

    const adminExists = await this.prisma.admin.findUnique({ where: { id: createdBy } });
    if (!adminExists) throw new BadRequestException(`Admin with ID "${createdBy}" does not exist.`);

    // 2. Perform transactional nested writes
    return this.prisma.pdevProduct.create({
      data: {
        ...restOfDto,
        parentId,
        createdById: createdBy,
        fileData: {
          create: fileData,
        },
      },
      include: {
        fileData: true,
        parent: true,
        createdBy: { select: { id: true, email: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.pdevProduct.findMany({
      include: {
        fileData: true,
        parent: true,
        createdBy: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.pdevProduct.findUnique({
      where: { id },
      include: {
        fileData: false,
        parent: false,
        createdBy: false,
      },
    });
    if (!product) throw new NotFoundException(`Product with ID "${id}" not found`);
    return product;
  }

  async findOneWithFileData (id: string) {
    const product = await this.prisma.pdevProduct.findUnique({
      where: { id },
      include: {
        fileData: true,
        parent: false,
        createdBy: false,
      },
    });
    if (!product) throw new NotFoundException(`Product with ID "${id}" not found.`);
    return product;
  }

  async update(id: string, dto: UpdatePdevProductDto) {
    await this.findOne(id);

    const { fileData, createdBy, parentId, ...restOfDto } = dto;
    if (parentId) {
      const categoryExists = await this.prisma.pdevProductCategory.findUnique({ where: { id: parentId } });
      if (!categoryExists) throw new BadRequestException(`Category with ID "${parentId}" does not exist.`);
    }

    return this.prisma.pdevProduct.update({
      where: { id },
      data: {
        ...restOfDto,
        ...(parentId && { parentId }),
        ...(createdBy && { createdById: createdBy }),
        ...(fileData && {
          fileData: {
            deleteMany: {},
            create: fileData,
          },
        }),
      },
      include: {
        fileData: true,
        parent: true,
        createdBy: { select: { id: true, email: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pdevProduct.delete({ where: { id } });
  }

  async setQuizQuestions(dto: SetQuizQuestionsDto) {
    const { fileId, fileData } = dto.formData;
    const existingProduct = await this.prisma.pdevProduct.findFirst({
      where: { fileId },
      select: { id: true },
    });

    if (!existingProduct) {
      throw new NotFoundException('Course with the provided File ID does not exist.');
    }

    try {
      const updatedProduct = await this.prisma.$transaction(async (tx) => {
        await tx.pdevFileData.createMany({
          data: fileData.map((item) => ({
            productId: existingProduct.id,
            question: item.question,
            questionData: item.questionData || [],
            options: item.options || [],
            answer: item.answer,
          })),
        });

        return tx.pdevProduct.update({
          where: { id: existingProduct.id },
          data: { fileUploaded: true },
          include: { fileData: true },
        });
      });

      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update course questions.');
    }
  }

  async findAllProducts(query: PaginationQueryDto) {
    const page = query.page!;
    const limit = query.limit!;
    const skip = (page - 1) * limit;

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.pdevProduct.count(),
      this.prisma.pdevProduct.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          parent: { select: { name: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
      items,
    };
  }

  async findProductsByCategoryId(categoryId: string, query: PaginationQueryDto) {
    const categoryExists = await this.prisma.pdevProductCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      throw new NotFoundException(`Product Category with ID "${categoryId}" not found.`);
    }

    const page = query.page!;
    const limit = query.limit!;
    const skip = (page - 1) * limit;

    const whereCondition = { parentId: categoryId };

    const [totalItems, items] = await this.prisma.$transaction([
      this.prisma.pdevProduct.count({ where: whereCondition }),
      this.prisma.pdevProduct.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
      items,
    };
  }

  async findProductByFileId(fileId: string) {
    const product = await this.prisma.pdevProduct.findFirst({
      where: { fileId },
      include: {
        parent: { select: { name: true } },
        fileData: true,
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with File ID "${fileId}" could not be found.`);
    }

    return product;
  }
}