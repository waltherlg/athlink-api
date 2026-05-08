import { apiFetch } from '../http';
import { journalAccessPaths } from './paths';

export function deleteJournalAccess(accessToken: string, accessId: string) {
  const path = journalAccessPaths.accessById.replace(':accessId', accessId);
  return apiFetch<void>(path, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
