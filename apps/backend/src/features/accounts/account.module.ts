import { Module } from '@nestjs/common';
import { RegistrationController } from './api/registration.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUseCases } from './application/use-case.provider';
import { UsersRepository } from './infrastructure/users.repository';

@Module({
  imports: [CqrsModule],
  controllers: [RegistrationController],
  providers: [UsersRepository, ...AuthUseCases],
  exports: [],
})
export class AccountModule {}
