import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import type { UserRegistrationInput } from '@shared-types/accounts';
import { ACCOUNT_VALIDATION_CONSTS } from '../../consts/account-validation.consts';

export class UserRegistrationInputDto implements UserRegistrationInput {
  @ApiProperty({ example: 'email@abc.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty({ example: 'newUserName' })
  @IsNotEmpty()
  @IsString()
  @Length(
    ACCOUNT_VALIDATION_CONSTS.USERNAME_MIN_LENGTH,
    ACCOUNT_VALIDATION_CONSTS.USERNAME_MAX_LENGTH,
  )
  userName: string;
  @ApiProperty({ example: 'some123PASSWORD' })
  @IsNotEmpty()
  @IsString()
  @Length(
    ACCOUNT_VALIDATION_CONSTS.PASSWORD_MIN_LENGTH,
    ACCOUNT_VALIDATION_CONSTS.PASSWORD_MAX_LENGTH,
  )
  password: string;
}
