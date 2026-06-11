import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,
  ) {}

  private readonly OTP_PREFIX = 'otp:code:';
  private readonly COOLDOWN_PREFIX = 'otp:cooldown:';
  private readonly ATTEMPTS_PREFIX = 'otp:attempts:';

  async sendOtp(email: string): Promise<{ success: boolean; message: string, otp: string }> {
    const cooldownKey = `${this.COOLDOWN_PREFIX}${email}`;
    const otpKey = `${this.OTP_PREFIX}${email}`;
    const attemptsKey = `${this.ATTEMPTS_PREFIX}${email}`;

    const hasCooldown = await this.cacheManager.get(cooldownKey);
    if (hasCooldown) {
      throw new HttpException('Too many requests, please try again later. Please wait 60 seconds to request for another OTP.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const { randomInt } = await import('crypto');
    const otp = randomInt(100000, 999999).toString();

    await this.cacheManager.set(otpKey, otp, 300000);
    await this.cacheManager.set(cooldownKey, 'true', 60000);
    await this.cacheManager.set(attemptsKey, 0, 300000);
    return { success: true, message: 'OTP dispatched successfully.', otp };
  }

  async verifyOtp(email: string, userOtp: string): Promise<{ success: boolean }> {
    const otpKey = `${this.OTP_PREFIX}${email}`;
    const attemptsKey = `${this.ATTEMPTS_PREFIX}${email}`;

    const cachedOtp = await this.cacheManager.get<string>(otpKey);
    let attempts = (await this.cacheManager.get<number>(attemptsKey)) || 0;

    if (!cachedOtp) {
      throw new BadRequestException('OTP has expired or is invalid.');
    }

    if (attempts >= 5) {
      await this.cacheManager.del(otpKey);
      await this.cacheManager.del(attemptsKey);
      throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
    }

    if (cachedOtp !== userOtp) {
      attempts += 1;
      await this.cacheManager.set(attemptsKey, attempts, 300000);
      throw new BadRequestException(`Invalid OTP. ${5 - attempts} attempts remaining.`);
    }

    await this.cacheManager.del(otpKey);
    await this.cacheManager.del(attemptsKey);
    await this.cacheManager.del(`${this.COOLDOWN_PREFIX}${email}`);

    return { success: true };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const otpKey = `${this.OTP_PREFIX}${dto.email}`;
    const attemptsKey = `${this.ATTEMPTS_PREFIX}${dto.email}`;

    const cachedOtp = await this.cacheManager.get<string>(otpKey);
    let attempts = (await this.cacheManager.get<number>(attemptsKey)) || 0;

    if (!cachedOtp) {
      throw new BadRequestException('OTP has expired or is invalid.');
    }

    if (attempts >= 5) {
      await this.cacheManager.del(otpKey);
      await this.cacheManager.del(attemptsKey);
      throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
    }

    if (cachedOtp !== dto.otp) {
      attempts += 1;
      await this.cacheManager.set(attemptsKey, attempts, 300000);
      throw new BadRequestException(`Invalid OTP. ${5 - attempts} attempts remaining.`);
    }

    // 3. Clear Cache State Immediately (Prevents Replay Attacks)
    await this.cacheManager.del(otpKey);
    await this.cacheManager.del(attemptsKey);
    await this.cacheManager.del(`${this.COOLDOWN_PREFIX}${dto.email}`);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      jobRole: dto.jobRole,
      company: dto.company,
      interestType: dto.interestType,
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(dto: LoginDto) {
    let user: any = null;
    if (dto.accountType === 'client') {
      user = await this.usersService.findByEmail(dto.email);
    } else if (dto.accountType === 'pdevUser') {
      user = await this.usersService.findByEmail(dto.email);
    }
    console.log('this is an auth user: ', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials. Check your email and password or try again.');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials. Please check your email or password and try again.');
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
