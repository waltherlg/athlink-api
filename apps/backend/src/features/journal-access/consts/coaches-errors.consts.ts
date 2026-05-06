import { JournalAccessErrorCodeEnum } from '@shared-types';

export const JOURNAL_ACCESS_ERRORS = {
  ACCESS_ALREADY_EXISTS: {
    code: JournalAccessErrorCodeEnum.ACCESS_ALREADY_EXISTS,
    field: 'accessRequest',
    message: 'access already exists',
  },
  NOT_OWNER: {
    code: JournalAccessErrorCodeEnum.NOT_OWNER,
    field: 'accessRequest',
    message: 'it is not your request',
  },
  REQUEST_ALREADY_PROCESSED: {
    code: JournalAccessErrorCodeEnum.REQUEST_ALREADY_PROCESSED,
    field: 'accessRequest',
    message: 'already processed',
  },
  REQUEST_NOT_FOUND: {
    code: JournalAccessErrorCodeEnum.REQUEST_NOT_FOUND,
    field: 'accessRequest',
    message: 'request not found',
  },
  REQUEST_ALREADY_EXISTS: {
    code: JournalAccessErrorCodeEnum.REQUEST_ALREADY_EXISTS,
    field: 'accessRequest',
    message: 'pending request already exists',
  },
  JOURNAL_NOT_FOUND: {
    code: JournalAccessErrorCodeEnum.JOURNAL_NOT_FOUND,
    field: 'journal',
    message: 'journal not found',
  },
  COACH_PROFILE_NOT_FOUND: {
    code: JournalAccessErrorCodeEnum.COACH_PROFILE_NOT_FOUND,
    field: 'coachProfile',
    message: 'coach profile not found',
  },
  SPORT_TYPE_MISMATCH: {
    code: JournalAccessErrorCodeEnum.SPORT_TYPE_MISMATCH,
    field: 'coachProfile',
    message: 'coach profile sport type does not match journal',
  },
};
