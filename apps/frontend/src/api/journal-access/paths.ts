import { journalAccessPaths as journalAccessPathsShared } from '@shared-types';

const journalAccessBase = `/${journalAccessPathsShared.controller}`;

export const journalAccessPaths = {
  requests: `${journalAccessBase}/${journalAccessPathsShared.requests}`,
  incomingRequests: `${journalAccessBase}/${journalAccessPathsShared.incomingRequests}`,
  incomingRequestsCount: `${journalAccessBase}/${journalAccessPathsShared.incomingRequestsCount}`,
  acceptRequest: `${journalAccessBase}/${journalAccessPathsShared.acceptRequest}`,
  rejectRequest: `${journalAccessBase}/${journalAccessPathsShared.rejectRequest}`,
  journalCoaches: `${journalAccessBase}/${journalAccessPathsShared.journalCoaches}`,
  accessById: `${journalAccessBase}/${journalAccessPathsShared.accessById}`,
};
