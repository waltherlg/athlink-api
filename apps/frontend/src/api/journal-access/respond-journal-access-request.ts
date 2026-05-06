import { apiFetch } from '../http';
import { journalAccessPaths } from './paths';

export function acceptJournalAccessRequest(
  accessToken: string,
  requestId: string,
) {
  return apiFetch<void>(
    journalAccessPaths.acceptRequest.replace(':requestId', requestId),
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}

export function rejectJournalAccessRequest(
  accessToken: string,
  requestId: string,
) {
  return apiFetch<void>(
    journalAccessPaths.rejectRequest.replace(':requestId', requestId),
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}
