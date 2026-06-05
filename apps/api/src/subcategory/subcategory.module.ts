import { Module } from '@nestjs/common';
import { SubcategoriesService } from './subcategory.service';
import { SubcategoriesController } from './subcategory.controller';

@Module({
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule {}