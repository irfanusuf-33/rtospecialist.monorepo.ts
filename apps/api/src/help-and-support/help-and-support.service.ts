import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHelpTicketDto } from './dto/create-help-and-support.dto';
import { UpdateHelpTicketDto } from './dto/update-help-and-support.dto';

@Injectable()
export class HelpAndSupportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Pure TypeScript alternative replacing the external 'sanitize-html' module.
   * Strips out all HTML tags (<...>) and removes extra leading/trailing spacing.
   */
  private cleanHtmlTags(text: string): string {
    if (!text) return '';
    // Replicates allowedTags: [] by matching any structure between angle brackets
    return text.replace(/<\/?[^>]+(>|$)/g, '').trim();
  }

  async create(dto: CreateHelpTicketDto) {
    const { user, body, ...restOfDto } = dto;

    if (user) {
      const baseUserExists = await this.prisma.user.findUnique({ where: { id: user } });
      if (!baseUserExists) throw new BadRequestException(`User profile with ID "${user}" does not exist.`);
    }

    // Sanitize body explicitly using native pattern matching
    const cleanBody = this.cleanHtmlTags(body);

    return this.prisma.helpAndSupport.create({
      data: {
        ...restOfDto,
        body: cleanBody,
        ...(user && { userId: user }),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.helpAndSupport.findMany({
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.helpAndSupport.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!ticket) throw new NotFoundException(`Support ticket with ID "${id}" not found`);
    return ticket;
  }

  async update(id: string, dto: UpdateHelpTicketDto) {
    await this.findOne(id);
    const { user, body, ...restOfDto } = dto;

    const dataToUpdate: any = { ...restOfDto };

    if (body) {
      dataToUpdate.body = this.cleanHtmlTags(body);
    }

    if (user) {
      const baseUserExists = await this.prisma.user.findUnique({ where: { id: user } });
      if (!baseUserExists) throw new BadRequestException(`User profile with ID "${user}" does not exist.`);
      dataToUpdate.userId = user;
    }

    return this.prisma.helpAndSupport.update({
      where: { id },
      data: dataToUpdate,
      include: { user: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.helpAndSupport.delete({ where: { id } });
  }
}