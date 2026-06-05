import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubcategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      // Direct verification step ensuring the parent category exists
      await this.prisma.category.findUniqueOrThrow({
        where: { id: createSubcategoryDto.categoryId }
      });

      return await this.prisma.subcategory.create({
        data: {
          ...createSubcategoryDto,
          name: createSubcategoryDto.name.trim(),
          url: createSubcategoryDto.url?.trim().toLowerCase()
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('Subcategory name or URL already exists.');
        if (error.code === 'P2025') throw new NotFoundException('Parent Category target not found.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.subcategory.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
      include: { category: true }
    });
    if (!subcategory) throw new NotFoundException(`Subcategory with ID "${id}" not found`);
    return subcategory;
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    await this.findOne(id);
    try {
      return await this.prisma.subcategory.update({
        where: { id },
        data: {
          ...updateSubcategoryDto,
          ...(updateSubcategoryDto.name && { name: updateSubcategoryDto.name.trim() }),
          ...(updateSubcategoryDto.url && { url: updateSubcategoryDto.url.trim().toLowerCase() })
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Unique field conflict during update.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subcategory.delete({ where: { id } });
  }
}