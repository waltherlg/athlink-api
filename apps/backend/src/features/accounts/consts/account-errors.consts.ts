export const ACCOUNT_ERRORS = {
  USER_NAME_ALREADY_EXITS: {
    field: 'userName',
    message: 'User with this username is already registered',
  },
  EMAIL_ALREADY_EXITS: {
    field: 'email',
    message: 'User with this email is already registered',
  },
  CODE_ALREADY_CONFIRMED: {
    field: 'code',
    message: 'The code has already been confirmed',
  },
  CODE_INCORRECT: {
    field: 'code',
    message: 'Incorrect code',
  },
  CODE_EXPIRED: {
    field: 'code',
    message: 'The code has expired',
  },
  CODE_INVALID: {
    field: 'code',
    message: 'The confirmation code is incorrect or has expired',
  },
  EMAIL_ALREADY_CONFIRMED: {
    field: 'email',
    message: 'Email address is already confirmed',
  },
  EMAIL_NOT_FOUND: {
    field: 'email',
    message: "User with this email doesn't exist",
  },
  EMAIL_NOT_CONFIRMED: {
    field: 'email',
    message: 'Email address is not confirmed',
  },
  NO_EMAIL_IN_PROFILE: {
    field: 'email',
    message: 'Servece did not provide an email',
  },
  NO_RESPONSE_FROM_OAUTH: {
    field: 'provider',
    message: 'no response from oauth service',
  },
  UNSUPPORTED__OAUTH_PROVIDER: {
    field: 'provider',
    message: 'Unsupported provider',
  },
  UNAUTHORIZED: {
    field: 'user',
    message: 'User unauthorized',
  },
};
