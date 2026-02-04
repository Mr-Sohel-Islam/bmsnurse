import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, ActivityLog } from '@/types/api';

export const activityService = {
  // Get all activities
  async getActivities(filters?: {
    action?: string;
    user?: string;
    patient?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ActivityLog>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<ActivityLog>>(`/activities?${params.toString()}`);
    return response.data;
  },

  // Get recent activities
  async getRecentActivities(limit?: number): Promise<ActivityLog[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<ApiResponse<ActivityLog[]>>(`/activities/recent${params}`);
    return response.data.data;
  },

  // Get my activities
  async getMyActivities(): Promise<ActivityLog[]> {
    const response = await api.get<ApiResponse<ActivityLog[]>>('/activities/my');
    return response.data.data;
  },

  // Get patient activities
  async getPatientActivities(patientId: string): Promise<ActivityLog[]> {
    const response = await api.get<ApiResponse<ActivityLog[]>>(`/activities/patient/${patientId}`);
    return response.data.data;
  },
};

export default activityService;
