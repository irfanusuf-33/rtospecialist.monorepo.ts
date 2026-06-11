// src/mail/mail.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { resetPasswordTemplate } from './templates/auth.template';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: nodemailer.Transporter;

  constructor(private configService: ConfigService) {}

  /**
   * Initializes the SMTP transporter connection pooling on module bootup
   */
  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: this.configService.get<number>('SMTP_PORT') === 465,
      auth: {
        user: this.configService.get<string>('MICROSOFT_MAIL_ID'),
        pass: this.configService.get<string>('MICROSOFT_MAIL_KEY'),
      },
      // Production setting: standard connection pooling prevents opening a new TCP connection on every mail
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  /**
   * Directly sends an OTP email asynchronously
   */
  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    const fromEmail = this.configService.get<string>('MICROSOFT_MAIL_ID') || 'noreply@yourdomain.com';

    const mailOptions = {
      from: `"No Reply - App Security" <${fromEmail}>`,
      to: email,
      subject: 'Your One-Time Security Code Verification',
      text: `Your security signup verification code is: ${otp}. This code expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">Security Verification</h2>
          <p style="font-size: 16px; color: #555;">Your security verification signup code is:</p>
          <h1 style="background: #f4f4f4; padding: 15px; text-align: center; letter-spacing: 5px; color: #222; border-radius: 4px; font-family: monospace;">${otp}</h1>
          <p style="font-size: 13px; color: #888;">This code will expire securely inside 5 minutes. If you did not make this request, please ignore this email safely.</p>
        </div>
      `,
    };

    try {
      // Execute the dispatch network call directly
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Direct OTP email successfully dispatched to: ${email}`);
      return true;
    } catch (error: any) {
      // CRITICAL: Catch errors cleanly so an SMTP failure doesn't crash your whole HTTP signup logic
      this.logger.error(`Direct SMTP delivery crash for ${email}: ${error.message}`);
      return false;
    }
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<boolean> {
    const fromEmail = this.configService.get<string>('MICROSOFT_MAIL_ID') || 'noreply@yourdomain.com';

    const mailOptions = {
      from: `"App Security" <${fromEmail}>`,
      to: email,
      subject: 'Reset Your Account Password Securely',
      // Fallback plain-text layout for strict security-hardened mail clients
      text: `A request was made to change your password. Copy and paste this validation link into your web browser to proceed: ${resetLink}. This link is strictly single-use and will expire in 15 minutes.`,
      // Clean, modern, responsive HTML container
      html: resetPasswordTemplate(resetLink),
    };

    try {
      // Execute the SMTP network payload transmission out-of-band
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Account recovery secure email link successfully sent to: ${email}`);
      return true;
    } catch (error: any) {
      // Gracefully logs standard SMTP timeouts or bad credentials without breaking the API pipeline
      this.logger.error(`Direct SMTP delivery crash during forgot-password handling for ${email}: ${error.message}`);
      return false;
    }
  }
}