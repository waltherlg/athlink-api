import { Module } from '@nestjs/common';
import { UsersRepository } from './infrastructure/users.repository';

@Module({
  imports: [],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UserModule {}
