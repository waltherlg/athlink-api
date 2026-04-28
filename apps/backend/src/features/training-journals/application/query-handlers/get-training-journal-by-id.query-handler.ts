import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import { TrainingRecordsRepository } from '../../infrastructure/training-records.repository';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';
import { TrainingJournalWithLatestRecordsViewDto } from '../../api/dto/training-journal.dto';
import { SportTypeEnum, TrainingRecordTypeEnum } from '@shared-types';
import { TrainingRecordAthleteViewDto } from '../../api/dto/training-record.dto';
import { TrainingRecord } from '@prisma/client';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';

export class GetTrainingJournalByIdQuery {
  constructor(
    public athleteId: string,
    public trainingJournalId: string,
  ) {}
}

@QueryHandler(GetTrainingJournalByIdQuery)
export class GetTrainingJournalByIdQueryHandler implements IQueryHandler<GetTrainingJournalByIdQuery> {
  constructor(
    private trainingJournalsRepo: TrainingJournalsRepository,
    private trainingRecordsRepo: TrainingRecordsRepository,
  ) {}

  async execute(
    query: GetTrainingJournalByIdQuery,
  ): Promise<TrainingJournalWithLatestRecordsViewDto> {
    const trainingJournal =
      await this.trainingJournalsRepo.getTrainingJournalById(
        query.trainingJournalId,
      );

    if (!trainingJournal)
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );

    if (trainingJournal.athleteId !== query.athleteId)
      throw ForbiddenDomainException.create(AUTH_ERRORS.NOT_OWNER);

    const latestRecords =
      await this.trainingRecordsRepo.getLatestRecordsByTrainingJournalId(
        trainingJournal.id,
        3,
      );

    return {
      id: trainingJournal.id,
      athleteId: trainingJournal.athleteId,
      sportType: trainingJournal.sportType as SportTypeEnum,
      latestRecords: latestRecords.map(mapTrainingRecord),
    };
  }
}

function mapTrainingRecord(
  record: TrainingRecord,
): TrainingRecordAthleteViewDto {
  return {
    id: record.id,
    trainingJournalId: record.trainingJournalId,
    type: record.type as unknown as TrainingRecordTypeEnum,
    eventId: record.eventId,
    result: record.result,
    coachNotes: record.coachNotes,
    privateNotes: record.privateNotes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
