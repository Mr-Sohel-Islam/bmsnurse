import api from '@/lib/axios';
import type { ApiResponse, StaffMember, StaffStats } from '@/types/api';

export const staffService = {
  // Get all staff
  async getStaff(filters?: {
    role?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<StaffMember[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<ApiResponse<StaffMember[]>>(`/staff?${params.toString()}`);
    return response.data.data;
  },

  // Get nurses
  async getNurses(): Promise<StaffMember[]> {
    const response = await api.get<ApiResponse<StaffMember[]>>('/staff/nurses');
    return response.data.data;
  },

  // Get doctors
  async getDoctors(): Promise<StaffMember[]> {
    const response = await api.get<ApiResponse<StaffMember[]>>('/staff/doctors');
    return response.data.data;
  },

  // Get staff member
  async getStaffMember(id: string): Promise<StaffMember> {
    const response = await api.get<ApiResponse<StaffMember>>(`/staff/${id}`);
    return response.data.data;
  },

  // Update staff (admin only)
  async updateStaff(id: string, data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await api.put<ApiResponse<StaffMember>>(`/staff/${id}`, data);
    return response.data.data;
  },

  // Deactivate staff (admin only)
  async deactivateStaff(id: string): Promise<StaffMember> {
    const response = await api.put<ApiResponse<StaffMember>>(`/staff/${id}/deactivate`);
    return response.data.data;
  },

  // Get staff statistics
  async getStaffStats(): Promise<StaffStats> {
    const response = await api.get<ApiResponse<StaffStats>>('/staff/stats');
    return response.data.data;
  },
};

export default staffService;
