// src/migration/migration.module.ts
import { Module } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { MigrationController } from './migration.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PdevMigrationController } from './pdev-migration.controller';
import { PdevMigrationService } from './pdev-migration.service';

@Module({
  imports: [PrismaModule], // Injects your existing Prisma provider
  controllers: [MigrationController, PdevMigrationController],
  providers: [MigrationService, PdevMigrationService],
  exports: [MigrationService, PdevMigrationService],
})
export class MigrationModule {}