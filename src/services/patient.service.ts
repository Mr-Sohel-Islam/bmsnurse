import api from '@/lib/axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Patient, 
  CreatePatientData, 
  PatientFilters,
  PatientStats 
} from '@/types/api';

export const patientService = {
  // Get all patients with filters
  async getPatients(filters?: PatientFilters): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<Patient>>(`/patients?${params.toString()}`);
    return response.data;
  },

  // Get single patient
  async getPatient(id: string): Promise<Patient> {
    const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  // Create patient
  async createPatient(data: CreatePatientData): Promise<Patient> {
    const response = await api.post<ApiResponse<Patient>>('/patients', data);
    return response.data.data;
  },

  // Update patient
  async updatePatient(id: string, data: Partial<CreatePatientData>): Promise<Patient> {
    const response = await api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  },

  // Discharge patient
  async dischargePatient(id: string): Promise<Patient> {
    const response = await api.put<ApiResponse<Patient>>(`/patients/${id}/discharge`);
    return response.data.data;
  },

  // Get patient statistics
  async getPatientStats(): Promise<PatientStats> {
    const response = await api.get<ApiResponse<PatientStats>>('/patients/stats');
    return response.data.data;
  },
};

export default patientService;
