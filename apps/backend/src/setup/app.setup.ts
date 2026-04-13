import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { exceptionFilterSetup } from './exception-filter.setup';
import { swaggerSetup } from './swagger.setup';
import { pipesSetup } from './pipes.setup';
import { validationConstraintSetup } from './validation-constraint.setup';

export function appSetup(app: INestApplication) {
  app.use(cookieParser());
  //app.useGlobalPipes(new ValidationPipe({ transform: true }));
  pipesSetup(app);
  exceptionFilterSetup(app);
  validationConstraintSetup(app);
  swaggerSetup(app);
}
