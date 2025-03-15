import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new AppError(
      404,
      `Route ${req.method} ${req.path} not found`,
      'NOT_FOUND'
    )
  );
}; 