import { SportTypeEnum } from './training-logs';

export type UserRegistrationInput = {
  email: string;
  userName: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CreateTrainingLogInput = {
  sportType: SportTypeEnum;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type UserNameResponse = string | null;

export type UserView = {
  id: string;
  email: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
};
