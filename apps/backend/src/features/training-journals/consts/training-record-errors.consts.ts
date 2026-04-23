import { TrainingRecordErrorCodeEnum } from '@shared-types';

export const TRAINING_RECORD_ERRORS = {
  EVENT_REQUIRED: {
    code: TrainingRecordErrorCodeEnum.EVENT_REQUIRED,
    field: 'event',
    message: 'for training record event required',
  },

  RESULT_INVALID: {
    code: TrainingRecordErrorCodeEnum.RESULT_INVALID,
    field: 'result',
    message: 'value if result is invalid',
  },

  RESULT_REQUIRED: {
    code: TrainingRecordErrorCodeEnum.RESULT_REQUIRED,
    field: 'result',
    message: 'result required',
  },

  RESULT_NOT_ALLOWED: {
    code: TrainingRecordErrorCodeEnum.RESULT_NOT_ALLOWED,
    field: 'result',
    message: 'free training not allowed',
  },
} as const;
