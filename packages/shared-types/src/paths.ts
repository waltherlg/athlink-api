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
  byId: ':trainingJournalId',
  records: 'records',
  recordById: 'records/:recordId',

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
