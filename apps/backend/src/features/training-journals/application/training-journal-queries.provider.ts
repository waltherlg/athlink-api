import { GetTrainingJournalByIdQueryHandler } from './query-handlers/get-training-journal-by-id.query-handler';
import { GetTrainingJournalsQueryHandler } from './query-handlers/get-training-journals.query-handler';
import { GetTrainingRecordsByJournalIdQueryHandler } from './query-handlers/get-training-records-by-journal-id.query-handler';
import { GetTrainingRecordByIdQueryHandler } from './query-handlers/get-training-record-by-id.query-handler';
import { GetAvailableSportTypesQueryHandler } from './query-handlers/get-available-sport-types.query-handler';

export const TrainingJournalQueries = [
  GetTrainingJournalsQueryHandler,
  GetAvailableSportTypesQueryHandler,
  GetTrainingJournalByIdQueryHandler,
  GetTrainingRecordsByJournalIdQueryHandler,
  GetTrainingRecordByIdQueryHandler,
];
