import { trainingJournalsPaths as trainingJournalsPathsShared } from '@shared-types';

const trainingJournalsBase = `/${trainingJournalsPathsShared.controller}`;

export const trainingJournalsPaths = {
  list: trainingJournalsBase,
  byId: `${trainingJournalsBase}/${trainingJournalsPathsShared.byId}`,
  records: `${trainingJournalsBase}/${trainingJournalsPathsShared.byId}/${trainingJournalsPathsShared.records}`,
  recordById: `${trainingJournalsBase}/${trainingJournalsPathsShared.byId}/${trainingJournalsPathsShared.recordById}`,
  buildPostRecordsPath: (id: string) =>
    `/${trainingJournalsPathsShared.buildPostRecordsPath(id)}`,
};
