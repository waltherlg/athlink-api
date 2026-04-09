import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../core/email/services/email.service';
import { ConfirmationEmailResentEvent } from '../events/confirmation-email-resent.event';

@EventsHandler(ConfirmationEmailResentEvent)
export class ConfirmationEmailResentHandler
  implements IEventHandler<ConfirmationEmailResentEvent>
{
  constructor(private readonly emailService: EmailService) {}

  async handle(event: ConfirmationEmailResentEvent): Promise<void> {
    await this.emailService.sendConfirmationResend(
      event.email,
      event.confirmationCode,
    );
  }
}
