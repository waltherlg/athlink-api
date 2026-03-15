import { apiFetch } from '../http';
import type {
  UserRegistrationInput,
  UserView,
} from '@shared-types/accounts';

export function registerUser(input: UserRegistrationInput) {
  return apiFetch<UserView>('/registration', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
