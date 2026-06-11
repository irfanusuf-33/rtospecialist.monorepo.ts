import { Controller, Post, UseGuards, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { PdevMigrationService } from './pdev-migration.service';
// Import your application's actual guard definitions here
// e.g., import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
// e.g., import { GlobalResourcePolicyGuard } from '../auth/guards/policy.guard';

@Controller('migration/pdev') // Base route prefix: /migration/pdev
export class PdevMigrationController {
  constructor(private readonly pdevMigrationService: PdevMigrationService) {}

  /**
   * Triggers the complete relational migration for professional development data.
   * Maps to: POST /migration/pdev/run
   */
  @Post('run')
  @HttpCode(HttpStatus.OK) // Returns a standard HTTP 200 instead of Nest's default 201 for POST
  // @UseGuards(AdminAuthGuard, GlobalResourcePolicyGuard) // Replaces your old middleware pipeline
  async runMigration() {
    try {
      const result = await this.pdevMigrationService.runPdevMigrationPipeline();
      return {
        message: 'Professional Development migration completed successfully.',
        data: result,
      };
    } catch (error: any) {
      // Unhandled exceptions inside the service are safely caught here
      throw new InternalServerErrorException({
        message: 'The Professional Development migration pipeline encountered a critical failure.',
        error: error.message,
      });
    }
  }
}