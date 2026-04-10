import { apiFetch } from '../http';
import type { PasswordRecoveryInput } from '@shared-types';
import { authPaths } from './paths';

export function requestPasswordRecovery(input: PasswordRecoveryInput) {
  return apiFetch<void>(authPaths.passwordRecovery, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
