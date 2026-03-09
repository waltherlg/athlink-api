import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { RegistrationController } from './api/registration.controller';

@Module({
  imports: [UserModule],
  controllers: [RegistrationController],
  providers: [],
  exports: [],
})
export class RegistrationModule {}
