import { IsString, Length, MinLength } from 'class-validator';

export class UserRegistrationInputDto {
  @IsString()
  email: string;

  @IsString()
  @Length(3, 20)
  userName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
