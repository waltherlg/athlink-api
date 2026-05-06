import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  JournalAccessRequestStatusEnum,
  JournalAccessRequestView,
  SportTypeEnum,
} from '@shared-types';
import { JournalAccessRepository } from '../../infrastructure/training-journal-access.repository';

export class GetIncomingAccessRequestsQuery {
  constructor(public coachUserId: string) {}
}

@QueryHandler(GetIncomingAccessRequestsQuery)
export class GetIncomingAccessRequestsQueryHandler implements IQueryHandler<GetIncomingAccessRequestsQuery> {
  constructor(private repository: JournalAccessRepository) {}

  async execute(
    query: GetIncomingAccessRequestsQuery,
  ): Promise<JournalAccessRequestView[]> {
    const requests = await this.repository.getPendingIncomingRequests(
      query.coachUserId,
    );
    return requests.map((request) => ({
      id: request.id,
      journalId: request.journalId,
      coachProfileId: request.coachProfileId,
      athleteUserName: request.journal.athlete.userName,
      sportType: request.journal.sportType as SportTypeEnum,
      status: request.status as JournalAccessRequestStatusEnum,
      createdAt: request.createdAt.toISOString(),
    }));
  }
}
