import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    jobRole?: string;
    company?: string;
    interestType?: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        emailVerifiedAt: null,
      },
      include: {
        memberships: true,
        billingAddresses: true,
      }
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<User> {
    const user = await this.findById(id);
    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    return this.updatePassword(id, await bcrypt.hash(dto.newPassword, 10));
  }

  async markAsVerified(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { 
        emailVerifiedAt: new Date(),
        isActive: true 
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
