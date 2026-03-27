import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUseCases } from './application/account-use-case.provider';
import { UsersRepository } from './infrastructure/users.repository';
import { AuthService } from './application/services/auth.service';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './api/auth.controller';
import { UserEnvironmentConfig } from './config/user-env.config';
import { GuardsStrategy } from './guards/strategy-providers';
import { UsersQueryRepository } from './infrastructure/users-query.repository';

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [
    UserEnvironmentConfig,
    AuthService,
    PasswordService,
    JwtService,
    UsersRepository,
    UsersQueryRepository,
    TokenService,
    ...AuthUseCases,
    ...GuardsStrategy,
  ],
  exports: [UsersRepository],
})
export class AccountModule {}
