import type { SportEventView, SportTypeEnum } from '@shared-types';
import { apiFetch } from '../http';
import { sportEventsPaths } from './paths';

export function getSportEventsBySportType(
  accessToken: string,
  sportType: SportTypeEnum,
) {
  const query = new URLSearchParams({ sportType });
  const path = `${sportEventsPaths.list}?${query.toString()}`;
  return apiFetch<SportEventView[]>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
