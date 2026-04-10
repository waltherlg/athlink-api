import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { BadRequestDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { ACCOUNT_ERRORS } from '../../../consts/account-errors.consts';
import { CryptoService } from '../../services/crypto.service';

export class PasswordResetCommand {
  constructor(
    public email: string,
    public code: string,
    public newPassword: string,
  ) {}
}

@CommandHandler(PasswordResetCommand)
export class PasswordResetUseCase
  implements ICommandHandler<PasswordResetCommand, void>
{
  constructor(
    private userRepo: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(command: PasswordResetCommand): Promise<void> {
    const user = await this.userRepo.findUserByEmailAndRecoveryCode(
      command.email,
      command.code,
    );

    if (!user) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.CODE_INVALID);
    }

    if (
      !user.passwordRecoveryExpiresAt ||
      user.passwordRecoveryExpiresAt < new Date()
    ) {
      throw BadRequestDomainException.create(ACCOUNT_ERRORS.CODE_EXPIRED);
    }

    const passwordHash = await this.cryptoService.hash(command.newPassword);

    await this.userRepo.updatePasswordByRecovery(user.id, passwordHash);
  }
}
