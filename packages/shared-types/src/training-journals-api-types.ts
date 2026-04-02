import { TrainingRecordAthleteView } from './training-records-api-types';

export enum SportTypeEnum {
  SHOOTING = 'SHOOTING',
}

export type CreateTrainingJournalInput = {
  sportType: SportTypeEnum;
};

export type TrainingJournalView = {
  id: string;
  athleteId: string;
  sportType: SportTypeEnum;
};

export type TrainingJournalWithLatestRecordsView = TrainingJournalView & {
  latestRecords: TrainingRecordAthleteView[];
};
