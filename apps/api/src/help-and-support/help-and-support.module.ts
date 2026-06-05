import { Module } from '@nestjs/common';
import { HelpAndSupportService } from './help-and-support.service';
import { HelpAndSupportController } from './help-and-support.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HelpAndSupportController],
  providers: [HelpAndSupportService],
  exports: [HelpAndSupportService],
})
export class HelpAndSupportModule {}