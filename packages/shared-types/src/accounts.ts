export type UserRegistrationInput = {
  email: string;
  userName: string;
  password: string;
};

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