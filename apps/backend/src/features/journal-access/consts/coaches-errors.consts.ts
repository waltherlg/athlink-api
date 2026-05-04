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
};
