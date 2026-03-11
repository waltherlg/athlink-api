import { IsString } from 'class-validator';

export class UserCreateDto {
  @IsString()
  email: string;

  @IsString()
  userName: string;

  @IsString()
  passwordHash: string;
}
