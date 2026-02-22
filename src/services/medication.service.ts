import api from '@/lib/axios';
import type { Medication, CreateMedicationData } from '@/types/api';

export const medicationService = {
  // Get patient medications
  async getPatientMedications(patientId: string): Promise<Medication[]> {
    const response = await api.get(`/nurse/patients/${patientId}/prescriptions`);
    return response?.data?.data?.prescriptions || [];
  },

  // Get due medications
  async getDueMedications(): Promise<Medication[]> {
    return [];
  },

  // Create medication (doctor/admin only)
  async createMedication(data: CreateMedicationData): Promise<Medication> {
    throw new Error('Medication create API moved to pharmacy module and is not yet wired in frontend');
  },

  // Administer medication
  async administerMedication(
    id: string, 
    data: { scheduledTime: string; notes?: string }
  ): Promise<Medication> {
    throw new Error('Medication administration API moved to pharmacy module and is not yet wired in frontend');
  },

  // Update medication
  async updateMedication(id: string, data: Partial<CreateMedicationData>): Promise<Medication> {
    throw new Error('Medication update API moved to pharmacy module and is not yet wired in frontend');
  },

  // Discontinue medication (doctor/admin only)
  async discontinueMedication(id: string, reason?: string): Promise<Medication> {
    throw new Error('Medication discontinue API moved to pharmacy module and is not yet wired in frontend');
  },
};

export default medicationService;
