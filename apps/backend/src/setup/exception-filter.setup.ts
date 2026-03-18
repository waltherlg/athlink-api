import { INestApplication } from '@nestjs/common';
import { DomainExceptionFilter } from '../core/exceptions/filters/domain-exception.filter';
import { AllExceptionFilter } from '../core/exceptions/filters/all-exception.filter';
import { CoreEnvironmentConfig } from '../core/config/core-env.config';

export function exceptionFilterSetup(app: INestApplication) {
  const configService = app.get(CoreEnvironmentConfig);
  app.useGlobalFilters(
    new AllExceptionFilter(configService),
    new DomainExceptionFilter(),
  );
}
