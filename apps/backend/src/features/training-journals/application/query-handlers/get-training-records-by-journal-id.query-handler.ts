import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TrainingJournalsRepository } from '../../infrastructure/training-journals.repository';
import { TrainingRecordsRepository } from '../../infrastructure/training-records.repository';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { ACCOUNT_ERRORS } from '../../../accounts/consts/account-errors.consts';
import { TrainingRecord } from '@prisma/client';
import { DEFAULT_QUERY_PARAMS, RequestQueryParamsModel } from '@shared-types';
import { TrainingRecordAthleteViewDto } from '../../api/dto/training-record.dto';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';
import { TrainingRecordTypeEnum } from '@shared-types';

export class GetTrainingRecordsByJournalIdQuery {
  constructor(
    public athleteId: string,
    public trainingJournalId: string,
    public query: Partial<RequestQueryParamsModel>,
  ) {}
}

@QueryHandler(GetTrainingRecordsByJournalIdQuery)
export class GetTrainingRecordsByJournalIdQueryHandler implements IQueryHandler<GetTrainingRecordsByJournalIdQuery> {
  constructor(
    private trainingJournalsRepo: TrainingJournalsRepository,
    private trainingRecordsRepo: TrainingRecordsRepository,
  ) {}

  async execute(query: GetTrainingRecordsByJournalIdQuery): Promise<{
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: TrainingRecordAthleteViewDto[];
  }> {
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

    const parsed = parseQueryParams(query.query);
    const { items, totalCount } =
      await this.trainingRecordsRepo.getTrainingRecordsByTrainingJournalId(
        trainingJournal.id,
        parsed,
      );

    const pagesCount =
      totalCount === 0 ? 0 : Math.ceil(totalCount / parsed.take);

    return {
      pagesCount,
      page: parsed.pageNumber,
      pageSize: parsed.take,
      totalCount,
      items: items.map(mapTrainingRecord),
    };
  }
}

function parseQueryParams(query: Partial<RequestQueryParamsModel>): {
  sortBy: keyof TrainingRecord;
  sortDirection: 'asc' | 'desc';
  skip: number;
  take: number;
  pageNumber: number;
} {
  const allowedSortBy: Array<keyof TrainingRecord> = [
    'createdAt',
    'updatedAt',
    'result',
  ];

  const sortByRaw = query.sortBy ?? DEFAULT_QUERY_PARAMS.sortBy;
  const sortBy: keyof TrainingRecord = allowedSortBy.includes(
    sortByRaw as keyof TrainingRecord,
  )
    ? (sortByRaw as keyof TrainingRecord)
    : 'createdAt';

  const sortDirectionRaw =
    query.sortDirection ?? DEFAULT_QUERY_PARAMS.sortDirection;
  const sortDirection =
    sortDirectionRaw.toUpperCase() === 'ASC' ? 'asc' : 'desc';

  const pageNumberRaw = Number.parseInt(
    query.pageNumber ?? DEFAULT_QUERY_PARAMS.pageNumber,
    10,
  );
  const pageNumber =
    Number.isNaN(pageNumberRaw) || pageNumberRaw < 1 ? 1 : pageNumberRaw;

  const pageSizeRaw = Number.parseInt(
    query.pageSize ?? DEFAULT_QUERY_PARAMS.pageSize,
    10,
  );
  const pageSize =
    Number.isNaN(pageSizeRaw) || pageSizeRaw < 1 ? 10 : pageSizeRaw;

  const skip = (pageNumber - 1) * pageSize;

  return {
    sortBy,
    sortDirection,
    skip,
    take: pageSize,
    pageNumber,
  };
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
