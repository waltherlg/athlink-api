import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IncomingJournalAccessRequestsCountView } from '@shared-types';
import { JournalAccessRepository } from '../../infrastructure/training-journal-access.repository';

export class CountIncomingAccessRequestsQuery {
  constructor(public coachUserId: string) {}
}

@QueryHandler(CountIncomingAccessRequestsQuery)
export class CountIncomingAccessRequestsQueryHandler implements IQueryHandler<CountIncomingAccessRequestsQuery> {
  constructor(private repository: JournalAccessRepository) {}

  async execute(
    query: CountIncomingAccessRequestsQuery,
  ): Promise<IncomingJournalAccessRequestsCountView> {
    const count = await this.repository.countPendingIncomingRequests(
      query.coachUserId,
    );
    return { count };
  }
}
