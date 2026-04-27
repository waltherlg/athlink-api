import { sportEventPaths as sportEventPathsShared } from '@shared-types';

const sportEventsBase = `/${sportEventPathsShared.controller}`;

export const sportEventsPaths = {
  list: sportEventsBase,
};
