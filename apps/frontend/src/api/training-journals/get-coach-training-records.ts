import type {
  PaginationOutputModel,
  RequestQueryParamsModel,
  TrainingRecordCoachView,
} from '@shared-types';
import { apiFetch } from '../http';
import { trainingJournalsPaths } from './paths';

export function getCoachTrainingRecords(
  accessToken: string,
  journalId: string,
  query: Partial<RequestQueryParamsModel> = {},
) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value != null) params.set(key, String(value));
  });
  const path = trainingJournalsPaths.coachRecords.replace(
    ':journalId',
    journalId,
  );
  const queryString = params.toString();
  return apiFetch<PaginationOutputModel<TrainingRecordCoachView>>(
    `${path}${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}
