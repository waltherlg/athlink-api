import type { TrainingRecordAthleteView } from '@shared-types';
import { apiFetch } from '../http';
import { trainingJournalsPaths } from './paths';

export function getTrainingRecordById(
  accessToken: string,
  journalId: string,
  recordId: string,
) {
  const path = trainingJournalsPaths.recordById
    .replace(':journalId', journalId)
    .replace(':recordId', recordId);

  return apiFetch<TrainingRecordAthleteView>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
