import api from '@/lib/axios';
import type { StaffMember, StaffStats } from '@/types/api';
import { extractData, extractList, extractPaginated } from './apiAdapter';

const toStaff = (user: any): StaffMember => ({
  ...user,
  _id: user?._id || user?.id,
  id: user?.id || user?._id,
  name: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
});

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
    
    const response = await api.get(`/users?${params.toString()}`);
    return extractPaginated<any>(response.data, 'users').data.map(toStaff);
  },

  // Get nurses
  async getNurses(): Promise<StaffMember[]> {
    const response = await api.get('/users/nurses');
    return extractList<any>(response.data, 'users').map(toStaff);
  },

  // Get doctors
  async getDoctors(): Promise<StaffMember[]> {
    const response = await api.get('/users?role=doctor&limit=200');
    return extractPaginated<any>(response.data, 'users').data.map(toStaff);
  },

  // Get staff member
  async getStaffMember(id: string): Promise<StaffMember> {
    const response = await api.get(`/users/${id}`);
    return toStaff(extractData<any>(response.data, 'user'));
  },

  // Update staff (admin only)
  async updateStaff(id: string, data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await api.put(`/users/${id}`, data);
    return toStaff(extractData<any>(response.data, 'user'));
  },

  // Deactivate staff (admin only)
  async deactivateStaff(id: string): Promise<StaffMember> {
    await api.delete(`/users/${id}`);
    const response = await api.get(`/users/${id}`);
    return toStaff(extractData<any>(response.data, 'user'));
  },

  // Get staff statistics
  async getStaffStats(): Promise<StaffStats> {
    const response = await api.get('/users?limit=500');
    const users = extractPaginated<any>(response.data, 'users').data.map(toStaff);
    const byRole: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    let active = 0;

    users.forEach((user) => {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
      const dept = user.department || 'Unknown';
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
      if (user.isActive) active += 1;
    });

    const stats: StaffStats = {
      total: users.length,
      active,
      byRole,
      byDepartment,
    };
    return stats;
  },
};

export default staffService;
