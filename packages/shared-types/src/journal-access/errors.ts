export enum JournalAccessErrorCodeEnum {
  REQUEST_NOT_FOUND = 'REQUEST_NOT_FOUND',
  REQUEST_ALREADY_EXISTS = 'REQUEST_ALREADY_EXISTS',
  REQUEST_ALREADY_PROCESSED = 'REQUEST_ALREADY_PROCESSED',
  NOT_OWNER = 'NOT_OWNER',
  ACCESS_ALREADY_EXISTS = 'ACCESS_ALREADY_EXISTS',
  ACCESS_NOT_FOUND = 'ACCESS_NOT_FOUND',
  JOURNAL_NOT_FOUND = 'JOURNAL_NOT_FOUND',
  COACH_PROFILE_NOT_FOUND = 'COACH_PROFILE_NOT_FOUND',
  SPORT_TYPE_MISMATCH = 'SPORT_TYPE_MISMATCH',
}

export const JOURNAL_ACCESS_ERRORS = {
  ACCESS_ALREADY_EXISTS: {
    code: JournalAccessErrorCodeEnum.ACCESS_ALREADY_EXISTS,
    field: 'accessRequest',
    message: 'access already exists',
  },
  ACCESS_NOT_FOUND: {
    code: JournalAccessErrorCodeEnum.ACCESS_NOT_FOUND,
    field: 'access',
    message: 'access not found',
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
} as const;
