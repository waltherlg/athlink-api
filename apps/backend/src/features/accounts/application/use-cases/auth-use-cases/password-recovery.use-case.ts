import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ACCOUNT_ERRORS } from '../../../consts/account-errors.consts';
import { PasswordResetRequestedEvent } from '../../events/password-reset-requested.event';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand, void>
{
  constructor(
    private userRepo: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const user = await this.userRepo.findUserByEmail(command.email);

    if (!user) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.EMAIL_NOT_FOUND);
    }

    const resetCode = randomUUID();
    this.eventBus.publish(new PasswordResetRequestedEvent(user.email, resetCode));
  }
}
