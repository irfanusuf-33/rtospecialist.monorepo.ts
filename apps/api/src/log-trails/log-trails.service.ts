import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogTrailDto } from './dto/create-log-trail.dto';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLogTrailDto: CreateLogTrailDto) {
    const { action, target, metaData, ...logData } = createLogTrailDto;

    return this.prisma.logTrail.create({
      data: {
        ...logData,
        action: action.toUpperCase().trim(),
        // Safely stringify nested objects for deep JSONB parsing optimization blocks inside Postgres
        target: target ? JSON.parse(JSON.stringify(target)) : undefined,
        metaData: metaData ? JSON.parse(JSON.stringify(metaData)) : undefined,
      },
    });
  }

  async findAll(limit = 100, skip = 0) {
    return this.prisma.logTrail.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: skip,
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.logTrail.findUnique({ where: { id } });
    if (!log) throw new NotFoundException(`Audit logging trail trace with ID "${id}" is missing.`);
    return log;
  }

  async findByUserId(userId: string) {
    return this.prisma.logTrail.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }
}