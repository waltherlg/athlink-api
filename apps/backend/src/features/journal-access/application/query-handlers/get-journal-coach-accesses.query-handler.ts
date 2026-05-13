import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JournalCoachAccessView, SportTypeEnum } from '@shared-types';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';
import { PrismaService } from '../../../../core/database/prisma/prisma.service';
import { TRAINING_JOURNAL_ERRORS } from '@shared-types';
import { AUTH_ERRORS } from '@shared-types';
import { JournalAccessRepository } from '../../infrastructure/training-journal-access.repository';

export class GetJournalCoachAccessesQuery {
  constructor(
    public athleteId: string,
    public journalId: string,
  ) {}
}

@QueryHandler(GetJournalCoachAccessesQuery)
export class GetJournalCoachAccessesQueryHandler implements IQueryHandler<GetJournalCoachAccessesQuery> {
  constructor(
    private prisma: PrismaService,
    private repository: JournalAccessRepository,
  ) {}

  async execute(
    query: GetJournalCoachAccessesQuery,
  ): Promise<JournalCoachAccessView[]> {
    const journal = await this.prisma.trainingJournal.findUnique({
      where: { id: query.journalId },
    });

    if (!journal) {
      throw NotFoundDomainException.create(
        TRAINING_JOURNAL_ERRORS.TRAINING_JOURNAL_NOT_FOUND,
      );
    }

    if (journal.athleteId !== query.athleteId) {
      throw ForbiddenDomainException.create(AUTH_ERRORS.NOT_OWNER);
    }

    const accesses = await this.repository.getJournalCoachAccesses(
      query.journalId,
    );

    return accesses.map((access) => ({
      accessId: access.id,
      coachProfileId: access.coachProfileId,
      userName: access.coachProfile.user.userName,
      sportType: access.coachProfile.sportType as SportTypeEnum,
      createdAt: access.createdAt.toISOString(),
    }));
  }
}
