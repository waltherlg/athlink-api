import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class UserRegistrationInputDto {
  @ApiProperty({ example: 'email@abc.com' })
  @IsString()
  email: string;
  @ApiProperty({ example: 'newUserName' })
  @IsString()
  @Length(3, 20)
  userName: string;
  @ApiProperty({ example: 'some123PASSWORD' })
  @IsString()
  @MinLength(6)
  password: string;
}
