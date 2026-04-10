import { apiFetch } from '../http';
import { authPaths } from './paths';

export function confirmEmail(code: string) {
  const path = authPaths.confirmEmail.replace(':code', code);
  return apiFetch<void>(path, {
    method: 'POST',
  });
}
