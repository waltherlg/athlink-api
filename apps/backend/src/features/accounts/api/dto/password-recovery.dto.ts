import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';
import type { PasswordRecoveryInput } from '@shared-types';

export class PasswordRecoveryInputDto implements PasswordRecoveryInput {
  @ApiProperty({ example: 'email@abc.com' })
  @Trim()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
