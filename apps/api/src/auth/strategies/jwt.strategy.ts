import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

// Service Imports
import { UsersService } from '../../users/users.service';
import { PdevUsersService } from '../../pdev-user/pdev-user.service';
import { Strategy as LocalStrategyPassport } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(LocalStrategyPassport, 'local') {
  constructor(
    private usersService: UsersService,
    private pdevUsersService: PdevUsersService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const { accountType } = req.body;
    let user: any = null;

    if (accountType === 'client') {
      user = await this.usersService.findByEmail(email);
    } else if (accountType === 'pdevUser') {
      user = await this.pdevUsersService.findByEmail(email);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials. Check your email and password or try again.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials. Please check your email or password and try again.');
    }

    const { password: _, ...safeUser } = user;
    return safeUser; 
  }
}