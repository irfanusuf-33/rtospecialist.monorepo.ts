import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          name: createCategoryDto.name.trim(),
          abbreviation: createCategoryDto.abbreviation.trim(),
          url: createCategoryDto.url?.trim().toLowerCase(),
          newProductFlagExpiry: createCategoryDto.newProductFlagExpiry 
            ? new Date(createCategoryDto.newProductFlagExpiry) 
            : null
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Category name, abbreviation, or URL already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subcategories: true }
    });
    if (!category) throw new NotFoundException(`Category with ID "${id}" not found`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...updateCategoryDto,
          ...(updateCategoryDto.name && { name: updateCategoryDto.name.trim() }),
          ...(updateCategoryDto.abbreviation && { abbreviation: updateCategoryDto.abbreviation.trim() }),
          ...(updateCategoryDto.url && { url: updateCategoryDto.url.trim().toLowerCase() }),
          ...(updateCategoryDto.newProductFlagExpiry && { 
            newProductFlagExpiry: new Date(updateCategoryDto.newProductFlagExpiry) 
          })
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
    return this.prisma.category.delete({ where: { id } });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}