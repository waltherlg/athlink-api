import { AccountErrorCodeEnum } from '@shared-types';

export const ACCOUNT_ERRORS = {
  USER_NAME_ALREADY_EXITS: {
    code: AccountErrorCodeEnum.USERNAME_ALREADY_EXISTS,
    field: 'userName',
    message: 'User with this username is already registered',
  },
  EMAIL_ALREADY_EXITS: {
    code: AccountErrorCodeEnum.EMAIL_ALREADY_EXISTS,
    field: 'email',
    message: 'User with this email is already registered',
  },
  CODE_ALREADY_CONFIRMED: {
    code: AccountErrorCodeEnum.CODE_ALREADY_CONFIRMED,
    field: 'code',
    message: 'The code has already been confirmed',
  },
  CODE_INCORRECT: {
    code: AccountErrorCodeEnum.CODE_INCORRECT,
    field: 'code',
    message: 'Incorrect code',
  },
  CODE_EXPIRED: {
    code: AccountErrorCodeEnum.CODE_EXPIRED,
    field: 'code',
    message: 'The code has expired',
  },
  CODE_INVALID: {
    code: AccountErrorCodeEnum.CODE_INVALID,
    field: 'code',
    message: 'The confirmation code is incorrect or has expired',
  },
  EMAIL_ALREADY_CONFIRMED: {
    code: AccountErrorCodeEnum.EMAIL_ALREADY_CONFIRMED,
    field: 'email',
    message: 'Email address is already confirmed',
  },
  EMAIL_NOT_FOUND: {
    code: AccountErrorCodeEnum.EMAIL_NOT_FOUND,
    field: 'email',
    message: "User with this email doesn't exist",
  },
  EMAIL_NOT_CONFIRMED: {
    code: AccountErrorCodeEnum.EMAIL_NOT_CONFIRMED,
    field: 'email',
    message: 'Email address is not confirmed',
  },
  UNAUTHORIZED: {
    code: AccountErrorCodeEnum.UNAUTHORIZED,
    field: 'user',
    message: 'User unauthorized',
  },
  NO_RESPONSE_FROM_OAUTH: {
    code: AccountErrorCodeEnum.NO_RESPONSE_FROM_OAUTH,
    field: 'provider',
    message: 'no response from oauth service',
  },
  UNSUPPORTED__OAUTH_PROVIDER: {
    code: AccountErrorCodeEnum.UNSUPPORTED__OAUTH_PROVIDER,
    field: 'provider',
    message: 'Unsupported provider',
  },
  EMAIL_OR_PASSWORD_INCORRECT: {
    code: AccountErrorCodeEnum.EMAIL_OR_PASSWORD_INCORRECT,
    field: 'email or password',
    message: 'The email or password are incorrect',
  },
} as const;
