import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...dto,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        email: dto.email.trim().toLowerCase(),
        companyName: dto.companyName.trim(),
        position: dto.position.trim(),
        phoneNumber: dto.phoneNumber.trim(),
        state: dto.state.trim().toUpperCase(),
        message: dto.message.trim(),
        scheduledDateTime: dto.scheduledDateTime ? new Date(dto.scheduledDateTime) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment log with ID "${id}" not found`);
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    await this.findOne(id); // Assure target entity safety

    const dataToUpdate = {
      ...dto,
      ...(dto.firstName && { firstName: dto.firstName.trim() }),
      ...(dto.lastName && { lastName: dto.lastName.trim() }),
      ...(dto.email && { email: dto.email.trim().toLowerCase() }),
      ...(dto.companyName && { companyName: dto.companyName.trim() }),
      ...(dto.position && { position: dto.position.trim() }),
      ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber.trim() }),
      ...(dto.state && { state: dto.state.trim().toUpperCase() }),
      ...(dto.message && { message: dto.message.trim() }),
      ...(dto.scheduledDateTime && { scheduledDateTime: new Date(dto.scheduledDateTime) }),
    };

    return this.prisma.appointment.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appointment.delete({ where: { id } });
  }
}