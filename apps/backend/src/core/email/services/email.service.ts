import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER } from '../email.constants';
import { EmailProvider } from '../interfaces/email-provider.interface';
import { EmailTemplatesService } from './email-templates.service';
import { CoreEnvironmentConfig } from '../../config/core-env.config';

@Injectable()
export class EmailService {
  constructor(
    private readonly templatesService: EmailTemplatesService,
    private readonly coreEnv: CoreEnvironmentConfig,
    @Inject(EMAIL_PROVIDER) private readonly provider: EmailProvider,
  ) {}

  async sendRegistrationConfirmation(
    email: string,
    confirmationCode: string,
  ): Promise<void> {
    const confirmUrl = this.buildConfirmEmailUrl(confirmationCode);
    const message = this.templatesService.buildRegistrationConfirmation(
      confirmationCode,
      confirmUrl,
    );

    await this.provider.sendEmail({
      to: email,
      from: this.coreEnv.emailUser,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }

  async sendConfirmationResend(
    email: string,
    confirmationCode: string,
  ): Promise<void> {
    const confirmUrl = this.buildConfirmEmailUrl(confirmationCode);
    const message = this.templatesService.buildConfirmationResend(
      confirmationCode,
      confirmUrl,
    );

    await this.provider.sendEmail({
      to: email,
      from: this.coreEnv.emailUser,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }

  async sendPasswordReset(email: string, resetCode: string): Promise<void> {
    const message = this.templatesService.buildPasswordReset(resetCode);

    await this.provider.sendEmail({
      to: email,
      from: this.coreEnv.emailUser,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }

  private buildConfirmEmailUrl(confirmationCode: string): string {
    const baseUrl = this.coreEnv.frontendBaseUrl.replace(/\/+$/, '');
    const code = encodeURIComponent(confirmationCode);
    return `${baseUrl}/confirm-email?code=${code}`;
  }
}
