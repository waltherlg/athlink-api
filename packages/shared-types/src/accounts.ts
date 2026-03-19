export type UserRegistrationInput = {
  email: string;
  userName: string;
  password: string;
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

export type UserCreate = {
  email: string;
  userName: string;
  passwordHash: string;
};

export type UserView = {
  id: string;
  email: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
};
