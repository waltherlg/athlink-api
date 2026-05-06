import type { CoachProfileView } from '@shared-types';
import { apiFetch } from '../http';
import { coachesPaths } from './paths';

export function getCoachProfiles(accessToken: string) {
  return apiFetch<CoachProfileView[]>(coachesPaths.profiles, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
