import { Body, Controller, Post, Get, Param, Req, UseGuards, Res, UsePipes, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import express from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordConfirmDto, ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { ChangePasswordDto } from '../users/dto/change-password.dto';

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

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: express.Response) {
    const result = await this.authService.login(dto);
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
        accountType: '',
        name: result.user.firstName,
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getMyProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.id);
  }
}
