import { Injectable } from '@nestjs/common';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../setup/utils/config-validation-utility';

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

@Injectable()
export class EnvironmentConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    },
  )
  port: number = Number(this.configService.get('PORT'));

  @IsEnum(Environments, {
    message:
      'Set correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(Environments).join(', '),
  })
  env: string = this.configService.get('NODE_ENV');

  @IsNotEmpty({
    message:
      "Set Env variable ADMIN_CREDENTIALS, example: 'login:password', !!sensitive data!!",
  })
  adminCredentials: string = this.configService.get('ADMIN_CREDENTIALS');

  @IsNotEmpty({
    message:
      "Set Env variable DATABASE_URL, example: 'postgresql://user:password@localhost:5432/dbname'",
  })
  dataBaseUrl: string = this.configService.get('DATABASE_URL');

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
