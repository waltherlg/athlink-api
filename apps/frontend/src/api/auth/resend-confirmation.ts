import { apiFetch } from '../http';
import type { ResendConfirmationInput } from '@shared-types';
import { authPaths } from './paths';

export function resendConfirmation(input: ResendConfirmationInput) {
  return apiFetch<void>(authPaths.resendConfirmation, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
