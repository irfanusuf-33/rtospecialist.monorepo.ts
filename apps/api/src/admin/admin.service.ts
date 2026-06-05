import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
    constructor(private prisma: PrismaService) { }

    async create(createAdminDto: CreateAdminDto) {
        try {
            // 1. Clean data formatting
            const formattedEmail = createAdminDto.email.trim().toLowerCase();

            // 2. Hash password explicitly before saving (Replaces Mongoose pre-save)
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(createAdminDto.password, saltRounds);

            return await this.prisma.admin.create({
                data: {
                    ...createAdminDto,
                    email: formattedEmail,
                    password: hashedPassword,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('An admin account with this email already exists.');
            }
            throw error;
        }
    }

    async findAll() {
        return this.prisma.admin.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        if (!admin) throw new NotFoundException(`Admin not found`);
        return admin;
    }

    async update(id: string, updateAdminDto: UpdateAdminDto) {
        await this.findOne(id); // Confirms asset existence

        const dataToUpdate: Prisma.AdminUpdateInput = { ...updateAdminDto };

        // Format email if provided
        if (updateAdminDto.email) {
            dataToUpdate.email = updateAdminDto.email.trim().toLowerCase();
        }

        // Intercept and re-hash password dynamically if client modifies it
        if (updateAdminDto.password) {
            const saltRounds = 10;
            dataToUpdate.password = await bcrypt.hash(updateAdminDto.password, saltRounds);
        }

        try {
            return await this.prisma.admin.update({
                where: { id },
                data: dataToUpdate,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email unique structural target clash.');
            }
            throw error;
        }
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.admin.delete({ where: { id } });
    }
}