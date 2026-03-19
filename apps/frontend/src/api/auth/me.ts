import { apiFetch } from '../http';
import type { UserNameResponse } from '@shared-types';
import { authPaths } from './paths';

export function getMe(accessToken: string) {
  return apiFetch<UserNameResponse>(authPaths.me, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
}
