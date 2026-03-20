import { accountsPaths } from '@shared-types';

const authBase = `/${accountsPaths.authorization.controller}`;

export const authPaths = {
  registration: `${authBase}/${accountsPaths.authorization.registration}`,
  login: `${authBase}/${accountsPaths.authorization.login}`,
  me: `${authBase}/${accountsPaths.authorization.me}`,
};
