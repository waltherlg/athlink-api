import { CountIncomingAccessRequestsQueryHandler } from './query-handlers/count-incoming-access-requests.query-handler';
import { GetIncomingAccessRequestsQueryHandler } from './query-handlers/get-incoming-access-requests.query-handler';
import { GetJournalCoachAccessesQueryHandler } from './query-handlers/get-journal-coach-accesses.query-handler';

export const JournalAccessQueries = [
  GetIncomingAccessRequestsQueryHandler,
  CountIncomingAccessRequestsQueryHandler,
  GetJournalCoachAccessesQueryHandler,
];
