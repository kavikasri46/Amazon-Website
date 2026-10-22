import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/apiResponse.js';
import { getDatabaseHealth } from '../../config/db.js';
import { env } from '../../config/env.js';

export class HealthController {
  static getHealth(_req: Request, res: Response): Response {
    const healthData = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      version: '1.0.0',
    };

    return ApiResponse.success(res, healthData, 'Application is live');
  }

  static async getReady(_req: Request, res: Response): Promise<Response> {
    const dbHealth = await getDatabaseHealth();
    const isDbReady = dbHealth.state === 'CONNECTED';

    const readyData = {
      status: isDbReady ? 'READY' : 'DEGRADED',
      database: dbHealth.state,
      dialect: dbHealth.dialect,
      databaseName: dbHealth.databaseName || 'aventra_dev',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      ...(dbHealth.error ? { error: dbHealth.error } : {}),
    };

    const statusCode = isDbReady ? 200 : 503;
    return res.status(statusCode).json({
      success: isDbReady,
      statusCode,
      message: isDbReady ? 'All application dependencies are ready' : 'Dependencies are not ready',
      data: readyData,
    });
  }
}
