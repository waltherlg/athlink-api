import { authPaths as authPathsShared } from '@shared-types';

const authBase = `/${authPathsShared.controller}`;

export const authPaths = {
  registration: `${authBase}/${authPathsShared.registration}`,
  login: `${authBase}/${authPathsShared.login}`,
  me: `${authBase}/${authPathsShared.me}`,
};
