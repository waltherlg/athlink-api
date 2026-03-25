import { TrainingLogErrorCodeEnum } from '@shared-types/dist/error-codes';

export const TRAINING_LOG_ERRORS = {
  TRAINING_LOG_ALREADY_EXISTS: {
    code: TrainingLogErrorCodeEnum.TRAINING_LOG_ALREADY_EXISTS,
    field: 'sportType',
    message: 'training log with this sport type already exist',
  },
};
