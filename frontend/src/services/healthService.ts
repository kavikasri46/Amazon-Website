import { apiClient } from './apiClient';
import { ApiResponse, HealthData, ReadyData } from '../types/api';

export const healthService = {
  async getHealth(): Promise<HealthData> {
    const res = await apiClient.get<ApiResponse<HealthData>>('/health');
    return res.data.data;
  },

  async getReady(): Promise<ReadyData> {
    const res = await apiClient.get<ApiResponse<ReadyData>>('/ready');
    return res.data.data;
  },
};
