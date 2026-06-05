import { Module } from '@nestjs/common';
import { PdevUsersService } from './pdev-user.service';
import { PdevUsersController } from './pdev-user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PdevUsersController],
  providers: [PdevUsersService],
  exports: [PdevUsersService],
})
export class PdevUsersModule {}