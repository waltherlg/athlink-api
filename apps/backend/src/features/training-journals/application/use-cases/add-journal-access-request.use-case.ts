import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';

export class JournalAccessRequestCommand {
  constructor(
    public journalId: string,
    public coachProfileId: string,
  ) {}
}

@CommandHandler(JournalAccessRequestCommand)
export class JournalAccessRequestUseCase implements ICommandHandler<JournalAccessRequestCommand> {
  constructor(private journalsRepository: TrainingJournalsRepository) {}
  async execute(command: JournalAccessRequestCommand): Promise<any> {}
}
