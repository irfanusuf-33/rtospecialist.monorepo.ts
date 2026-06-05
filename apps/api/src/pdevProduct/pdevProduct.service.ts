import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdevProductDto } from './dto/create-pdevProduct.dto';
import { UpdatePdevProductDto } from './dto/update-pdevProduct.dto';

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
        fileData: true,
        parent: true,
        createdBy: { select: { id: true, email: true } },
      },
    });
    if (!product) throw new NotFoundException(`Product with ID "${id}" not found`);
    return product;
  }

  async update(id: string, dto: UpdatePdevProductDto) {
    await this.findOne(id); // Throws 404 if missing

    const { fileData, createdBy, parentId, ...restOfDto } = dto;

    // Validate optional relation field updates if provided
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
            // Drop old questions linked to this product id, then insert the new array set safely
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
}