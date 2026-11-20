import nodemailer from 'nodemailer';

let transporter = null;

/**
 * Deliver transactional email via Resend HTTP REST API (port 443 HTTPS).
 * Cloud platforms (Render, AWS, GCP) block or throttle raw SMTP ports (25, 465, 587).
 * Resend sends over standard HTTPS port 443 with 100% inbox deliverability.
 */
async function sendViaResend({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null; // Resend not configured, proceed to fallback
  }

  // Uses custom from-domain if configured, or Resend's free instant onboarding sender
  const senderEmail = (process.env.RESEND_FROM_EMAIL || 'ActiLynq Travel CRM <onboarding@resend.dev>').trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderEmail,
        to: Array.isArray(to) ? to : [to.trim()],
        subject,
        html,
        text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('[EmailService Resend] API error response:', data);
      return { success: false, error: data?.message || 'Resend HTTP API delivery failure' };
    }

    console.log(`[EmailService Resend] Email delivered successfully to ${to}. Resend ID: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error('[EmailService Resend] Network call failed:', err.message);
    return { success: false, error: err.message };
  }
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('[EmailService] SMTP credentials (SMTP_USER / SMTP_PASS) not configured.');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      connectionTimeout: 4000, // 4s max connect timeout to prevent Render cloud socket hang
      greetingTimeout: 4000,   // 4s max greeting timeout
      socketTimeout: 5000,     // 5s max socket inactivity timeout
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, '') // Strips spaces from 16-char Google App Password
      },
      tls: {
        rejectUnauthorized: false // Ensures reliable delivery across Render, cloud containers & proxies
      }
    });
  }

  return transporter;
}

/**
 * Send Password Reset Email with secure one-time link
 */
export async function sendPasswordResetEmail({ toEmail, name, resetUrl }) {
  const recipientName = name || 'Travel Professional';
  const subject = 'Reset Your ActiLynq Password';
  const textBody = `Hello ${recipientName},\n\nA request was made to reset your ActiLynq password.\n\nPlease open this link to set a new password:\n${resetUrl}\n\nThis link is valid for 1 hour.\n\nIf you did not request this, please ignore this email.`;
  const htmlBody = `
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
  `;

  // 1. Try Resend HTTP API first if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({
      to: toEmail,
      subject,
      html: htmlBody,
      text: textBody
    });
    if (resendResult && resendResult.success) {
      return { success: true, provider: 'resend', messageId: resendResult.messageId };
    }
  }

  // 2. Fallback to Nodemailer SMTP with strict 4.5s race timeout
  try {
    const mailer = getTransporter();
    if (!mailer) {
      console.warn(`[EmailService] Neither Resend nor SMTP is configured. Reset URL: ${resetUrl}`);
      return { success: false, error: 'Email service is not configured on server', resetUrl };
    }

    const senderEmail = (process.env.SMTP_USER || 'nileshbca64a@gmail.com').trim();

    const sendPromise = mailer.sendMail({
      from: `"ActiLynq Travel CRM" <${senderEmail}>`,
      to: toEmail.trim(),
      subject,
      text: textBody,
      html: htmlBody
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP network timeout connecting to Gmail on Render cloud network')), 4500)
    );

    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log(`[EmailService SMTP] Password reset email sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, provider: 'smtp', messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService] Failed to send password reset email to ${toEmail}:`, err.message);
    return { success: false, error: err.message, resetUrl };
  }
}

/**
 * Send 6-Digit Email Verification Code (OTP) for Trial Registration
 */
export async function sendEmailVerificationOtp({ toEmail, name, otp }) {
  const recipientName = name || 'Travel Professional';
  const subject = `Your ActiLynq Verification Code: ${otp}`;
  const textBody = `Hello ${recipientName},\n\nThank you for signing up for ActiLynq Travel CRM.\n\nYour 6-digit account verification code is: ${otp}\n\nThis code will expire in 15 minutes.\n\nEnter this code on the registration page to activate your 14-day full access free trial.\n\nIf you did not request this account, please ignore this email.`;
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email — ActiLynq</title>
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
                  <h2 style="margin: 0 0 14px 0; font-size: 18px; font-weight: 700; color: #0f172a;">
                    Verify Your Email Address
                  </h2>
                  <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                    Hello <strong>${recipientName}</strong>,
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #475569;">
                    Thank you for starting your free trial with ActiLynq. Please enter the following 6-digit verification code to activate your workspace:
                  </p>

                  <!-- OTP Box -->
                  <div style="margin: 28px 0; text-align: center;">
                    <div style="display: inline-block; padding: 18px 32px; background-color: #f0fdfa; border: 2px dashed #0f766e; border-radius: 10px;">
                      <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #0f766e; padding-left: 10px;">
                        ${otp}
                      </span>
                    </div>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b; font-weight: 500;">
                      Valid for 15 minutes &bull; Do not share this code
                    </p>
                  </div>

                  <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #64748b;">
                    Once verified, your <strong>14-Day Free Evaluation Trial</strong> with 2 Sales Agent Seats will be immediately unlocked.
                  </p>
                  <p style="margin: 12px 0 0 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                    If you did not register for ActiLynq, please ignore this email or contact support.
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
  `;

  // 1. Try Resend HTTP API first if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({
      to: toEmail,
      subject,
      html: htmlBody,
      text: textBody
    });
    if (resendResult && resendResult.success) {
      return { success: true, provider: 'resend', messageId: resendResult.messageId };
    }
  }

  // 2. Fallback to Nodemailer SMTP with strict 4.5s race timeout
  try {
    const mailer = getTransporter();
    if (!mailer) {
      console.warn(`[EmailService DEV] Verification OTP for ${toEmail}: [${otp}]`);
      return {
        success: false,
        devMode: true,
        otp,
        error: 'Email service credentials not configured in environment variables.'
      };
    }

    const senderEmail = (process.env.SMTP_USER || 'nileshbca64a@gmail.com').trim();

    const sendPromise = mailer.sendMail({
      from: `"ActiLynq Travel CRM" <${senderEmail}>`,
      to: toEmail.trim(),
      subject,
      text: textBody,
      html: htmlBody
    });

    // Hard 4.5-second timeout to prevent Render cloud container socket hangs
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP network timeout connecting to Gmail on Render cloud network')), 4500)
    );

    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log(`[EmailService SMTP] Verification OTP sent to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, provider: 'smtp', messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService] Verification OTP delivery issue for ${toEmail}:`, err.message);
    return { success: false, devMode: false, otp, error: err.message };
  }
}
