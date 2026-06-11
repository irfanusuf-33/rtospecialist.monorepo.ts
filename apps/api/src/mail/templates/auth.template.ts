// src/mail/templates/reset-password.template.ts

/**
 * Generates the responsive HTML template for password reset emails
 * @param resetLink The complete token URL target pointing to your frontend client
 */
export const resetPasswordTemplate = (resetLink: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your RTO Specialist Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; background-color: #ffffff; border: 1px solid #eef2f5; border-radius: 12px; padding: 40px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <div style="margin-bottom: 32px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
      <span style="font-size: 22px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; font-family: sans-serif;">
        RTO<span style="color: #2563eb;">Specialist</span>
      </span>
      <span style="float: right; font-size: 13px; color: #6b7280; padding-top: 8px;">Official Account Security</span>
    </div>
    
    <h2 style="color: #111827; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.3px;">Password Reset Request</h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
      We received a request to change or reset the password associated with your account on **RTO Specialist**. Click the secure authorization button below to establish your new login credentials:
    </p>
    
    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="${resetLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2), 0 2px 4px -1px rgba(37,99,235,0.1);">
        Reset My Password
      </a>
    </div>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 20px; margin-bottom: 32px;">
      <h4 style="margin-top: 0; margin-bottom: 10px; color: #1e3a8a; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Important Security Guidelines:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 22px;">
        <li style="margin-bottom: 6px;"><strong>Single Use:</strong> This verification link can only be accessed once. After submission, it will immediately expire.</li>
        <li style="margin-bottom: 6px;"><strong>Time Expiration:</strong> For your security, this authorization link remains active for exactly <strong>15 minutes</strong> from generation.</li>
        <li style="margin-bottom: 6px;"><strong>Password Standard:</strong> Ensure your new password contains at least 8 characters, combining numbers, letters, and unique symbols.</li>
        <li style="margin-bottom: 0;"><strong>Confidentiality:</strong> RTO Specialist staff will never ask you to reveal your password or send token strings over email/SMS.</li>
      </ul>
    </div>
    
    <p style="color: #6b7280; font-size: 13px; line-height: 20px; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      <strong>Didn't make this request?</strong> You can safely ignore this automated message. Your account remains completely secure and no updates will be applied unless the link above is actively processed.
    </p>
    
    <p style="color: #9ca3af; font-size: 11px; line-height: 16px; margin-top: 20px; word-break: break-all;">
      If you are experiencing issues clicking the button, copy and paste this absolute web link directly into your browser address bar:<br>
      <a href="${resetLink}" style="color: #2563eb; text-decoration: underline;">${resetLink}</a>
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; color: #9ca3af; font-size: 12px; line-height: 18px;">
      <p style="margin: 0 0 4px 0; font-weight: 600; color: #6b7280;">© 2026 RTO Specialist. All Rights Reserved.</p>
      <p style="margin: 0;">Managed securely via <a href="https://rtospecialist.com.au" target="_blank" style="color: #6b7280; text-decoration: none; font-weight: 600;">rtospecialist.com.au</a></p>
    </div>
    
  </div>
</body>
</html>
`;