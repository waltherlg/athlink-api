import { dashboardPaths as dashboardPathsShared } from '@shared-types';

const dashboardBase = `/${dashboardPathsShared.controller}`;

export const dashboardPaths = {
  athlete: `${dashboardBase}/${dashboardPathsShared.athlete}`,
};
