import { Resend } from 'resend';
import { env } from '../config/env';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await this.resend.emails.send({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Welcome to Sophia Werkt',
      html: `<p>Welcome ${firstName}! Your account has been created.</p>`,
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    await this.resend.emails.send({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p><a href="${resetUrl}">Click here to reset your password</a></p>`,
    });
  }

  async sendAdviceReadyEmail(email: string, caseTitle: string): Promise<void> {
    await this.resend.emails.send({
      from: env.SMTP_FROM,
      to: email,
      subject: 'Your legal advice is ready',
      html: `<p>Your advice for "${caseTitle}" is ready. Please log in to view it.</p>`,
    });
  }

  async sendInvoiceEmail(email: string, invoiceNumber: string, amount: number): Promise<void> {
    await this.resend.emails.send({
      from: env.SMTP_FROM,
      to: email,
      subject: `Invoice ${invoiceNumber}`,
      html: `<p>Your invoice #${invoiceNumber} for EUR ${amount.toFixed(2)} is ready.</p>`,
    });
  }
}
