import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { RegistrationController } from './api/registration.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [UserModule, CqrsModule],
  controllers: [RegistrationController],
  providers: [],
  exports: [],
})
export class AuthModule {}
