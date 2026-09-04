import type { SportTypeEnum } from '@athlink/shared-types';
import { apiFetch } from '../http';
import { coachesPaths } from './paths';

export function getAvailableCoachSportTypes(accessToken: string) {
  return apiFetch<SportTypeEnum[]>(coachesPaths.availableSportTypes, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
