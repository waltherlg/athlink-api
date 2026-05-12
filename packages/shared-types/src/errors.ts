import {
  AccountErrorCodeEnum,
  AuthErrorCodeEnum,
  SessionErrorCodeEnum,
} from './accounts/errors';
import { CoachErrorCodeEnum } from './coaches/errors';
import { CommonErrorCodeEnum } from './common/errors';
import { JournalAccessErrorCodeEnum } from './journal-access/errors';
import { TrainingJournalErrorCodeEnum } from './training-journals/errors';
import { TrainingRecordErrorCodeEnum } from './training-records/errors';

export type ErrorCode =
  | AccountErrorCodeEnum
  | CommonErrorCodeEnum
  | TrainingJournalErrorCodeEnum
  | TrainingRecordErrorCodeEnum
  | SessionErrorCodeEnum
  | AuthErrorCodeEnum
  | CoachErrorCodeEnum
  | JournalAccessErrorCodeEnum;
