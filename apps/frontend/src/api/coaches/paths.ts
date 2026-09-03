import { coachesPaths as coachesPathsShared } from '@athlink/shared-types';

const coachesBase = `/${coachesPathsShared.controller}`;

export const coachesPaths = {
  create: coachesBase,
  profiles: `${coachesBase}/${coachesPathsShared.profiles}`,
  availableSportTypes: `${coachesBase}/${coachesPathsShared.availableSportTypes}`,
  search: `${coachesBase}/${coachesPathsShared.search}`,
};
