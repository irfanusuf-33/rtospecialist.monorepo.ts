import { Module } from '@nestjs/common';
import { AffiliateUsersService } from './affiliate-user.service';
import { AffiliateUsersController } from './affiliate-user.controller';

@Module({
  controllers: [AffiliateUsersController],
  providers: [AffiliateUsersService],
})
export class AffiliateUserModule {}
