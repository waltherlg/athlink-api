import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTrainingRecordDto } from '../dto/domain-training-journal.dto';
import { TrainingRecordsRepository } from '../../infrastructure/training-records.repository';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';

export class CreateTrainingRecordCommand {
  constructor(
    public userId: string,
    public dto: CreateTrainingRecordDto,
  ) {}
}

@CommandHandler(CreateTrainingRecordCommand)
export class CreateTrainingRecordUseCase
  implements ICommandHandler<CreateTrainingRecordCommand>
{
  constructor(
    private entriesRepo: TrainingRecordsRepository,
    private journalsRepo: TrainingJournalsRepository,
  ) {}

  async execute(command: CreateTrainingRecordCommand): Promise<any> {
    const trainingJournal = await this.journalsRepo.getTrainingJournalById(
      command.dto.trainingJournalId,
    );

    if (!trainingJournal)
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );

    if (trainingJournal.athleteId !== command.userId)
      throw ForbiddenDomainException.create(ACCOUNT_ERRORS.NOT_OWNER);

    const createdRecord = await this.entriesRepo.createTrainingRecord(
      command.dto,
    );
    return createdRecord;
  }
}


