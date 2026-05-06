import type { JournalAccessRequestView } from '@shared-types';
import { apiFetch } from '../http';
import { journalAccessPaths } from './paths';

export function getIncomingJournalAccessRequests(accessToken: string) {
  return apiFetch<JournalAccessRequestView[]>(
    journalAccessPaths.incomingRequests,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}
