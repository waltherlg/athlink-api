import { INestApplication } from '@nestjs/common';
import { DomainExceptionFilter } from '../core/exceptions/filters/domain-exception.filter';
import { AllExceptionFilter } from '../core/exceptions/filters/all-exception.filter';
import { EnvironmentConfig } from '../core/config/env.config';

export function exceptionFilterSetup(app: INestApplication) {
  const configService = app.get(EnvironmentConfig);
  app.useGlobalFilters(
    new AllExceptionFilter(configService),
    new DomainExceptionFilter(),
  );
}
