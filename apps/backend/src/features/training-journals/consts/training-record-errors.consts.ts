import { TrainingRecordErrorCodeEnum } from '@shared-types';

export const TRAINING_RECORD_ERRORS = {
  EVENT_REQUIRED: {
    code: TrainingRecordErrorCodeEnum.EVENT_REQUIRED,
    field: 'eventId',
    message: 'for training record event required',
  },

  EVENT_NOT_ALLOWED: {
    code: TrainingRecordErrorCodeEnum.EVENT_NOT_ALLOWED,
    field: 'eventId',
    message: 'free training does not allow event selection',
  },

  EVENT_INVALID: {
    code: TrainingRecordErrorCodeEnum.EVENT_INVALID,
    field: 'eventId',
    message: 'selected event is invalid',
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
