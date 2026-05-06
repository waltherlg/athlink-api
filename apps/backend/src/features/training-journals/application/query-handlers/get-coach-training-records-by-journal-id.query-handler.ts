import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TrainingRecord } from '@prisma/client';
import {
  DEFAULT_QUERY_PARAMS,
  PaginationOutputModel,
  RequestQueryParamsModel,
  TrainingRecordCoachView,
  TrainingRecordTypeEnum,
} from '@shared-types';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';
import { TRAINING_JOURNAL_ERRORS } from '../../consts/training-journal-errors.consts';
import { AUTH_ERRORS } from '../../../accounts/consts/auth.errors';

export class GetCoachTrainingRecordsByJournalIdQuery {
  constructor(
    public coachUserId: string,
    public journalId: string,
    public query: Partial<RequestQueryParamsModel>,
  ) {}
}

@QueryHandler(GetCoachTrainingRecordsByJournalIdQuery)
export class GetCoachTrainingRecordsByJournalIdQueryHandler implements IQueryHandler<GetCoachTrainingRecordsByJournalIdQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(
    query: GetCoachTrainingRecordsByJournalIdQuery,
  ): Promise<PaginationOutputModel<TrainingRecordCoachView>> {
    const journal = await this.prisma.trainingJournal.findUnique({
      where: { id: query.journalId },
    });

    if (!journal) {
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );
    }

    const access = await this.prisma.journalAccess.findFirst({
      where: {
        journalId: query.journalId,
        coachProfile: {
          userId: query.coachUserId,
        },
      },
    });

    if (!access) {
      throw ForbiddenDomainException.create(AUTH_ERRORS.NOT_OWNER);
    }

    const parsed = parseQueryParams(query.query);
    const [items, totalCount] = await this.prisma.$transaction([
      this.prisma.trainingRecord.findMany({
        where: { journalId: query.journalId },
        orderBy: { [parsed.sortBy]: parsed.sortDirection },
        skip: parsed.skip,
        take: parsed.take,
      }),
      this.prisma.trainingRecord.count({
        where: { journalId: query.journalId },
      }),
    ]);

    return {
      pagesCount: totalCount === 0 ? 0 : Math.ceil(totalCount / parsed.take),
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
  return {
    sortBy,
    sortDirection,
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    pageNumber,
  };
}

function mapTrainingRecord(record: TrainingRecord): TrainingRecordCoachView {
  return {
    id: record.id,
    journalId: record.journalId,
    type: record.type as unknown as TrainingRecordTypeEnum,
    eventId: record.eventId,
    result: record.result,
    coachNotes: record.coachNotes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
