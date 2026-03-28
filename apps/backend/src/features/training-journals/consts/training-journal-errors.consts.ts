import { TrainingJournalErrorCodeEnum } from '@shared-types';

export const TRAINING_JOURNAL_ERRORS = {
  TRAINING_JOURNAL_ALREADY_EXISTS: {
    code: TrainingJournalErrorCodeEnum.TRAINING_JOURNAL_ALREADY_EXISTS,
    field: 'sportType',
    message: 'training journal with this sport type already exist',
  },

  TRAINING_JOURNAL_NOT_FOUND: {
    code: TrainingJournalErrorCodeEnum.TRAINING_JOURNAL_NOT_FOUND,
    field: 'trainingJournal',
    message: 'training journal not found',
  },
} as const;

