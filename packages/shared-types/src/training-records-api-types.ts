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
  journalId: string;
  type: TrainingRecordTypeEnum;
  eventId: string | null;
  result: number | null;
  coachNotes: string | null;
  privateNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrainingRecordCoachView = {
  id: string;
  journalId: string;
  type: TrainingRecordTypeEnum;
  eventId: string | null;
  event: string | null;
  result: number | null;
  coachNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CoachTrainingRecordsPaginationView =
  PaginationOutputModel<TrainingRecordCoachView> & {
    athleteUserName: string;
  };

export enum TrainingRecordTypeEnum {
  STRUCTURED = 'STRUCTURED',
  FREE = 'FREE',
}

export type TrainingRecordsPaginationView =
  PaginationOutputModel<TrainingRecordAthleteView>;
