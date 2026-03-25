import { DomainException } from '../domain-exceptions';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';

export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;

  catch(exception: any, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const request: Request = context.getRequest();

    console.error(`❌ ERROR on ${request.method} ${request.url}`);
    console.error('Exception:', exception);

    this.onCatch(exception, response, request);
  }

  getDefaultHttpBody(exception: any) {
    if (exception instanceof DomainException) {
      return {
        errorMessages: exception.extensions,
      };
    }

    return [];
  }
}
