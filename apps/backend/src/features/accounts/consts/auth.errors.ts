import { AuthErrorCodeEnum } from '@shared-types/dist/error-codes';

export const AUTH_ERRORS = {
  UNAUTHORIZED: {
    code: AuthErrorCodeEnum.UNAUTHORIZED,
    field: 'user',
    message: 'User unauthorized',
  },
  NO_RESPONSE_FROM_OAUTH: {
    code: AuthErrorCodeEnum.NO_RESPONSE_FROM_OAUTH,
    field: 'provider',
    message: 'no response from oauth service',
  },
  UNSUPPORTED_OAUTH_PROVIDER: {
    code: AuthErrorCodeEnum.UNSUPPORTED_OAUTH_PROVIDER,
    field: 'provider',
    message: 'Unsupported provider',
  },
  EMAIL_OR_PASSWORD_INCORRECT: {
    code: AuthErrorCodeEnum.EMAIL_OR_PASSWORD_INCORRECT,
    field: 'email or password',
    message: 'The email or password are incorrect',
  },
  NOT_OWNER: {
    code: AuthErrorCodeEnum.NOT_OWNER,
    field: 'userId',
    message: 'only owner can change this data',
  },
} as const;
