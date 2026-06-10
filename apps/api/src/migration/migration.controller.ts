// src/migration/migration.controller.ts
import { Controller, Post, UseGuards } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller('admin/migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Post('run-products')
  async triggerProductMigration() {
    const result = await this.migrationService.runMongoToPostgresMigration();
    return {
      message: 'Migration process triggered successfully',
      ...result,
    };
  }

  @Post('run-category-subcategory')
  async migrateTaxonomy() {
    const result = await this.migrationService.migrateCategoriesAndSubcategories();
    return {
      message: 'MongoDB metadata parsed and migrated to PostgreSQL structural tables.',
      data: result,
    };
  }
}