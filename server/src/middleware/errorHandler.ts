import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
}

// Centralized error handler — catches anything passed via next(err)
const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  // next must be declared even if unused — Express requires 4-arg signature
  _next: NextFunction
): void => {
  console.error(err.stack);
  const status = err.status ?? 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
