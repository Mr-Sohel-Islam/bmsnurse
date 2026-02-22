import api from '@/lib/axios';
import type { ApiResponse, Vital, CreateVitalData, VitalTrend } from '@/types/api';
import { extractData } from './apiAdapter';

export const vitalService = {
  // Get patient vitals
  async getPatientVitals(patientId: string, limit?: number): Promise<Vital[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<ApiResponse<Vital[]>>(`/vitals/patient/${patientId}${params}`);
    return extractData<Vital[]>(response.data);
  },

  // Get latest vital for patient
  async getLatestVital(patientId: string): Promise<Vital> {
    const response = await api.get<ApiResponse<Vital>>(`/vitals/patient/${patientId}/latest`);
    return extractData<Vital>(response.data);
  },

  // Create vital reading
  async createVital(data: CreateVitalData): Promise<Vital> {
    const response = await api.post<ApiResponse<Vital>>('/vitals', data);
    return extractData<Vital>(response.data);
  },

  // Get vital trends
  async getVitalTrends(patientId: string, days?: number): Promise<VitalTrend[]> {
    const hours = days ? days * 24 : undefined;
    const params = hours ? `?hours=${hours}` : '';
    const response = await api.get<ApiResponse<VitalTrend[]>>(`/vitals/patient/${patientId}/trends${params}`);
    return extractData<VitalTrend[]>(response.data);
  },
};

export default vitalService;
