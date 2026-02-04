import api from '@/lib/axios';
import type { ApiResponse, Vital, CreateVitalData, VitalTrend } from '@/types/api';

export const vitalService = {
  // Get patient vitals
  async getPatientVitals(patientId: string, limit?: number): Promise<Vital[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<ApiResponse<Vital[]>>(`/vitals/patient/${patientId}${params}`);
    return response.data.data;
  },

  // Get latest vital for patient
  async getLatestVital(patientId: string): Promise<Vital> {
    const response = await api.get<ApiResponse<Vital>>(`/vitals/patient/${patientId}/latest`);
    return response.data.data;
  },

  // Create vital reading
  async createVital(data: CreateVitalData): Promise<Vital> {
    const response = await api.post<ApiResponse<Vital>>('/vitals', data);
    return response.data.data;
  },

  // Get vital trends
  async getVitalTrends(patientId: string, days?: number): Promise<VitalTrend[]> {
    const params = days ? `?days=${days}` : '';
    const response = await api.get<ApiResponse<VitalTrend[]>>(`/vitals/patient/${patientId}/trends${params}`);
    return response.data.data;
  },
};

export default vitalService;
