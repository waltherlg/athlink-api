import { apiFetch } from '../http';
import type {
  CreateTrainingRecordInput,
  TrainingRecordAthleteView,
} from '@athlink/shared-types';
import { trainingJournalsPaths } from './paths';

export function createTrainingRecord(
  accessToken: string,
  journalId: string,
  input: CreateTrainingRecordInput,
) {
  const path = trainingJournalsPaths.buildPostRecordsPath(journalId);
  return apiFetch<TrainingRecordAthleteView>(path, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
