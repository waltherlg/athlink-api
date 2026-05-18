export enum AccountErrorCodeEnum {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  CODE_ALREADY_CONFIRMED = 'CODE_ALREADY_CONFIRMED',
  CODE_INCORRECT = 'CODE_INCORRECT',
  CODE_EXPIRED = 'CODE_EXPIRED',
  CODE_INVALID = 'CODE_INVALID',
  EMAIL_ALREADY_CONFIRMED = 'EMAIL_ALREADY_CONFIRMED',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',
}

export enum AuthErrorCodeEnum {
  NOT_OWNER = 'NOT_OWNER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  EMAIL_OR_PASSWORD_INCORRECT = 'EMAIL_OR_PASSWORD_INCORRECT',
  NO_RESPONSE_FROM_OAUTH = 'NO_RESPONSE_FROM_OAUTH',
  UNSUPPORTED_OAUTH_PROVIDER = 'UNSUPPORTED__OAUTH_PROVIDER',
}

export enum SessionErrorCodeEnum {
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
}

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
} as const;

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

export const SESSION_ERRORS = {
  SESSION_NOT_FOUND: {
    code: SessionErrorCodeEnum.SESSION_NOT_FOUND,
    field: 'sessionId',
    message: 'session not found',
  },
} as const;
