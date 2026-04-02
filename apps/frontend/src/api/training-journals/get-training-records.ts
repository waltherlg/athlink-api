import { apiFetch } from '../http';
import type {
  RequestQueryParamsModel,
  TrainingRecordsPaginationView,
} from '@shared-types';
import { trainingJournalsPaths } from './paths';

type QueryParams = Partial<RequestQueryParamsModel>;

const buildQueryString = (params: QueryParams) => {
  const search = new URLSearchParams();
  if (params.sortBy) search.set('sortBy', params.sortBy);
  if (params.sortDirection) search.set('sortDirection', params.sortDirection);
  if (params.pageNumber) search.set('pageNumber', params.pageNumber);
  if (params.pageSize) search.set('pageSize', params.pageSize);
  const value = search.toString();
  return value ? `?${value}` : '';
};

export function getTrainingRecords(
  accessToken: string,
  trainingJournalId: string,
  params: QueryParams = {},
) {
  const basePath = trainingJournalsPaths.records.replace(
    ':trainingJournalId',
    trainingJournalId,
  );
  const path = `${basePath}${buildQueryString(params)}`;
  return apiFetch<TrainingRecordsPaginationView>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
