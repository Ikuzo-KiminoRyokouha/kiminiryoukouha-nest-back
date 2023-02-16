import { CookieOptions, Response } from 'express';

export const sendHttpOnlyCookie = (
  res: Response,
  key: string,
  value: string,
  options?: CookieOptions,
) => {
  res.cookie(key, value, {
    ...options,
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV != 'dev',
    domain: process.env.NODE_ENV != 'dev' ? '.vercel.app' : 'localhost',
  });
};
