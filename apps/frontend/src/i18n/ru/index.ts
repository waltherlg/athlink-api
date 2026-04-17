import { header } from './header';
import { auth } from './auth';
import { confirmEmail } from './confirmEmail';
import { login } from './login';
import { register } from './register';
import { passwordRecovery } from './passwordRecovery';
import { passwordReset } from './passwordReset';
import { dashboard } from './dashboard';
import { journal } from './journal';
import { record } from './record';
import { journalCreate } from './journalCreate';
import { sportType } from './sportType';
import { legal } from './legal';

export const ru = {
  ...header,
  ...auth,
  ...confirmEmail,
  ...login,
  ...register,
  ...passwordRecovery,
  ...passwordReset,
  ...dashboard,
  ...journal,
  ...record,
  ...journalCreate,
  ...sportType,
  ...legal,
} as const;
