import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './rt-payload-from-req.deocrator';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('User not found in request (guard issue)');
    }
    return request.user.userId;
  },
);
