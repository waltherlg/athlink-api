import { CookieOptions } from 'express';

export const cookieSettings: CookieOptions = {
  httpOnly: true,
  secure: true,
};
