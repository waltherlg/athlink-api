import { Module } from '@nestjs/common';
import { RegistrationController } from './api/registration.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUseCases } from './application/use-case.provider';
import { UsersRepository } from './infrastructure/users.repository';
import { AuthService } from './application/services/auth.service';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './api/auth.controller';
import { UserEnvironmentConfig } from './config/user-env.config';
import { GuardsStrategy } from './guards/strategy-providers';

@Module({
  imports: [CqrsModule],
  controllers: [RegistrationController, AuthController],
  providers: [
    UserEnvironmentConfig,
    AuthService,
    PasswordService,
    JwtService,
    UsersRepository,
    TokenService,
    ...AuthUseCases,
    ...GuardsStrategy,
  ],
  exports: [],
})
export class AccountModule {}
