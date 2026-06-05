import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdevProductCategoryDto, UpdatePdevProductCategoryDto } from './dto/create-course-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PdevProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePdevProductCategoryDto) {
    // 1. Destructure to extract the creator id passed from your incoming DTO payload
    const { createdBy, ...restOfDto } = dto as any;

    // 2. Verify Admin exists before creation (Replaces the old user check)
    const adminExists = await this.prisma.admin.findUnique({ 
      where: { id: createdBy } 
    });
    if (!adminExists) {
      throw new BadRequestException(`Admin with ID ${createdBy} does not exist.`);
    }

    try {
      return await this.prisma.pdevProductCategory.create({
        data: {
          ...restOfDto,
          // 3. Explicitly link the relational foreign key column
          createdById: createdBy, 
        },
        include: {
          createdBy: { select: { id: true, email: true } }
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Category name already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.pdevProductCategory.findMany({
      include: {
        // Fixes error: Swapped 'creator' out for the actual schema name 'createdBy'
        createdBy: { select: { id: true, email: true } }, 
        products: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.pdevProductCategory.findUnique({
      where: { id },
      include: { 
        // Fixes error: Swapped 'creator' out for the actual schema name 'createdBy'
        createdBy: { select: { id: true, email: true } },
        products: true
      }
    });
    
    if (!category) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, dto: UpdatePdevProductCategoryDto) {
    await this.findOne(id); // Throws NotFoundException if it doesn't exist

    const { createdBy, ...restOfDto } = dto as any;

    return this.prisma.pdevProductCategory.update({
      where: { id },
      data: {
        ...restOfDto,
        // Update the owner ID only if it was explicitly passed in the patch body
        ...(createdBy && { createdById: createdBy })
      },
      include: {
        createdBy: { select: { id: true, email: true } }
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pdevProductCategory.delete({
      where: { id },
    });
  }
}