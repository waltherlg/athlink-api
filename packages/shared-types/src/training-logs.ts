export enum SportTypeEnum {
  SHOOTING = 'SHOOTING',
}

export type CreateTrainingLogInput = {
  sportType: SportTypeEnum;
};
