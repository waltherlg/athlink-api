import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './rt-payload-from-req.deocrator';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw UnauthorizedDomainException.create('Not authorized');
    }
    return user.id;
  },
);
