import { Module } from '@nestjs/common';
import { PdevProductCourseResultsService } from './pdev-product-course-results.service';
import { PdevProductCourseResultsController } from './pdev-product-course-results.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PdevProductCourseResultsController],
  providers: [PdevProductCourseResultsService],
  exports: [PdevProductCourseResultsService],
})
export class PdevProductCourseResultsModule {}