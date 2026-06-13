import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordConfirmDto, ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { PendingEmailCache } from '../../../../packages/types/src/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
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

  async login(user: any, accountType: string) {
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      accountType: accountType,
    }, {
      secret: this.configService.get<string>('SESSION_AUTH_TOKEN'),
      expiresIn: '30d',
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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const { currentPassword, newPassword } = dto;

    // 1. Fetch the user directly from the database to get their current hashed password
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Authenticated user entity context could not be located.');
    }

    // 2. Cryptographically verify that the user actually knows their current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('The current password you provided is incorrect.');
    }

    // 3. Security Guardrail: Prevent users from changing their password to the exact same one
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Your new password cannot be identical to your current password.');
    }

    // 4. Hash the fresh password string securely
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 5. Update database parameters
    await this.usersService.updatePassword(user.id, hashedNewPassword);

    this.logger.log(`Password successfully updated for authenticated user identity ID: ${user.id}`);

    return {
      success: true,
      message: 'Your account password has been updated successfully.',
    };
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

  async sendResetPasswordEmail(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // Don't reveal whether user exists
      return { message: 'If an account exists, a reset link has been sent' };
    }

    // TODO: Implement actual email sending logic here
    const secret = this.configService.get<string>('JWT_SECRET') + user.password;
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret, expiresIn: '15m' }
    );

    const clientUrl = this.configService.get<string>('NODE_ENV') === 'development' ? 'http://localhost:3000' : 'https://rtospecialist.com.au';
    const resetLink = `${clientUrl}/reset-password?token=${token}`;

    // send email
    this.mailService.sendResetPasswordEmail(user.email, resetLink);

    return {
      success: true,
      message: 'Reset link sent if account exists',
    };
  }

  async resetPasswordConfirm (dto: ForgotPasswordConfirmDto) {
    const { token, newPassword } = dto;
    const decoded = this.jwtService.decode(token) as { sub: string, email: string };
    if (!decoded || !decoded.sub) {
      throw new BadRequestException('The token is invalid. Or the session has expired. Please request a new forgot-password email');
    }

    const user = await this.usersService.findById(decoded.sub);
    if (!user) {
      throw new BadRequestException('Target reset indentity could not be verified. ');
    }

    const secret = this.configService.get<string>('JWT_AUTH_TOKEN') + user.password;
    try {
      await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      throw new BadRequestException('The security recovery link is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      success: true,
      message: "Your account password has been changed successfully.",
    }
  }

  async logout() {
    return {
      success: true,
      message: 'Logout successful' 
    };
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

  async initiateEmailChange(userId: string, newEmail: string) {
    const [existingClient, existingAffiliate] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: newEmail } }),
      this.prisma.affiliateUser.findUnique({ where: { email: newEmail } }),
    ]);

    if (existingClient || existingAffiliate) {
      throw new BadRequestException('This email is already in use by another account.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const cacheKey = `otp:email-change:${userId}`;
    const cacheValue: PendingEmailCache = { newEmail, otp };
    
    await this.cacheManager.set(cacheKey, cacheValue, 5 * 60 * 1000);
    const emailSent = await this.mailService.sendOtpEmail(newEmail, otp);
    
    if (!emailSent) {
      await this.cacheManager.del(cacheKey);
      throw new BadRequestException('Failed to dispatch verification email. Please try again later.');
    }
  }

  async verifyAndChangeEmail(userId: string, accountType: string, newEmail: string, otp: string) {
    if (accountType === 'pdevUser') {
      throw new BadRequestException(
        'To change the email for your professional development account please contact your administrator.',
      );
    }

    const cacheKey = `otp:email-change:${userId}`;
    const cachedData = await this.cacheManager.get<PendingEmailCache>(cacheKey);
    if (!cachedData) {
      throw new BadRequestException('Verification code has expired or is invalid.');
    }

    if (cachedData.otp !== otp || cachedData.newEmail !== newEmail) {
      throw new BadRequestException('Invalid verification OTP code.');
    }

    const userModel = (accountType === 'client' ? this.prisma.user : this.prisma.affiliateUser) as any;
    await userModel.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    await this.cacheManager.del(cacheKey);
    const payload = { 
      userId, 
      email: newEmail,
      accountType 
    };
    
    const newToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return { newToken };
  }
}
