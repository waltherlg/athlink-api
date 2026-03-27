import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ForbiddenDomainException } from '../../../../core/exceptions/domain-exceptions';
import { JwtPayloadDto } from '../../application/dto/domain-auth.dto';

export interface RequestWithUser extends Request {
  user: JwtPayloadDto;
}

export const ExtractPayloadFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayloadDto => {
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    const payload: JwtPayloadDto = request.user;

    if (!request.user) {
      throw new Error('User not found in request (guard issue)');
    }

    return payload;
  },
);
