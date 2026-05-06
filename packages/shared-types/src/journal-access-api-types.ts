import { SportTypeEnum } from './training-journals-api-types';

export enum JournalAccessRequestStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export type CreateJournalAccessRequestInput = {
  journalId: string;
  coachProfileId: string;
};

export type JournalAccessRequestView = {
  id: string;
  journalId: string;
  coachProfileId: string;
  athleteUserName: string;
  sportType: SportTypeEnum;
  status: JournalAccessRequestStatusEnum;
  createdAt: string;
};

export type IncomingJournalAccessRequestsCountView = {
  count: number;
};
