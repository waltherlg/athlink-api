import { apiFetch } from '../http';
import { authPaths } from './paths';

export function logoutUser() {
  return apiFetch<void>(authPaths.logout, {
    method: 'POST',
    credentials: 'include',
    skipAuthRefresh: true,
  });
}
