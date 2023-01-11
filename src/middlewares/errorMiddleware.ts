import { Request, Response, NextFunction } from 'express';

interface AplicationError extends Error {
  status: number;
}

export const errorHandler = (
  error: AplicationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status || 500).json({
    status: error.status || 500,
    name: error.name || 'Internal Server Error',
    message:
      error.message ||
      'The server has encountered a situation it does not know how to handle'
  });
};
