import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { Response } from 'express';
import { CoreEnvironmentConfig } from '../../config/core-env.config';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  constructor(private configService: CoreEnvironmentConfig) {
    super();
  }
  onCatch(exception: any, response: Response): void {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const isProduction = this.configService.env === 'production';
    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        ...this.getDefaultHttpBody(exception),
        path: null,
        message: 'Some error occurred',
      });
      return;
    }
    response.status(status).json({ ...this.getDefaultHttpBody(exception) });
  }
}
