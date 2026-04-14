import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import {
  EmailProvider,
  EmailSendOptions,
} from '../interfaces/email-provider.interface';
import { CoreEnvironmentConfig } from '../../config/core-env.config';

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;
  private readonly defaultFrom: string;

  constructor(private readonly coreEnv: CoreEnvironmentConfig) {
    this.resend = new Resend(this.coreEnv.resendApiKey);
    this.defaultFrom = this.coreEnv.resendEmailFrom;
  }

  async sendEmail(options: EmailSendOptions): Promise<void> {
    console.log('sending email via Resend...');

    try {
      const response = await this.resend.emails.send({
        from: options.from ?? this.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('email sent:', response);
    } catch (error) {
      console.error('EMAIL ERROR:', error);
    }
  }
}
