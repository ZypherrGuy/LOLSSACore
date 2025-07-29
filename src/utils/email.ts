import nodemailer from 'nodemailer';
import { env }    from '../config/env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: `"LoLSSA Community" <no-reply@lolssa.com>`,
    to,
    subject: 'Please verify your e‑mail address',
    html: `<p><a href="${verifyUrl}">Verify your e‑mail</a></p>`,
  });
}