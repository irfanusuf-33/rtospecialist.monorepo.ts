import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      jobRole: dto.jobRole,
      company: dto.company,
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: token,
      user,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.usersService.findById(decoded.sub);
     if (!user) {
        throw new UnauthorizedException('Invalid token');
    }
      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        { secret: process.env.JWT_ACCESS_SECRET }
      );
      return { access_token: newAccessToken, user };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid reset request');
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_RESET_SECRET,
      });
      if (decoded.sub !== user.id) {
        throw new BadRequestException('Invalid token');
  }

      const hashed = await bcrypt.hash(newPassword, 10);
      // Assuming UsersService has an updatePassword method
      await this.usersService.updatePassword(user.id, hashed);
      return { message: 'Password has been reset successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
}
  }

  async verifyEmail(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_VERIFICATION_SECRET,
      });
      // Assuming UsersService has a method to mark email as verified
      await this.usersService.markAsVerified(decoded.sub);
      return { message: `Email verified successfully. User ${decoded.sub} is now active.` };
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async sendResetPasswordEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal whether user exists
      return { message: 'If an account exists, a reset link has been sent' };
    }

    const token = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: process.env.JWT_RESET_SECRET,
        expiresIn: '1h'
      }
    );

    // TODO: Implement actual email sending logic here
    // For now we'll return the token for testing
    return { 
      message: 'Reset link sent if account exists',
      token // In production, don't return the token!
    };
  }

  async logout(id: string) {
    // In a real implementation, you might:
    // 1. Add token to a blacklist
    // 2. Track logged out tokens until they expire
    // 3. Clear refresh tokens if using them
    
    // For now we'll just return success message
    return { message: 'Logout successful' };
  }

  async getMyProfile(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
    };
  }
}
