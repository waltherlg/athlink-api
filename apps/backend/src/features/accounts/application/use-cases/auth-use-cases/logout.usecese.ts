import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { SessionsRepository } from '../../../infrastructure/sessions.repository';
import { SESSION_ERRORS } from '../../../consts/session-errors.consts';

export class LogoutCommand {
  constructor(
    public userId: string,
    public sessionId: string,
  ) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand, void> {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(command: LogoutCommand) {
    const isDeleted = await this.sessionsRepository.delete(
      command.userId,
      command.sessionId,
    );

    if (!isDeleted) {
      throw NotFoundDomainException.create(SESSION_ERRORS.SESSION_NOT_FOUND);
    }
  }
}
