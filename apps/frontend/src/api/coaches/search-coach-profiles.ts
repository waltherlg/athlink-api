import type { CoachProfileSearchView, SportTypeEnum } from '@shared-types';
import { apiFetch } from '../http';
import { coachesPaths } from './paths';

export function searchCoachProfiles(
  accessToken: string,
  sportType: SportTypeEnum,
  userName: string,
) {
  const params = new URLSearchParams({
    sportType,
    userName,
  });
  return apiFetch<CoachProfileSearchView[]>(
    `${coachesPaths.search}?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
  );
}
