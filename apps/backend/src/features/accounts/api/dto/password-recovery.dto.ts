import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../core/decorators/trim.decorator';
import type { PasswordRecoveryRequestInput } from '@shared-types';

export class PasswordRecoveryRequestInputDto
  implements PasswordRecoveryRequestInput
{
  @ApiProperty({ example: 'email@abc.com' })
  @Trim()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
