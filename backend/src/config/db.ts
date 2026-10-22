import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

interface DatabaseHealth {
  state: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  dialect: 'PostgreSQL';
  databaseName?: string;
  error?: string;
}

let isDbConnected = false;

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info('🔌 Connecting to PostgreSQL database via Prisma...');
    await prisma.$connect();
    // Test connectivity
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    logger.info('✅ PostgreSQL database connection established successfully');
  } catch (error) {
    isDbConnected = false;
    logger.error('❌ Failed to connect to PostgreSQL database:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const getDatabaseHealth = async (): Promise<DatabaseHealth> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbConnected = true;
    return {
      state: 'CONNECTED',
      dialect: 'PostgreSQL',
      databaseName: 'aventra_dev',
    };
  } catch (err: unknown) {
    isDbConnected = false;
    return {
      state: 'DISCONNECTED',
      dialect: 'PostgreSQL',
      error: err instanceof Error ? err.message : 'Database ping failed',
    };
  }
};

export const getCachedDatabaseHealth = (): DatabaseHealth => {
  return {
    state: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
    dialect: 'PostgreSQL',
    databaseName: 'aventra_dev',
  };
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    isDbConnected = false;
    logger.info('🛑 PostgreSQL connection closed cleanly');
  } catch (error) {
    logger.error('Error disconnecting from PostgreSQL:', error);
  }
};
