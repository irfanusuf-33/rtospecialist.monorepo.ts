import { Module } from '@nestjs/common';
import { PdevProductsService } from './pdevProduct.service';
import { PdevProductsController } from './pdevProduct.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PdevProductsController],
  providers: [PdevProductsService],
  exports: [PdevProductsService],
})
export class PdevProductsModule {}