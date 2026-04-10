import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';
import type { PasswordResetInput } from '@shared-types';
import { ACCOUNT_VALIDATION_CONSTS } from '../../consts/account-validation.consts';

export class PasswordResetInputDto implements PasswordResetInput {
  @ApiProperty({ example: 'email@abc.com' })
  @Trim()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '0f4e3b2c-4b1a-4a9d-9e3f-6e5d4c3b2a1f' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'some123PASSWORD' })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(
    ACCOUNT_VALIDATION_CONSTS.PASSWORD_MIN_LENGTH,
    ACCOUNT_VALIDATION_CONSTS.PASSWORD_MAX_LENGTH,
  )
  newPassword: string;
}
