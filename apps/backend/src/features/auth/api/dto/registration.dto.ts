import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UserRegistrationInputDto {
  @ApiProperty({ example: 'email@abc.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @ApiProperty({ example: 'newUserName' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  userName: string;
  @ApiProperty({ example: 'some123PASSWORD' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
