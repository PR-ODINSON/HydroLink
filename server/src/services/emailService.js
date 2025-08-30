const nodemailer = (() => { try { return require('nodemailer'); } catch { return null; } })();

const transporter = nodemailer ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
}) : null;

async function sendEmail({ to, subject, html, text }) {
  if (!nodemailer || !transporter) {
    console.log('[EmailService] Email not sent (nodemailer not installed):', { to, subject });
    return { success: false, error: 'Nodemailer not installed' };
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@hydrolink.com',
      to,
      subject,
      html,
      text,
    });
    return { success: true, info };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail };
