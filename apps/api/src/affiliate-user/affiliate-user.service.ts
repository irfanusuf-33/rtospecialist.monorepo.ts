import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAffiliateUserDto } from './dto/create-affiliate-user.dto';
import { UpdateAffiliateUserDto } from './dto/update-affiliate-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AffiliateUsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAffiliateUserDto) {
    try {
      const formattedEmail = dto.email.trim().toLowerCase();

      // Explicitly hash password inside service logic to replicate the Mongoose pre-save middleware
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

      return await this.prisma.affiliateUser.create({
        data: {
          ...dto,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          email: formattedEmail,
          password: hashedPassword,
          phoneNumber: dto.phoneNumber.trim(),
          deletionAt: dto.deletionAt ? new Date(dto.deletionAt) : null,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An affiliate account with this email already exists.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.affiliateUser.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.affiliateUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Affiliate user with ID "${id}" not found`);
    return user;
  }

  async update(id: string, dto: UpdateAffiliateUserDto) {
    await this.findOne(id); // Verifies user exists first

    const dataToUpdate: Prisma.AffiliateUserUpdateInput = {
      ...dto,
      ...(dto.firstName && { firstName: dto.firstName.trim() }),
      ...(dto.lastName && { lastName: dto.lastName.trim() }),
      ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber.trim() }),
      ...(dto.deletionAt && { deletionAt: new Date(dto.deletionAt) }),
    };

    if (dto.email) {
      dataToUpdate.email = dto.email.trim().toLowerCase();
    }

    // Hash the password if it's being altered in the payload
    if (dto.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(dto.password, saltRounds);
    }

    try {
      return await this.prisma.affiliateUser.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email update conflicts with an existing account.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.affiliateUser.delete({ where: { id } });
  }
}