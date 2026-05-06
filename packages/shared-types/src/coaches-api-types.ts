import { SportTypeEnum } from './training-journals-api-types';

export type CreateCoachProfileInput = {
  sportType: SportTypeEnum;
};

export type CoachProfileView = {
  id: string;
  sportType: SportTypeEnum;
};

export type CoachProfileSearchView = CoachProfileView & {
  userName: string;
};
