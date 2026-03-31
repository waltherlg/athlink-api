import { CreateTrainingRecordUseCase } from './use-cases/create-training-record.use-case';
import { CreateTrainingJournalUseCase } from './use-cases/create-training-journal.use-case';

export const TrainingJournalUseCases = [
  CreateTrainingJournalUseCase,
  CreateTrainingRecordUseCase,
];

