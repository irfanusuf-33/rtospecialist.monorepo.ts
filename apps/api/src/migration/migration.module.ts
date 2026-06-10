// src/migration/migration.module.ts
import { Module } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { MigrationController } from './migration.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Injects your existing Prisma provider
  controllers: [MigrationController],
  providers: [MigrationService],
  exports: [MigrationService], // Allows other system modules to use it
})
export class MigrationModule {}