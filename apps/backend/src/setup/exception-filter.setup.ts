import { INestApplication } from '@nestjs/common';
import { EnvironmentConfig } from '../core/config/env.config';

export function exceptionFilterSetup(app: INestApplication) {
  const configService = app.get(EnvironmentConfig);
  app.useGlobalFilters();
}
