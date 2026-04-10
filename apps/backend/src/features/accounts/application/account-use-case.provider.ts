import { LoginUseCase } from './use-cases/auth-use-cases/login.usecase';
import { LogoutUseCase } from './use-cases/auth-use-cases/logout.usecese';
import { UserRegistrationUseCase } from './use-cases/auth-use-cases/user-registration.use-case';
import { ConfirmEmailUseCase } from './use-cases/auth-use-cases/confirm-email.use-case';
import { ResendConfirmationUseCase } from './use-cases/auth-use-cases/resend-confirmation.use-case';
import { RefreshTokenUseCase } from './use-cases/auth-use-cases/refresh-token.usecase';
import { PasswordRecoveryUseCase } from './use-cases/auth-use-cases/password-recovery.use-case';

export const AuthUseCases = [
  UserRegistrationUseCase,
  LoginUseCase,
  LogoutUseCase,
  ConfirmEmailUseCase,
  ResendConfirmationUseCase,
  PasswordRecoveryUseCase,
  RefreshTokenUseCase,
];
