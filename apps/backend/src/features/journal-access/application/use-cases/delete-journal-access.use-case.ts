import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { AUTH_ERRORS } from '@shared-types';
import { JOURNAL_ACCESS_ERRORS } from '@shared-types';
import { JournalAccessRepository } from '../../infrastructure/training-journal-access.repository';

export class DeleteJournalAccessCommand {
  constructor(
    public athleteId: string,
    public accessId: string,
  ) {}
}

@CommandHandler(DeleteJournalAccessCommand)
export class DeleteJournalAccessUseCase implements ICommandHandler<DeleteJournalAccessCommand> {
  constructor(private repository: JournalAccessRepository) {}

  async execute(command: DeleteJournalAccessCommand): Promise<void> {
    const access = await this.repository.getAccessById(command.accessId);

    if (!access) {
      throw NotFoundDomainException.create(
        JOURNAL_ACCESS_ERRORS.ACCESS_NOT_FOUND,
      );
    }

    if (access.journal.athleteId !== command.athleteId) {
      throw ForbiddenDomainException.create(AUTH_ERRORS.NOT_OWNER);
    }

    await this.repository.deleteAccess(command.accessId);
  }
}
