import { apiFetch } from '../http';
import type { PasswordRecoveryRequestInput } from '@shared-types';
import { authPaths } from './paths';

export function requestPasswordRecovery(input: PasswordRecoveryRequestInput) {
  return apiFetch<void>(authPaths.passwordRecoveryRequest, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
