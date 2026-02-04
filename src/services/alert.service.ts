import api from '@/lib/axios';
import type { ApiResponse, PaginatedResponse, Alert, CreateAlertData, AlertCounts } from '@/types/api';

export const alertService = {
  // Get all alerts
  async getAlerts(filters?: { 
    severity?: string; 
    isResolved?: boolean; 
    page?: number; 
    limit?: number 
  }): Promise<PaginatedResponse<Alert>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<Alert>>(`/alerts?${params.toString()}`);
    return response.data;
  },

  // Get my alerts
  async getMyAlerts(): Promise<Alert[]> {
    const response = await api.get<ApiResponse<Alert[]>>('/alerts/my');
    return response.data.data;
  },

  // Get alert counts
  async getAlertCounts(): Promise<AlertCounts> {
    const response = await api.get<ApiResponse<AlertCounts>>('/alerts/counts');
    return response.data.data;
  },

  // Create alert
  async createAlert(data: CreateAlertData): Promise<Alert> {
    const response = await api.post<ApiResponse<Alert>>('/alerts', data);
    return response.data.data;
  },

  // Acknowledge alert
  async acknowledgeAlert(id: string): Promise<Alert> {
    const response = await api.put<ApiResponse<Alert>>(`/alerts/${id}/acknowledge`);
    return response.data.data;
  },

  // Resolve alert
  async resolveAlert(id: string): Promise<Alert> {
    const response = await api.put<ApiResponse<Alert>>(`/alerts/${id}/resolve`);
    return response.data.data;
  },

  // Dismiss alert
  async dismissAlert(id: string): Promise<Alert> {
    const response = await api.put<ApiResponse<Alert>>(`/alerts/${id}/dismiss`);
    return response.data.data;
  },
};

export default alertService;
