import { apiFetch } from '../http';
import type {
  UserRegistrationInput,
  UserRegistrationResponse,
} from '../../types/auth';

export function registerUser(input: UserRegistrationInput) {
  return apiFetch<UserRegistrationResponse>('/registration', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
