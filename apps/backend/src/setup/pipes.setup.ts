import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  BadRequestDomainException,
  ErrorMessage,
} from '../core/exceptions/domain-exceptions';

export const errorFormatter = (
  errors: ValidationError[],
  errorMessage?: any,
): ErrorMessage[] => {
  const errorsForResponse = errorMessage || [];

  for (const error of errors) {
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, errorsForResponse);
    } else if (error?.constraints) {
      const constraintKeys = Object.keys(error.constraints);

      for (const key of constraintKeys) {
        errorsForResponse.push({
          message: error.constraints[key]
            ? `${error.constraints[key]}; Received value: ${error?.value}`
            : '',
          field: error.property,
        });
      }
    }
  }
  return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors: any = errorFormatter(errors);
        throw BadRequestDomainException.createWithArray(formattedErrors);
      },
    }),
  );
}
