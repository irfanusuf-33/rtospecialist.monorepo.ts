import { Body, Controller, Post, Get, Param, Req, UseGuards, Res, UsePipes, HttpCode, HttpStatus, ValidationPipe, SetMetadata } from '@nestjs/common';
import express from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordConfirmDto, ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { InitiateEmailChangeDto, VerifyEmailChangeDto } from './dto/change-email.dto';

interface RequestWithUser extends express.Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('otp/send')
  @ApiOperation({ summary: 'Request a new security OTP verification code' })
  @ApiResponse({ status: 201, description: 'OTP successfully dispatched via queue system.' })
  async requestOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto.email);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard('local'))
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, accountType: { type: 'string', enum: ['client', 'pdevUser'], description: 'Select user account profile type' } } } })
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) response: express.Response) {
    const { accountType } = req.body;
    const result = await this.authService.login(req.user, accountType);
    response.cookie('rto_session', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return {
      success: true,
      message: "User Authenticated successfully",
      user: {
        id: result.user.id,
        email: result.user.email,
        accountType: result.user.accountType,
        name: result.user.firstName || result.user.name,
      }
    }
  }

  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user account password while authenticated' })
  @ApiResponse({ status: 200, description: 'Password successfully modified.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changePassword(
    @Req() req: any, // 👈 Contains user identity injected by your JwtStrategy (e.g., req.user)
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // Extract the authenticated user ID from the request context
    const userId = req.user.id;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Post('forgot-password-initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request an account recovery credential verification email link' })
  @ApiResponse({ status: 200, description: 'Dispatched link successfully context operations.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendResetPasswordEmail(forgotPasswordDto);
  }

  @Post('reset-password-confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify link token and process account password updates' })
  @ApiResponse({ status: 200, description: 'Credentials successfully rewritten.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resetPassword(@Body() resetPasswordDto: ForgotPasswordConfirmDto) {
    return this.authService.resetPasswordConfirm(resetPasswordDto);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('change-email/initiate')
  @HttpCode(HttpStatus.OK)
  async initiateEmailChange(
    @Req() req: any,
    @Body() dto: InitiateEmailChangeDto,
  ) {
    const userId = req.user.id;
    await this.authService.initiateEmailChange(userId, dto.newEmail);
    return { message: 'OTP successfully sent to your new email address.' };
  }

  // 2. Endpoint to verify OTP, update DB, and issue a refreshed JWT cookie
  @Post('change-email/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmailChange(
    @Req() req: any,
    @Body() dto: VerifyEmailChangeDto,
    @Res({ passthrough: true }) res: express.Response, // Allows updating cookies while returning data
  ) {
    const userId = req.user.id;
    const accountType = req.user.accountType; // Pulled from your existing active JWT

    // Verify and update email in database, then get the fresh user data
    const { newToken } = await this.authService.verifyAndChangeEmail(
      userId,
      accountType,
      dto.newEmail,
      dto.otp,
    );

    // 4. Overwrite the existing cookie with the updated token payload
    res.cookie('rto_session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { message: 'Email updated successfully. Your session has been refreshed.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getMyProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: express.Response) {
    response.cookie('rto_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
    });
    return this.authService.logout();
  }
}
