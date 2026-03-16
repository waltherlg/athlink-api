import { Injectable } from '@nestjs/common';
import { configValidationUtility } from '../../../setup/utils/config-validation-utility';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, Matches } from 'class-validator';

@Injectable()
export class UserEnvironmentConfig {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: 'Set env variable ACCESS_TOKEN_EXPIRES_IN, e.g., 15m',
  })
  @Matches(/^\d+[smhd]$/, {
    message:
      'ACCESS_TOKEN_EXPIRES must match format like "15s", "20m", "5h", "7d"',
  })
  accessTokenExpiresIn: string = this.configService.get<string>(
    'ACCESS_TOKEN_EXPIRES_IN',
  );

  @IsNotEmpty({
    message: 'Set env variable REFRESH_TOKEN_EXPIRES, e.g., 7d',
  })
  @Matches(/^\d+[smhd]$/, {
    message:
      'REFRESH_TOKEN_EXPIRES_IN must match format like "15s", "20m", "5h", "7d"',
  })
  refreshTokenExpiresIn: string = this.configService.get<string>(
    'REFRESH_TOKEN_EXPIRES_IN',
  );

  @IsNotEmpty({
    message: 'Set env variable ACCESS_TOKEN_SECRET',
  })
  accessTokenSecret: string = this.configService.get<string>(
    'ACCESS_TOKEN_SECRET',
  );

  @IsNotEmpty({
    message: 'Set env variable REFRESH_TOKEN_SECRET',
  })
  refreshTokenSecret: string = this.configService.get<string>(
    'REFRESH_TOKEN_SECRET',
  );
}
