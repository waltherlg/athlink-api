import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  TrainingRecordCoachView,
  TrainingRecordTypeEnum,
} from '@shared-types';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';
import { TRAINING_JOURNAL_ERRORS } from '@shared-types';
import { AUTH_ERRORS } from '@shared-types';

export class GetCoachTrainingRecordByIdQuery {
  constructor(
    public coachUserId: string,
    public journalId: string,
    public recordId: string,
  ) {}
}

@QueryHandler(GetCoachTrainingRecordByIdQuery)
export class GetCoachTrainingRecordByIdQueryHandler implements IQueryHandler<GetCoachTrainingRecordByIdQuery> {
  constructor(private prisma: PrismaService) {}

  async execute(
    query: GetCoachTrainingRecordByIdQuery,
  ): Promise<TrainingRecordCoachView> {
    const record = await this.prisma.trainingRecord.findUnique({
      where: { id: query.recordId },
      include: {
        event: {
          select: { name: true },
        },
      },
    });

    if (!record || record.journalId !== query.journalId) {
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

    return {
      id: record.id,
      journalId: record.journalId,
      type: record.type as unknown as TrainingRecordTypeEnum,
      eventId: record.eventId,
      event: record.event?.name ?? null,
      result: record.result,
      coachNotes: record.coachNotes,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}
