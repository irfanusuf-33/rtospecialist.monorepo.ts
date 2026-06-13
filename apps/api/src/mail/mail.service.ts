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

  async sendEmailChangeOtp(newEmail: string, otp: string): Promise<boolean> {
    const fromEmail = this.configService.get<string>('MICROSOFT_MAIL_ID') || 'noreply@yourdomain.com';

    const mailOptions = {
      from: `"App Security" <${fromEmail}>`,
      to: newEmail,
      subject: 'Verify Your New Email Address',
      text: `You requested to change your account email to this address. Your verification OTP code is: ${otp}. This code expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #2b6cb0; margin-bottom: 20px;">Email Change Verification</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            You requested to update your account email to this address. Please use the following One-Time Password (OTP) to verify and complete the change:
          </p>
          <h1 style="background: #f7fafc; padding: 20px; text-align: center; letter-spacing: 6px; color: #2d3748; border: 1px dashed #cbd5e0; border-radius: 6px; font-family: monospace; font-size: 32px; margin: 25px 0;">${otp}</h1>
          <p style="font-size: 13px; color: #718096; line-height: 1.5;">
            This security code will expire automatically in <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this message—your account email will remain unchanged.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email change OTP successfully sent to: ${newEmail}`);
      return true;
    } catch (error: any) {
      this.logger.error(`SMTP failure sending email change OTP to ${newEmail}: ${error.message}`);
      return false;
    }
  }

  async sendEmailChangedAlert(oldEmail: string, newEmail: string): Promise<boolean> {
    const fromEmail = this.configService.get<string>('MICROSOFT_MAIL_ID') || 'noreply@yourdomain.com';

    const mailOptions = {
      from: `"App Security" <${fromEmail}>`,
      to: oldEmail,
      subject: 'Security Alert: Your account email has been updated',
      text: `Security Alert: The email address associated with your account was successfully changed to ${newEmail}. If you did not make this change, please contact support immediately.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #e53e3e; margin-bottom: 20px;">Security Alert: Email Changed</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            The email address associated with your account has been successfully changed.
          </p>
          <div style="background: #fffaf0; border-left: 4px solid #dd6b20; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #7b341e;"><strong>Old Email:</strong> ${oldEmail}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #7b341e;"><strong>New Email:</strong> ${newEmail}</p>
          </div>
          <p style="font-size: 14px; color: #4a5568; line-height: 1.5; margin-top: 25px;">
            <strong>Important:</strong> If you authorized this change, no further action is required. Your old email address can no longer be used to sign in.
          </p>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;" />
          <p style="font-size: 12px; color: #a0aec0; line-height: 1.5;">
            If you did <strong>not</strong> request this change, your account may have been compromised. Please contact our system security team immediately to lock down your credentials.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email change confirmation alert sent to old account inbox: ${oldEmail}`);
      return true;
    } catch (error: any) {
      this.logger.error(`SMTP delivery crash when alerting old email address ${oldEmail}: ${error.message}`);
      return false;
    }
  }
}