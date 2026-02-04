import api from '@/lib/axios';
import type { ApiResponse, Bed, BedOccupancy } from '@/types/api';

export const bedService = {
  // Get all beds
  async getBeds(filters?: { 
    department?: string; 
    status?: string; 
    ward?: string;
    floor?: number;
  }): Promise<Bed[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<ApiResponse<Bed[]>>(`/beds?${params.toString()}`);
    return response.data.data;
  },

  // Get bed occupancy stats
  async getBedOccupancy(): Promise<BedOccupancy> {
    const response = await api.get<ApiResponse<BedOccupancy>>('/beds/occupancy');
    return response.data.data;
  },

  // Get single bed
  async getBed(id: string): Promise<Bed> {
    const response = await api.get<ApiResponse<Bed>>(`/beds/${id}`);
    return response.data.data;
  },

  // Create bed (admin only)
  async createBed(data: Partial<Bed>): Promise<Bed> {
    const response = await api.post<ApiResponse<Bed>>('/beds', data);
    return response.data.data;
  },

  // Update bed (admin only)
  async updateBed(id: string, data: Partial<Bed>): Promise<Bed> {
    const response = await api.put<ApiResponse<Bed>>(`/beds/${id}`, data);
    return response.data.data;
  },

  // Assign patient to bed
  async assignPatient(bedId: string, patientId: string): Promise<Bed> {
    const response = await api.put<ApiResponse<Bed>>(`/beds/${bedId}/assign`, { patientId });
    return response.data.data;
  },

  // Release bed
  async releaseBed(id: string): Promise<Bed> {
    const response = await api.put<ApiResponse<Bed>>(`/beds/${id}/release`);
    return response.data.data;
  },
};

export default bedService;
