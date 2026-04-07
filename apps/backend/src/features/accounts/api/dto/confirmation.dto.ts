import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import type { ConfirmEmailParams, ResendConfirmationInput } from '@shared-types';

export class ConfirmEmailCodeParamDto implements ConfirmEmailParams {
  @ApiProperty({ example: '0f4e3b2c-4b1a-4a9d-9e3f-6e5d4c3b2a1f' })
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  code: string;
}

export class ResendConfirmationInputDto
  implements ResendConfirmationInput
{
  @ApiProperty({ example: 'email@abc.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
