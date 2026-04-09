import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../core/email/services/email.service';
import { UserRegisteredEvent } from '../events/user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEmailHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(private readonly emailService: EmailService) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    await this.emailService.sendRegistrationConfirmation(
      event.email,
      event.confirmationCode,
    );
  }
}
