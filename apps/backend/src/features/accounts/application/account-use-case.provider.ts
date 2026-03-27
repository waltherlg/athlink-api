import { LoginUseCase } from './use-cases/auth-use-cases/login.usecase';
import { UserRegistrationUseCase } from './use-cases/auth-use-cases/user-registration.use-case';

export const AuthUseCases = [UserRegistrationUseCase, LoginUseCase];
