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
