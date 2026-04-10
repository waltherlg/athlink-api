import { authPaths as authPathsShared } from '@shared-types';

const authBase = `/${authPathsShared.controller}`;

export const authPaths = {
  registration: `${authBase}/${authPathsShared.registration}`,
  login: `${authBase}/${authPathsShared.login}`,
  logout: `${authBase}/${authPathsShared.logout}`,
  refreshToken: `${authBase}/${authPathsShared.refreshToken}`,
  me: `${authBase}/${authPathsShared.me}`,
  confirmEmail: `${authBase}/${authPathsShared.confirmEmail}`,
  resendConfirmation: `${authBase}/${authPathsShared.resendConfirmation}`,
  passwordRecovery: `${authBase}/${authPathsShared.passwordRecovery}`,
};
