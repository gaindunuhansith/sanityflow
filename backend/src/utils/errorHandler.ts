import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/index.js';
import env from '../config/env.js';
import Logger from './logger.js';
import { Sentry } from '../config/sentry.js';

export class AppError extends Error {
  readonly status: number;
  readonly isOperational = true;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

function send(res: Response, status: number, message: string, details?: unknown, stack?: string): void {
  res.status(status).json({
    success: false,
    status,
    message,
    ...(details !== undefined && { details }),
    ...(env.NODE_ENV === 'development' && stack && { stack }),
  });
}

interface MongooseCastError extends Error { name: 'CastError'; kind: string }
interface MongooseValidationError extends Error { name: 'ValidationError'; errors: Record<string, { message: string }> }
interface MongooseDuplicateKeyError extends Error { code: 11000; keyValue: Record<string, unknown> }

const isCastError = (e: Error): e is MongooseCastError =>
  e.name === 'CastError' && (e as MongooseCastError).kind === 'ObjectId';

const isValidationError = (e: Error): e is MongooseValidationError =>
  e.name === 'ValidationError';

const isDuplicateKeyError = (e: Error): e is MongooseDuplicateKeyError =>
  (e as MongooseDuplicateKeyError).code === 11000;

const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  const ctx = `${req.method} ${req.originalUrl}`;

  if (err instanceof ZodError) {
    const details = err.issues.map((e) => ({
      field: e.path.join('.') || 'body',
      message: e.message,
    }));
    Logger.warn(`[400] Validation failed — ${ctx}`);
    send(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', details, err.stack);
    return;
  }

  if (isCastError(err)) {
    Logger.warn(`[400] Invalid ID format — ${ctx}`);
    send(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID format', undefined, err.stack);
    return;
  }

  if (isValidationError(err)) {
    const details = Object.values(err.errors).map((e) => e.message);
    Logger.warn(`[400] Mongoose validation failed — ${ctx}`);
    send(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', details, err.stack);
    return;
  }

  if (isDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    Logger.warn(`[409] Duplicate key: ${field} — ${ctx}`);
    send(res, HTTP_STATUS.CONFLICT, `${field} already exists`, undefined, err.stack);
    return;
  }

  if (err instanceof AppError) {
    Logger.warn(`[${err.status}] ${err.message} — ${ctx}`);
    send(res, err.status, err.message, undefined, err.stack);
    return;
  }

  Logger.error(`[500] Unhandled error — ${ctx}\n${err.stack ?? err.message}`);
  Sentry.captureException(err);
  send(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    undefined,
    err.stack,
  );
};

export default errorHandler;
