export const authPaths = {
  controller: 'auth',
  registration: 'registration',
  login: 'login',
  logout: 'logout',
  refreshToken: 'refresh-token',
  me: 'me',
  confirmEmail: 'confirm-email/:code',
  resendConfirmation: 'resend-confirmation',
  passwordRecoveryRequest: 'password-recovery-request',
  passwordReset: 'password-reset',
} as const;

export const trainingJournalsPaths = {
  controller: 'training-journal',
  list: '',
  availableSportTypes: 'available-sport-types',
  byId: ':journalId',
  records: 'records',
  recordById: 'records/:recordId',
  coachRecords: 'coach-records',

  buildPostRecordsPath: (id: string) =>
    `${trainingJournalsPaths.controller}/${id}/${trainingJournalsPaths.records}`,
  buildRecordByIdPath: (journalId: string, recordId: string) =>
    `${trainingJournalsPaths.controller}/${journalId}/${trainingJournalsPaths.records}/${recordId}`,
} as const;

export const sportEventPaths = {
  controller: 'events',
} as const;

export const dashboardPaths = {
  controller: 'dashboard',
  athlete: 'athlete',
  coach: 'coach',
};

export const coachesPaths = {
  controller: 'coaches',
  profiles: 'profiles',
  availableSportTypes: 'available-sport-types',
  search: 'search',
};

export const journalAccessPaths = {
  controller: 'journal-access',
  requests: 'requests',
  incomingRequests: 'requests/incoming',
  incomingRequestsCount: 'requests/incoming/count',
  acceptRequest: 'requests/:requestId/accept',
  rejectRequest: 'requests/:requestId/reject',

  buildAcceptRequestPath: (requestId: string) =>
    `${journalAccessPaths.controller}/requests/${requestId}/accept`,
  buildRejectRequestPath: (requestId: string) =>
    `${journalAccessPaths.controller}/requests/${requestId}/reject`,
} as const;
