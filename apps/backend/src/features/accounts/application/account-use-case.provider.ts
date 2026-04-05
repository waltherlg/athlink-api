import { LoginUseCase } from './use-cases/auth-use-cases/login.usecase';
import { LogoutUseCase } from './use-cases/auth-use-cases/logout.usecese';
import { UserRegistrationUseCase } from './use-cases/auth-use-cases/user-registration.use-case';

export const AuthUseCases = [
  UserRegistrationUseCase,
  LoginUseCase,
  LogoutUseCase,
];
