import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdevProductCourseResultDto } from './dto/create-pdev-product-course-result.dto';
import { UpdatePdevProductCourseResultDto } from './dto/update-pdev-product-course-result.dto';

@Injectable()
export class PdevProductCourseResultsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePdevProductCourseResultDto) {
    const { user, generalUser, ...restOfDto } = dto;

    const pdevUserExists = await this.prisma.pdevUser.findUnique({ where: { id: user } });
    if (!pdevUserExists) throw new BadRequestException(`PdevUser profile ID "${user}" does not exist.`);

    const generalUserExists = await this.prisma.user.findUnique({ where: { id: generalUser } });
    if (!generalUserExists) throw new BadRequestException(`Base User with ID "${generalUser}" does not exist.`);

    return this.prisma.pdevProductCourseResult.create({
      data: {
        ...restOfDto,
        staffUserId: user,
        generalUserId: generalUser,
      },
      include: {
        staffUser: true,
        generalUser: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.pdevProductCourseResult.findMany({
      include: {
        staffUser: true,
        generalUser: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.pdevProductCourseResult.findUnique({
      where: { id },
      include: {
        staffUser: true,
        generalUser: true,
      },
    });
    if (!record) throw new NotFoundException(`Course evaluation profile with ID "${id}" not found.`);
    return record;
  }

  async update(id: string, dto: UpdatePdevProductCourseResultDto) {
    await this.findOne(id);
    const { user, generalUser, ...restOfDto } = dto;

    if (user) {
      const pdevUserExists = await this.prisma.pdevUser.findUnique({ where: { id: user } });
      if (!pdevUserExists) throw new BadRequestException(`PdevUser profile ID "${user}" does not exist.`);
    }

    if (generalUser) {
      const generalUserExists = await this.prisma.user.findUnique({ where: { id: generalUser } });
      if (!generalUserExists) throw new BadRequestException(`Base User with ID "${generalUser}" does not exist.`);
    }

    return this.prisma.pdevProductCourseResult.update({
      where: { id },
      data: {
        ...restOfDto,
        ...(user && { staffUserId: user }),
        ...(generalUser && { generalUserId: generalUser }),
      },
      include: {
        staffUser: true,
        generalUser: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pdevProductCourseResult.delete({ where: { id } });
  }
}