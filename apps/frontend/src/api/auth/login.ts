import { apiFetch } from '../http';
import type { LoginInput, LoginResponse } from '@shared-types';
import { authPaths } from './paths';

export function loginUser(input: LoginInput) {
  return apiFetch<LoginResponse>(authPaths.login, {
    method: 'POST',
    body: JSON.stringify(input),
    credentials: 'include',
  });
}
