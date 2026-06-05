import { Module } from '@nestjs/common';
import { AdminsService } from './admin.service';
import { AdminsController } from './admin.controller';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}