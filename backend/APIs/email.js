import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: process.env.EMAIL_SECURE === 'true' || port == 465,
    auth: {
      user,
      pass
    }
  });
};

export const sendVerificationEmail = async (toEmail, userName, code) => {
  const transporter = createTransporter();
  const fromAddress = process.env.EMAIL_USER || 'noreply@agro-intel.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - Agro-Intelligence System</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          color: #334155;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background-color: #059669;
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px;
          text-align: center;
        }
        .content p {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 24px;
        }
        .code-box {
          background-color: #f1f5f9;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 16px 24px;
          display: inline-block;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #059669;
          margin: 20px 0;
          font-family: monospace;
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Agro-Intelligence System</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${userName.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</strong>,</p>
          <p>Thank you for registering with the AI-Powered Weather and Soil Intelligence System. Please use the 6-digit verification code below to activate your farmer account:</p>
          <div class="code-box">${code}</div>
          <p>This code will expire in 15 minutes. If you did not request this code, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Agro-Intelligence System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    throw new Error('SMTP email dispatcher is not configured. Please define EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in your backend/.env file to start sending real emails.');
  }

  try {
    await transporter.sendMail({
      from: `"Agro-Intelligence System" <${fromAddress}>`,
      to: toEmail,
      subject: 'Verify Your Email - Agro-Intelligence System',
      html: htmlContent,
      text: `Hello ${userName},\n\nYour 6-digit email verification code is: ${code}\n\nThis code will expire in 15 minutes.\n\nBest regards,\nAgro-Intelligence System Team`
    });
    console.log(`[Email Service] Verification email successfully sent to ${toEmail}`);
    return { success: true, sandbox: false };
  } catch (error) {
    console.error('[Email Service Error] Failed to dispatch email via SMTP:', error);
    throw new Error('SMTP email dispatch pipeline failure.');
  }
};
