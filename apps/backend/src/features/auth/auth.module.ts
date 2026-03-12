import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { RegistrationController } from './api/registration.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthUseCases } from './application/use-case.provider';

@Module({
  imports: [UserModule, CqrsModule],
  controllers: [RegistrationController],
  providers: [...AuthUseCases],
  exports: [],
})
export class AuthModule {}
