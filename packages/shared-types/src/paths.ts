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

  buildPostRecordsPath: (id: string) =>
    `${trainingJournalsPaths.controller}/${id}/${trainingJournalsPaths.records}`,
} as const;

export const dashboardPaths = {
  controller: 'dashboard',
  athlete: 'athlete',
  coach: 'coach',
};
