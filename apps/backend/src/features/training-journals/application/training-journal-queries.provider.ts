import { GetTrainingJournalByIdQueryHandler } from './query-handlers/get-training-journal-by-id.query-handler';
import { GetTrainingJournalsQueryHandler } from './query-handlers/get-training-journals.query-handler';
import { GetTrainingRecordsByJournalIdQueryHandler } from './query-handlers/get-training-records-by-journal-id.query-handler';

export const TrainingJournalQueries = [
  GetTrainingJournalsQueryHandler,
  GetTrainingJournalByIdQueryHandler,
  GetTrainingRecordsByJournalIdQueryHandler,
];
