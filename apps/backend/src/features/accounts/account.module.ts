import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUseCases } from './application/account-use-case.provider';
import { UsersRepository } from './infrastructure/users.repository';
import { AuthService } from './application/services/auth.service';
import { CryptoService } from './application/services/crypto.service';
import { TokenService } from './application/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './api/auth.controller';
import { UserEnvironmentConfig } from './config/user-env.config';
import { GuardsStrategy } from './guards/strategy-providers';
import { UsersQueryRepository } from './infrastructure/users-query.repository';
import { SessionsService } from './application/services/session.service';
import { SessionsRepository } from './infrastructure/sessions.repository';

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [
    UserEnvironmentConfig,
    AuthService,
    CryptoService,
    JwtService,
    UsersRepository,
    UsersQueryRepository,
    SessionsRepository,
    TokenService,
    SessionsService,
    ...AuthUseCases,
    ...GuardsStrategy,
  ],
  exports: [UsersRepository],
})
export class AccountModule {}
