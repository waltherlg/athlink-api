import { apiFetch } from '../http';
import type { TrainingJournalWithLatestRecordsView } from '@shared-types';
import { trainingJournalsPaths } from './paths';

export function getTrainingJournalById(
  accessToken: string,
  journalId: string,
) {
  const path = trainingJournalsPaths.byId.replace(
    ':journalId',
    journalId,
  );
  return apiFetch<TrainingJournalWithLatestRecordsView>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
