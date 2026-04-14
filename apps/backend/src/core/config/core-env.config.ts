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
export class CoreEnvironmentConfig {
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

  @IsNotEmpty({
    message:
      "Set Env variable BACKEND_BASE_URL, example: 'http://localhost:3000'",
  })
  backendBaseUrl: string = this.configService.get('BACKEND_BASE_URL');

  @IsNotEmpty({
    message:
      "Set Env variable FRONTEND_BASE_URL, example: 'http://localhost:4173'",
  })
  frontendBaseUrl: string = this.configService.get('FRONTEND_BASE_URL');

  @IsNotEmpty({
    message:
      "Set Env variable EMAIL_USER, example: 'example@gmail.com', !!sensitive data!!",
  })
  emailUser: string = this.configService.get('EMAIL_USER');

  @IsNotEmpty({
    message:
      "Set Env variable EMAIL_PASSWORD, example: 'app-password', !!sensitive data!!",
  })
  emailPassword: string = this.configService.get('EMAIL_PASSWORD');

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message:
      "Set Env variable RESEND_API_KEY, example: 'app-password', !!sensitive data!!",
  })
  resendApiKey: string = this.configService.get('RESEND_API_KEY');

  @IsNotEmpty({
    message:
      "Set Env variable RESEND_EMAIL_FROM, example: 'app-password', !!sensitive data!!",
  })
  resendEmailFrom: string = this.configService.get('RESEND_EMAIL_FROM');
}
