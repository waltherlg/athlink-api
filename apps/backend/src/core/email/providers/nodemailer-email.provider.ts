import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  EmailProvider,
  EmailSendOptions,
} from '../interfaces/email-provider.interface';
import { CoreEnvironmentConfig } from '../../config/core-env.config';

@Injectable()
export class NodemailerEmailProvider implements EmailProvider {
  private readonly transporter: Transporter;
  private readonly defaultFrom: string;

  constructor(private readonly coreEnv: CoreEnvironmentConfig) {
    this.defaultFrom = this.coreEnv.emailUser;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.coreEnv.emailUser,
        pass: this.coreEnv.emailPassword,
      },
    });
  }

  async sendEmail(options: EmailSendOptions): Promise<void> {
    await this.transporter.sendMail({
      from: options.from ?? this.defaultFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}
