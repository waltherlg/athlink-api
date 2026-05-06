import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  CoachDashboardDataView,
  SportTypeEnum,
  DEFAULT_QUERY_PARAMS,
  RequestQueryParamsModel,
} from '@shared-types';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';

export class GetCoachDashboardQuery {
  constructor(
    public coachUserId: string,
    public coachProfileId: string | undefined,
    public query: Partial<RequestQueryParamsModel>,
  ) {}
}

@QueryHandler(GetCoachDashboardQuery)
export class GetCoachDashboardQueryHandler implements IQueryHandler<GetCoachDashboardQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(query: GetCoachDashboardQuery): Promise<CoachDashboardDataView> {
    const params = parseQueryParams(query.query);

    const [accesses, totalCount] = await this.prisma.$transaction([
      this.prisma.journalAccess.findMany({
        where: {
          coachProfile: {
            userId: query.coachUserId,
          },
          coachProfileId: query.coachProfileId,
        },
        include: {
          journal: {
            include: {
              athlete: {
                select: { userName: true },
              },
              records: {
                include: {
                  event: {
                    select: { name: true },
                  },
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.journalAccess.count({
        where: {
          coachProfile: {
            userId: query.coachUserId,
          },
          coachProfileId: query.coachProfileId,
        },
      }),
    ]);

    return {
      pagesCount: totalCount === 0 ? 0 : Math.ceil(totalCount / params.take),
      page: params.pageNumber,
      pageSize: params.take,
      totalCount,
      items: accesses.map((access) => {
        const latestRecord = access.journal.records[0];
        return {
          id: access.journal.id,
          athleteUserName: access.journal.athlete.userName,
          sportType: access.journal.sportType as SportTypeEnum,
          latestRecord: latestRecord
            ? {
                id: latestRecord.id,
                date: latestRecord.createdAt.toISOString(),
                event: latestRecord.event?.name ?? null,
                result: latestRecord.result,
              }
            : null,
        };
      }),
    };
  }
}

function parseQueryParams(query: Partial<RequestQueryParamsModel>): {
  skip: number;
  take: number;
  pageNumber: number;
} {
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
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    pageNumber,
  };
}
