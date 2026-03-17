import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';
import { ACCOUNT_VALIDATION_CONSTS } from '../../consts/account-validation.consts';
import { Trim } from '../../../../core/decorators/trim.decorator';

export class LoginUserDto {
  @ApiProperty({ example: 'email@abc.com' })
  @Trim()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'somePassword' })
  @IsString()
  @Trim()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  })
  accessToken: string;
}
