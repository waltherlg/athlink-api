import type { TrainingRecordAthleteView } from '@shared-types';
import { apiFetch } from '../http';
import { trainingJournalsPaths } from './paths';

export function getTrainingRecordById(
  accessToken: string,
  trainingJournalId: string,
  recordId: string,
) {
  const path = trainingJournalsPaths.recordById
    .replace(':trainingJournalId', trainingJournalId)
    .replace(':recordId', recordId);

  return apiFetch<TrainingRecordAthleteView>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
