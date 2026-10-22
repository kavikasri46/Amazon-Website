import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { globalRateLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { ApiError } from './utils/apiError.js';

export const createApp = (): Application => {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // 2. CORS Allowlisting
  app.use(
    cors({
      origin: [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Request Parsers & Cookie Handling
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 4. Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // 5. Global Rate Limiting
  app.use(globalRateLimiter);

  // 6. API Route Mounting
  app.use(env.API_PREFIX, healthRoutes);

  // Root welcome route
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Aventra E-Commerce API',
      version: '1.0.0',
      status: 'ONLINE',
      documentation: '/docs',
      healthCheck: `${env.API_PREFIX}/health`,
      readyCheck: `${env.API_PREFIX}/ready`,
    });
  });

  // 7. 404 Route Catch-all
  app.use((req: Request, _res: Response, next) => {
    next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
  });

  // 8. Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
