import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/services/schedule.service';
import type { CreateScheduleData } from '@/types/api';
import { toast } from 'sonner';

// Get all schedules
export const useSchedules = (filters?: { staff?: string; department?: string; date?: string; shift?: string }) => {
  return useQuery({
    queryKey: ['schedules', filters],
    queryFn: () => scheduleService.getSchedules(filters),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get my schedule
export const useMySchedule = () => {
  return useQuery({
    queryKey: ['schedules', 'my'],
    queryFn: () => scheduleService.getMySchedule(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get weekly schedule
export const useWeeklySchedule = (weekStart?: string) => {
  return useQuery({
    queryKey: ['schedules', 'weekly', weekStart],
    queryFn: () => scheduleService.getWeeklySchedule(weekStart),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Create schedule mutation (admin only)
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleData) => scheduleService.createSchedule(data),
    onSuccess: () => {
      toast.success('Schedule created successfully');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create schedule');
    },
  });
};

// Bulk create schedules mutation (admin only)
export const useBulkCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedules: CreateScheduleData[]) => scheduleService.bulkCreateSchedule(schedules),
    onSuccess: (data) => {
      toast.success(`${data.length} schedules created successfully`);
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create schedules');
    },
  });
};

// Update schedule mutation (admin only)
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateScheduleData> }) =>
      scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      toast.success('Schedule updated successfully');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update schedule');
    },
  });
};

// Delete schedule mutation (admin only)
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleService.deleteSchedule(id),
    onSuccess: () => {
      toast.success('Schedule deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete schedule');
    },
  });
};
