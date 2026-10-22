import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: Record<string, unknown>
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully',
    meta?: Record<string, unknown>
  ): Response {
    return this.success(res, data, message, 201, meta);
  }
}
