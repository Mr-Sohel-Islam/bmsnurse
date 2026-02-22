import api from '@/lib/axios';
import type { Bed, BedOccupancy } from '@/types/api';
import { extractData, extractPaginated } from './apiAdapter';

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
    
    const response = await api.get(`/beds?${params.toString()}`);
    return extractPaginated<Bed>(response.data, 'beds').data;
  },

  // Get bed occupancy stats
  async getBedOccupancy(): Promise<BedOccupancy> {
    const response = await api.get('/beds/stats');
    const data = extractData<any>(response.data);
    return {
      total: data.total || 0,
      occupied: data.occupied || 0,
      available: data.available || 0,
      maintenance: data.maintenance || 0,
      reserved: data.reserved || 0,
      occupancyRate: Number(data.occupancyRate || 0),
      byDepartment: data.byWard || {},
    };
  },

  // Get single bed
  async getBed(id: string): Promise<Bed> {
    const response = await api.get(`/beds/${id}`);
    return extractData<Bed>(response.data, 'bed');
  },

  // Create bed (admin only)
  async createBed(data: Partial<Bed>): Promise<Bed> {
    const response = await api.post('/beds', data);
    return extractData<Bed>(response.data, 'bed');
  },

  // Update bed (admin only)
  async updateBed(id: string, data: Partial<Bed>): Promise<Bed> {
    const response = await api.put(`/beds/${id}`, data);
    return extractData<Bed>(response.data, 'bed');
  },

  // Assign patient to bed
  async assignPatient(bedId: string, patientId: string): Promise<Bed> {
    const response = await api.post(`/beds/${bedId}/assign`, { patientId });
    return extractData<Bed>(response.data, 'bed');
  },

  // Release bed
  async releaseBed(id: string): Promise<Bed> {
    const response = await api.post(`/beds/${id}/release`);
    return extractData<Bed>(response.data, 'bed');
  },
};

export default bedService;
