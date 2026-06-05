import { Module } from '@nestjs/common';
import { LogsService } from './log-trails.service';
import { LogsController } from './log-trails.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}