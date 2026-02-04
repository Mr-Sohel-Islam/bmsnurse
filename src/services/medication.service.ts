import api from '@/lib/axios';
import type { ApiResponse, Medication, CreateMedicationData } from '@/types/api';

export const medicationService = {
  // Get patient medications
  async getPatientMedications(patientId: string): Promise<Medication[]> {
    const response = await api.get<ApiResponse<Medication[]>>(`/medications/patient/${patientId}`);
    return response.data.data;
  },

  // Get due medications
  async getDueMedications(): Promise<Medication[]> {
    const response = await api.get<ApiResponse<Medication[]>>('/medications/due');
    return response.data.data;
  },

  // Create medication (doctor/admin only)
  async createMedication(data: CreateMedicationData): Promise<Medication> {
    const response = await api.post<ApiResponse<Medication>>('/medications', data);
    return response.data.data;
  },

  // Administer medication
  async administerMedication(
    id: string, 
    data: { scheduledTime: string; notes?: string }
  ): Promise<Medication> {
    const response = await api.post<ApiResponse<Medication>>(`/medications/${id}/administer`, data);
    return response.data.data;
  },

  // Update medication
  async updateMedication(id: string, data: Partial<CreateMedicationData>): Promise<Medication> {
    const response = await api.put<ApiResponse<Medication>>(`/medications/${id}`, data);
    return response.data.data;
  },

  // Discontinue medication (doctor/admin only)
  async discontinueMedication(id: string, reason?: string): Promise<Medication> {
    const response = await api.put<ApiResponse<Medication>>(`/medications/${id}/discontinue`, { reason });
    return response.data.data;
  },
};

export default medicationService;
