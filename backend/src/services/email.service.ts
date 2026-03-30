/* eslint-disable no-console */
import nodemailer, { Transporter } from 'nodemailer';

import { config } from '../configs/config';

class EmailService {
  private transporter: Transporter;

  private fromEmail: string;

  constructor() {
    const emailConfig = config.email;
    const smtpEmail = emailConfig.emailFrom;
    const smtpPassword = emailConfig.emailToken;

    if (!smtpEmail) {
      throw new Error('SMTP_EMAIL is missing');
    }
    if (!smtpPassword) {
      throw new Error('SMTP_PASSWORD is missing');
    }

    this.fromEmail = smtpEmail;

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<unknown> {
    const mailOptions = {
      from: this.fromEmail,
      to,
      subject,
      html,
      text: text ?? '',
    };

    try {
      const response = await this.transporter.sendMail(mailOptions);
      return response;
    } catch (error) {
      console.error('Nodemailer error:', error);
      throw error;
    }
  }
}

export const emailService = new EmailService();

