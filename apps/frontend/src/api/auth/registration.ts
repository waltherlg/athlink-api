import { apiFetch } from '../http';
import type { UserRegistrationInput, UserView } from '@shared-types';
import { authPaths } from './paths';

export function registerUser(input: UserRegistrationInput) {
  return apiFetch<UserView>(authPaths.registration, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
