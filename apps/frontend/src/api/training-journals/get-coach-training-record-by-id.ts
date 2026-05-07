import type { TrainingRecordCoachView } from '@shared-types';
import { apiFetch } from '../http';
import { trainingJournalsPaths } from './paths';

export function getCoachTrainingRecordById(
  accessToken: string,
  journalId: string,
  recordId: string,
) {
  const path = trainingJournalsPaths.coachRecordById
    .replace(':journalId', journalId)
    .replace(':recordId', recordId);

  return apiFetch<TrainingRecordCoachView>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
