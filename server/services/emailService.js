import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('[EmailService] SMTP credentials (SMTP_USER / SMTP_PASS) not configured.');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, '') // Strips any spaces if provided formatted
      },
      tls: {
        rejectUnauthorized: false // Ensures reliable delivery across Windows, proxy, and containerized networks
      }
    });
  }

  return transporter;
}

/**
 * Send Password Reset Email with secure one-time link
 */
export async function sendPasswordResetEmail({ toEmail, name, resetUrl }) {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      return { success: false, error: 'Email service is not configured' };
    }

    const senderEmail = process.env.SMTP_USER || 'nileshbca64a@gmail.com';
    const recipientName = name || 'Travel Professional';

    const info = await mailer.sendMail({
      from: `"ActiLynq Travel CRM" <${senderEmail}>`,
      to: toEmail,
      subject: 'Reset Your ActiLynq Password',
      text: `Hello ${recipientName},\n\nA request was made to reset your ActiLynq password.\n\nPlease open this link to set a new password:\n${resetUrl}\n\nThis link is valid for 1 hour.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your ActiLynq Password</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #042f2e; padding: 24px 30px; text-align: left;">
                      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                        ActiLynq <span style="font-weight: 400; color: #2dd4bf; font-size: 14px;">| Travel CRM</span>
                      </h1>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 32px 30px 24px 30px;">
                      <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #0f172a;">
                        Reset Your Password
                      </h2>
                      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                        Hello <strong>${recipientName}</strong>,
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #475569;">
                        We received a request to reset the password for your ActiLynq account associated with <strong>${toEmail}</strong>. Click the button below to choose a new password:
                      </p>

                      <!-- Action Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                        <tr>
                          <td style="border-radius: 8px; background-color: #0f766e; text-align: center;">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 13px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; letter-spacing: 0.2px;">
                              Reset My Password
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 24px 0 8px 0; font-size: 12px; line-height: 18px; color: #64748b;">
                        If the button above does not work, copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 12px; line-height: 18px; color: #0f766e; word-break: break-all;">
                        <a href="${resetUrl}" target="_blank" style="color: #0f766e; text-decoration: underline;">
                          ${resetUrl}
                        </a>
                      </p>

                      <div style="background-color: #f8fafc; border-left: 3px solid #0f766e; padding: 12px 14px; border-radius: 4px; margin-top: 24px;">
                        <p style="margin: 0; font-size: 12px; line-height: 18px; color: #475569;">
                          <strong>Note:</strong> This link is strictly valid for <strong>1 hour</strong>. For security, once used or expired, a new request must be submitted.
                        </p>
                      </div>

                      <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                        If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                        &copy; ${new Date().getFullYear()} ActiLynq Travel CRM &bull; Next-Action Engine for Tour Operators
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    console.log(`[EmailService] Password reset email successfully sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService] Failed to send password reset email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}
