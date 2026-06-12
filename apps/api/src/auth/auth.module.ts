import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { PdevUsersModule } from '../pdev-user/pdev-user.module';

@Global()
@Module({
  imports: [
    MailModule,
    PdevUsersModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
      signOptions: {
        expiresIn: '15m', // Shorter lived access tokens
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAuthGuard],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
