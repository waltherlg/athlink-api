import { TrainingLogErrorCodeEnum } from '@shared-types';

export const TRAINING_LOG_ERRORS = {
  TRAINING_LOG_ALREADY_EXISTS: {
    code: TrainingLogErrorCodeEnum.TRAINING_LOG_ALREADY_EXISTS,
    field: 'sportType',
    message: 'training log with this sport type already exist',
  },

  TRAINING_LOG_NOT_FOUND: {
    code: TrainingLogErrorCodeEnum.TRAINING_LOG_NOT_FOUND,
    field: 'trainingLog',
    message: 'training log not found',
  },
} as const;
