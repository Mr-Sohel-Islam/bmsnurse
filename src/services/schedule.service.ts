import api from '@/lib/axios';
import type { ApiResponse, Schedule, CreateScheduleData, WeeklySchedule } from '@/types/api';

export const scheduleService = {
  // Get all schedules
  async getSchedules(filters?: {
    staff?: string;
    department?: string;
    date?: string;
    shift?: string;
  }): Promise<Schedule[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get<ApiResponse<Schedule[]>>(`/schedules?${params.toString()}`);
    return response.data.data;
  },

  // Get my schedule
  async getMySchedule(): Promise<Schedule[]> {
    const response = await api.get<ApiResponse<Schedule[]>>('/schedules/my');
    return response.data.data;
  },

  // Get weekly schedule
  async getWeeklySchedule(weekStart?: string): Promise<WeeklySchedule> {
    const params = weekStart ? `?weekStart=${weekStart}` : '';
    const response = await api.get<ApiResponse<WeeklySchedule>>(`/schedules/weekly${params}`);
    return response.data.data;
  },

  // Create schedule (admin only)
  async createSchedule(data: CreateScheduleData): Promise<Schedule> {
    const response = await api.post<ApiResponse<Schedule>>('/schedules', data);
    return response.data.data;
  },

  // Bulk create schedules (admin only)
  async bulkCreateSchedule(schedules: CreateScheduleData[]): Promise<Schedule[]> {
    const response = await api.post<ApiResponse<Schedule[]>>('/schedules/bulk', { schedules });
    return response.data.data;
  },

  // Update schedule (admin only)
  async updateSchedule(id: string, data: Partial<CreateScheduleData>): Promise<Schedule> {
    const response = await api.put<ApiResponse<Schedule>>(`/schedules/${id}`, data);
    return response.data.data;
  },

  // Delete schedule (admin only)
  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },
};

export default scheduleService;
