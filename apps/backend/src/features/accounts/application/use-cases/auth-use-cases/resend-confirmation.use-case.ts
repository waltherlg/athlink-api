import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ACCOUNT_ERRORS } from '../../../consts/account-errors.consts';

export class ResendConfirmationCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmationCommand)
export class ResendConfirmationUseCase
  implements ICommandHandler<ResendConfirmationCommand, void>
{
  constructor(private userRepo: UsersRepository) {}

  async execute(command: ResendConfirmationCommand): Promise<void> {
    const user = await this.userRepo.findUserByEmail(command.email);

    if (!user) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.EMAIL_NOT_FOUND);
    }

    if (user.isConfirmed) {
      throw BadRequestDomainException.create(
        ACCOUNT_ERRORS.EMAIL_ALREADY_CONFIRMED,
      );
    }

    const confirmationCode = randomUUID();
    const confirmCodeExpiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userRepo.updateConfirmationData(
      user.id,
      confirmationCode,
      confirmCodeExpiryDate,
    );
  }
}
