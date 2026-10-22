import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Necessary for HTTP-only refresh token cookies
});

// Request Interceptor: Attach bearer token if present in localStorage or memory
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('aventra_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract standard API errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data?.error) {
      const serverError = error.response.data.error;
      console.warn(`[API Error ${error.response.status}] [${serverError.code}]: ${serverError.message}`);
    } else if (error.code === 'ECONNABORTED') {
      console.error('[API Error]: Request timed out');
    } else if (!error.response) {
      console.error('[API Error]: Network error or server is unreachable');
    }
    return Promise.reject(error);
  }
);
