import type { JournalCoachAccessView } from '@shared-types';
import { apiFetch } from '../http';
import { journalAccessPaths } from './paths';

export function getJournalCoachAccesses(
  accessToken: string,
  journalId: string,
) {
  const path = journalAccessPaths.journalCoaches.replace(
    ':journalId',
    journalId,
  );
  return apiFetch<JournalCoachAccessView[]>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
