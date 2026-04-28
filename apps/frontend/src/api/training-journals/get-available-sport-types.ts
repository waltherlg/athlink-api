import { apiFetch } from '../http';
import type { SportTypeEnum } from '@shared-types';
import { trainingJournalsPaths } from './paths';

export function getAvailableSportTypes(
  accessToken: string,
): Promise<SportTypeEnum[]> {
  return apiFetch<SportTypeEnum[]>(trainingJournalsPaths.availableSportTypes, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}

