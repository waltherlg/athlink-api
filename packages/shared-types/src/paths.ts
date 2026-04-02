export const authPaths = {
  controller: 'auth',
  registration: 'registration',
  login: 'login',
  me: 'me',
} as const;

export const trainingJournalsPaths = {
  controller: 'training-journal',
  list: '',
  byId: ':trainingJournalId',
  records: 'records',
  recordById: 'records/:recordId',

  buildPostRecordsPath: (id: string) =>
    `${trainingJournalsPaths.controller}/${id}/${trainingJournalsPaths.records}`,
  buildRecordByIdPath: (journalId: string, recordId: string) =>
    `${trainingJournalsPaths.controller}/${journalId}/${trainingJournalsPaths.records}/${recordId}`,
} as const;

export const dashboardPaths = {
  controller: 'dashboard',
  athlete: 'athlete',
  coach: 'coach',
};
