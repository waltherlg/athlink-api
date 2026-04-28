import { SportTypeEnum } from './training-journals-api-types';

export enum ResultTypeEnum {
  SCORE = 'SCORE',
  TIME = 'TIME',
  DISTANCE = 'DISTANCE',
}

export type SportEventView = {
  id: string;
  sportType: SportTypeEnum;
  code: string;
  name: string;
  resultType: ResultTypeEnum;
  maxScore: number | null;
  decimals: number | null;
  createdAt: string;
};
