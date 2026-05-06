import type { CoachProfileView, CreateCoachProfileInput } from '@shared-types';
import { apiFetch } from '../http';
import { coachesPaths } from './paths';

export function createCoachProfile(
  accessToken: string,
  input: CreateCoachProfileInput,
) {
  return apiFetch<CoachProfileView>(coachesPaths.create, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
