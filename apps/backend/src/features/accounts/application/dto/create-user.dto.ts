import { IsString } from 'class-validator';
import type { UserCreate } from '@shared-types/accounts';

export class UserCreateDto implements UserCreate {
  @IsString()
  email: string;

  @IsString()
  userName: string;

  @IsString()
  passwordHash: string;
}
