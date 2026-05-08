import type { CreateJournalAccessRequestInput } from '@shared-types';
import { apiFetch } from '../http';
import { journalAccessPaths } from './paths';

export function createJournalAccessRequest(
  accessToken: string,
  input: CreateJournalAccessRequestInput,
) {
  return apiFetch<{ id: string }>(journalAccessPaths.requests, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
