import { Unauthorized } from '@src/errors/Unauthorized';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type Auth = {
  token: string;
  refresh?: string;
};

export const authorizationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth: Auth = req.cookies.auth;

  if (!auth) {
    throw new Unauthorized('Token is missing');
  }

  try {
    jwt.verify(auth.token, process.env.JWT_SECRET as string);

    next();
  } catch (error) {
    throw new Unauthorized('Invalid token');
  }
};
