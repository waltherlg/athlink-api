export enum SportTypeEnum {
  SHOOTING = 'SHOOTING',
}

export type CreateTrainingLogInput = {
  sportType: SportTypeEnum;
};

export type TrainingLogView = {
  id: string;
  athleteId: string;
  sportType: SportTypeEnum;
};
