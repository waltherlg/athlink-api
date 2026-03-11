import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { exceptionFilterSetup } from './exception-filter.setup';
import { swaggerSetup } from './swagger.setup';

export function appSetup(app: INestApplication) {
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  exceptionFilterSetup(app);
  swaggerSetup(app);
}
