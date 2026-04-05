import { SessionErrorCodeEnum } from '@shared-types/dist/error-codes';

export const SESSION_ERRORS = {
  SESSION_NOT_FOUND: {
    code: SessionErrorCodeEnum.SESSION_NOT_FOUND,
    field: 'sessionId',
    message: 'session not found',
  },
};
