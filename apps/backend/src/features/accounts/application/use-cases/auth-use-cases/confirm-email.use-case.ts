import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ACCOUNT_ERRORS } from '../../../consts/account-errors.consts';

export class ConfirmEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand, void>
{
  constructor(private userRepo: UsersRepository) {}

  async execute(command: ConfirmEmailCommand): Promise<void> {
    const user = await this.userRepo.findUserByConfirmationCode(command.code);

    if (!user) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.CODE_INVALID);
    }

    if (user.isConfirmed) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.CODE_ALREADY_CONFIRMED);
    }

    if (!user.confirmCodeExpiryDate || user.confirmCodeExpiryDate < new Date()) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.CODE_EXPIRED);
    }

    await this.userRepo.confirmUser(user.id);
  }
}
