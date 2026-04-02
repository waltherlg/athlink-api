import { trainingJournalsPaths as trainingJournalsPathsShared } from '@shared-types';

const trainingJournalsBase = `/${trainingJournalsPathsShared.controller}`;

export const trainingJournalsPaths = {
  list: trainingJournalsBase,
  byId: `${trainingJournalsBase}/${trainingJournalsPathsShared.byId}`,
  records: `${trainingJournalsBase}/${trainingJournalsPathsShared.byId}/${trainingJournalsPathsShared.records}`,
  buildPostRecordsPath: (id: string) =>
    `/${trainingJournalsPathsShared.buildPostRecordsPath(id)}`,
};
