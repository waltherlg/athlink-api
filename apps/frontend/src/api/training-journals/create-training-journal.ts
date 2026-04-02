import { apiFetch } from '../http';
import type {
  CreateTrainingJournalInput,
  TrainingJournalView,
} from '@shared-types';
import { trainingJournalsPaths } from './paths';

export function createTrainingJournal(
  accessToken: string,
  input: CreateTrainingJournalInput,
) {
  return apiFetch<TrainingJournalView>(trainingJournalsPaths.list, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
