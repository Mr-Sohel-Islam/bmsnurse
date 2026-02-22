import type { Schedule, CreateScheduleData, WeeklySchedule } from '@/types/api';

export const scheduleService = {
  // Get all schedules
  async getSchedules(filters?: {
    staff?: string;
    department?: string;
    date?: string;
    shift?: string;
  }): Promise<Schedule[]> {
    // Dedicated schedules module is not available in current backend contract.
    return [];
  },

  // Get my schedule
  async getMySchedule(): Promise<Schedule[]> {
    return [];
  },

  // Get weekly schedule
  async getWeeklySchedule(weekStart?: string): Promise<WeeklySchedule> {
    return {
      week: weekStart || new Date().toISOString().slice(0, 10),
      schedules: [],
      staffList: [],
    };
  },

  // Create schedule (admin only)
  async createSchedule(data: CreateScheduleData): Promise<Schedule> {
    throw new Error('Schedule API is not available in current backend');
  },

  // Bulk create schedules (admin only)
  async bulkCreateSchedule(schedules: CreateScheduleData[]): Promise<Schedule[]> {
    throw new Error('Bulk schedule API is not available in current backend');
  },

  // Update schedule (admin only)
  async updateSchedule(id: string, data: Partial<CreateScheduleData>): Promise<Schedule> {
    throw new Error('Schedule API is not available in current backend');
  },

  // Delete schedule (admin only)
  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },
};

export default scheduleService;
