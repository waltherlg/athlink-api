export const authPaths = {
  controller: 'auth',
  registration: 'registration',
  login: 'login',
  me: 'me',
} as const;

export const trainingJournalsPaths = {
  controller: 'training-journal',
  records: ':trainingJournalId/records',
};

export const dashboardPaths = {
  controller: 'dashboard',
  athlete: 'athlete',
  coach: 'coach',
};
