import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ACCOUNT_ERRORS } from '../../../consts/account-errors.consts';
import { PasswordResetRequestedEvent } from '../../events/password-reset-requested.event';

export class PasswordRecoveryRequestCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryRequestCommand)
export class PasswordRecoveryRequestUseCase
  implements ICommandHandler<PasswordRecoveryRequestCommand, void>
{
  constructor(
    private userRepo: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: PasswordRecoveryRequestCommand): Promise<void> {
    const user = await this.userRepo.findUserByEmail(command.email);

    if (!user) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.EMAIL_NOT_FOUND);
    }

    const resetCode = randomUUID();
    const recoveryExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepo.updatePasswordRecoveryData(
      user.id,
      resetCode,
      recoveryExpiresAt,
    );

    this.eventBus.publish(
      new PasswordResetRequestedEvent(user.email, resetCode),
    );
  }
}
