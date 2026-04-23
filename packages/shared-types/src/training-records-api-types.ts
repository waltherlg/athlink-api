import { PaginationOutputModel } from './query-models';

export type CreateTrainingRecordInput = {
  type: TrainingRecordTypeEnum;

  eventId?: string;
  result?: number;

  coachNotes?: string;
  privateNotes?: string;
};

export type TrainingRecordAthleteView = {
  id: string;
  trainingJournalId: string;
  result: string | null;
  coachNotes: string | null;
  privateNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrainingRecordCoachView = {
  id: string;
  userName: string;
  trainingJournalId: string;
  result: string | null;
  coachNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export enum TrainingRecordTypeEnum {
  STRUCTURED = 'STRUCTURED',
  FREE = 'FREE',
}

export type TrainingRecordsPaginationView =
  PaginationOutputModel<TrainingRecordAthleteView>;
