import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Injects Prisma database connectivity abstractions
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService], // Exported so your loggers or auth subsystems can look up user status metrics
})
export class MembershipsModule {}