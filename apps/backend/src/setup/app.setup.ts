import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { exceptionFilterSetup } from './exception-filter.setup';
import { swaggerSetup } from './swagger.setup';

export function appSetup(app: INestApplication) {
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  exceptionFilterSetup(app);
  swaggerSetup(app);
}
