import { ConfirmationEmailResentHandler } from './event-handlers/confirmation-email-resent.handler';
import { PasswordResetRequestedHandler } from './event-handlers/password-reset-requested.handler';
import { UserRegisteredEmailHandler } from './event-handlers/user-registered-email.handler';

export const AccountEventHandlers = [
  UserRegisteredEmailHandler,
  ConfirmationEmailResentHandler,
  PasswordResetRequestedHandler,
];
