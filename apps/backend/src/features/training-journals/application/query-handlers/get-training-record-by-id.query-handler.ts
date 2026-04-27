import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TrainingRecordsRepository } from '../../infrastructure/training-records.repository';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';
import { TrainingRecord } from '@prisma/client';
import { TrainingRecordAthleteViewDto } from '../../api/dto/training-record.dto';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';

export class GetTrainingRecordByIdQuery {
  constructor(
    public athleteId: string,
    public trainingJournalId: string,
    public recordId: string,
  ) {}
}

@QueryHandler(GetTrainingRecordByIdQuery)
export class GetTrainingRecordByIdQueryHandler implements IQueryHandler<GetTrainingRecordByIdQuery> {
  constructor(
    private trainingRecordsRepo: TrainingRecordsRepository,
    private trainingJournalsRepo: TrainingJournalsRepository,
  ) {}

  async execute(
    query: GetTrainingRecordByIdQuery,
  ): Promise<TrainingRecordAthleteViewDto> {
    const record = await this.trainingRecordsRepo.getTrainingRecordById(
      query.recordId,
    );

    if (!record)
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );

    if (record.trainingJournalId !== query.trainingJournalId)
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );

    const trainingJournal =
      await this.trainingJournalsRepo.getTrainingJournalById(
        record.trainingJournalId,
      );

    if (!trainingJournal)
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );

    if (trainingJournal.athleteId !== query.athleteId)
      throw ForbiddenDomainException.create(AUTH_ERRORS.NOT_OWNER);

    return mapTrainingRecord(record);
  }
}

function mapTrainingRecord(
  record: TrainingRecord,
): TrainingRecordAthleteViewDto {
  return {
    id: record.id,
    trainingJournalId: record.trainingJournalId,
    result: record.result,
    coachNotes: record.coachNotes,
    privateNotes: record.privateNotes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
