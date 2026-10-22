/**
 * Aventra Marketplace — Shared Domain Types & Contracts
 */

export type UserRole = 'customer' | 'seller' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  issue: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface HealthCheckData {
  status: 'UP' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
}

export interface ReadyCheckData {
  status: 'READY' | 'DEGRADED' | 'NOT_READY';
  database: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  dialect?: string;
  databaseName?: string;
  uptimeSeconds: number;
  timestamp: string;
  error?: string;
}
