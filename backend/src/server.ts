import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    // 1. Establish Database Connection
    await connectDatabase();

    // 2. Initialize Express Application
    const app = createApp();
    const server = http.createServer(app);

    // 3. Start Listening
    server.listen(env.PORT, () => {
      logger.info(`🚀 Aventra Server is listening on http://localhost:${env.PORT}`);
      logger.info(`🩺 Health Check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
      logger.info(`🔌 Readiness Check: http://localhost:${env.PORT}${env.API_PREFIX}/ready`);
    });

    // 4. Graceful Shutdown Signal Handlers
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force exit after 10s timeout
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection detected:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception caught:', error);
      shutdown('uncaughtException');
    });
  } catch (error) {
    logger.error('Fatal initialization error:', error);
    process.exit(1);
  }
};

startServer();
