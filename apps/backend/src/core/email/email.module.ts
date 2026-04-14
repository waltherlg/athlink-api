import { Module } from '@nestjs/common';
import { CoreConfigModule } from '../config/core-config.module';
import { EMAIL_PROVIDER } from './email.constants';
import { NodemailerEmailProvider } from './providers/nodemailer-email.provider';
import { EmailTemplatesService } from './services/email-templates.service';
import { EmailService } from './services/email.service';
import { ResendEmailProvider } from './providers/resend-email.provider';

@Module({
  imports: [CoreConfigModule],
  providers: [
    EmailTemplatesService,
    EmailService,
    {
      provide: EMAIL_PROVIDER,
      useClass: ResendEmailProvider,
    },
  ],
  exports: [EmailService, EmailTemplatesService],
})
export class EmailModule {}
