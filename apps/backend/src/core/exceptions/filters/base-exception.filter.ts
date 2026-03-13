import { DomainException } from '../domain-exceptions';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';

export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;

  catch(exception: any, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const request: Request = context.getRequest();

    // console.error(`❌ ERROR on ${request.method} ${request.url}`);
    // console.error('Exception:', exception);

    this.onCatch(exception, response, request);
  }

  getDefaultHttpBody(exception: any) {
    const errorsMessages: { message: string; field: string }[] = [];

    if (exception instanceof DomainException) {
      exception.extensions.forEach((extension) => {
        errorsMessages.push({
          field: extension.field || 'unknown',
          message: extension.message || 'An error occurred',
        });
      });
    }
    if (errorsMessages.length) {
      return { errorsMessages: errorsMessages };
    }
    return [];
  }
}
