import { Unauthorized } from '@src/errors/Unauthorized';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorizationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fullToken: string | undefined = req.headers.authorization;

  console.log(fullToken);

  if (!fullToken) {
    throw new Unauthorized('Token is missing');
  }

  const [, token] = fullToken.split(' ');

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);

    next();
  } catch (error) {
    throw new Unauthorized('Invalid token');
  }
};
