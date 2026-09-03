import type { IncomingJournalAccessRequestsCountView } from '@athlink/shared-types';
import { apiFetch } from '../http';
import { journalAccessPaths } from './paths';

export function getIncomingJournalAccessRequestsCount(accessToken: string) {
  return apiFetch<IncomingJournalAccessRequestsCountView>(
    journalAccessPaths.incomingRequestsCount,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}
