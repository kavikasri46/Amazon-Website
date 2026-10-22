import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // 1. Handled Operational ApiErrors
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error(`Operational 500 Error: ${err.message}`, err.stack);
    }
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // 2. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      issue: e.message,
    }));

    return res.status(422).json({
      success: false,
      statusCode: 422,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data provided',
        details: formattedDetails,
      },
    });
  }

  // 3. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return res.status(409).json({
        success: false,
        statusCode: 409,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: `A record with this ${target} already exists`,
        },
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'The requested record does not exist or has been deleted',
        },
      });
    }
  }

  // 5. Unhandled / Unexpected Errors
  logger.error('Unhandled Server Exception:', err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message,
      ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    },
  });
};
