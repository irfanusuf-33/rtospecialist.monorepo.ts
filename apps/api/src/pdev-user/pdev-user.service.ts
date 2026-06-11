import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdevUserDto } from './dto/create-pdev-user.dto';
import { UpdatePdevUserDto } from './dto/update-pdev-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PdevUsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePdevUserDto) {
    const { user, ...restOfDto } = dto;

    const baseUserExists = await this.prisma.user.findUnique({ where: { id: user } });
    if (!baseUserExists) {
      throw new BadRequestException(`Parent User with ID "${user}" does not exist.`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    try {
      return await this.prisma.pdevUser.create({
        data: {
          ...restOfDto,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          email: dto.email.trim().toLowerCase(),
          phoneNumber: dto.phoneNumber.trim(),
          password: hashedPassword,
          generalUserId: user,
        },
        include: { generalUser: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A record with this identifier criteria already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.pdevUser.findMany({
      include: { generalUser: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pdevUser = await this.prisma.pdevUser.findUnique({
      where: { id },
      include: { generalUser: true, courseResults: true },
    });
    if (!pdevUser) throw new NotFoundException(`Professional development user profile with ID "${id}" not found`);
    return pdevUser;
  }

  async findByEmail(email: string) {
    const pdevUser = await this.prisma.pdevUser.findUnique({
      where: { email } as any,
    });
    if (!pdevUser) throw new NotFoundException(`Professional development user with email ${email} was not found`);
    return pdevUser;
  }

  async update(id: string, dto: UpdatePdevUserDto) {
    await this.findOne(id);
    const { user, ...restOfDto } = dto;

    const dataToUpdate: Prisma.PdevUserUpdateInput = {
      ...restOfDto,
      ...(dto.firstName && { firstName: dto.firstName.trim() }),
      ...(dto.lastName && { lastName: dto.lastName.trim() }),
      ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber.trim() }),
    };

    if (dto.email) {
      dataToUpdate.email = dto.email.trim().toLowerCase();
    }

    if (user) {
      const baseUserExists = await this.prisma.user.findUnique({ where: { id: user } });
      if (!baseUserExists) throw new BadRequestException(`User with ID "${user}" does not exist.`);
      dataToUpdate.generalUser = { connect: { id: user } };
    }

    if (dto.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(dto.password, saltRounds);
    }

    return this.prisma.pdevUser.update({
      where: { id },
      data: dataToUpdate,
      include: { generalUser: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pdevUser.delete({ where: { id } });
  }
}