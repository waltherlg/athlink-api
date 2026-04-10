import { apiFetch } from '../http';
import type {
  CreateTrainingJournalInput,
  TrainingJournalView,
} from '@shared-types';
import { trainingJournalsPaths } from './paths';

export type CreateTrainingJournalResponse = TrainingJournalView | string;

export function createTrainingJournal(
  accessToken: string,
  input: CreateTrainingJournalInput,
): Promise<CreateTrainingJournalResponse> {
  return apiFetch<CreateTrainingJournalResponse>(trainingJournalsPaths.list, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
