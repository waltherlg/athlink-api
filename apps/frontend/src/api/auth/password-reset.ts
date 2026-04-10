import { apiFetch } from '../http';
import type { PasswordResetInput } from '@shared-types';
import { authPaths } from './paths';

export function resetPassword(input: PasswordResetInput) {
  return apiFetch<void>(authPaths.passwordReset, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
