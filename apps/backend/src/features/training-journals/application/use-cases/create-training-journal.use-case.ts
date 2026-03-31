import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTrainingJournalDto } from '../dto/domain-training-journal.dto';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';

export class CreateTrainingJournalCommand {
  constructor(public dto: CreateTrainingJournalDto) {}
}

@CommandHandler(CreateTrainingJournalCommand)
export class CreateTrainingJournalUseCase
  implements ICommandHandler<CreateTrainingJournalCommand>
{
  constructor(private trainingJournalRepo: TrainingJournalsRepository) {}

  async execute(command: CreateTrainingJournalCommand): Promise<string> {
    const { athleteId, sportType } = command.dto;
    if (
      await this.trainingJournalRepo.isTrainingJournalExist(athleteId, sportType)
    ) {
      throw BadRequestDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_ALREADY_EXISTS,
      );
    }
    const createdJournal = await this.trainingJournalRepo.createTrainingJournal(
      command.dto,
    );
    return createdJournal.id;
  }
}

