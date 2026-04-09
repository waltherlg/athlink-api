import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../core/email/services/email.service';
import { PasswordResetRequestedEvent } from '../events/password-reset-requested.event';

@EventsHandler(PasswordResetRequestedEvent)
export class PasswordResetRequestedHandler
  implements IEventHandler<PasswordResetRequestedEvent>
{
  constructor(private readonly emailService: EmailService) {}

  async handle(event: PasswordResetRequestedEvent): Promise<void> {
    await this.emailService.sendPasswordReset(event.email, event.resetCode);
  }
}
