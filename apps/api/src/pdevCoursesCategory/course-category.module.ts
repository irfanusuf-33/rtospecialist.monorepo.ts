import { Module } from '@nestjs/common';
import { PdevProductCategoryService } from './course-category.service';
import { PdevProductCategoryController } from './course-category.controller';

@Module({
  controllers: [PdevProductCategoryController],
  providers: [PdevProductCategoryService],
})
export class PdevProductCategoryModule {}