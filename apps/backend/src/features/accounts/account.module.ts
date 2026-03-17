import { Module } from '@nestjs/common';
import { RegistrationController } from './api/registration.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUseCases } from './application/use-case.provider';
import { UsersRepository } from './infrastructure/users.repository';
import { AuthService } from './application/services/auth.service';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';

@Module({
  imports: [CqrsModule],
  controllers: [RegistrationController],
  providers: [
    AuthService,
    PasswordService,
    UsersRepository,
    TokenService,
    ...AuthUseCases,
  ],
  exports: [],
})
export class AccountModule {}
