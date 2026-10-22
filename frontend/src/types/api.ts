export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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

export interface HealthData {
  status: 'UP' | 'DOWN';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
}

export interface ReadyData {
  status: 'READY' | 'DEGRADED' | 'NOT_READY';
  database: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  dialect?: string;
  databaseHost?: string;
  databaseName?: string;
  uptimeSeconds: number;
  timestamp: string;
  error?: string;
}
