import { dashboardPaths as dashboardPathsShared } from '@athlink/shared-types';

const dashboardBase = `/${dashboardPathsShared.controller}`;

export const dashboardPaths = {
  athlete: `${dashboardBase}/${dashboardPathsShared.athlete}`,
  coach: `${dashboardBase}/${dashboardPathsShared.coach}`,
};
