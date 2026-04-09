import { CookieOptions } from 'express';

export const baseCookieSettings: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};
