import { SportTypeEnum } from './training-journals-api-types';

export type UserRegistrationInput = {
  email: string;
  userName: string;
  password: string;
};

export type ConfirmEmailParams = {
  code: string;
};

export type ResendConfirmationInput = {
  email: string;
};

export type LoginInput = {
  email: string;
  password: string;
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
