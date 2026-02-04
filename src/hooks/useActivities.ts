import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';

// Get all activities
export const useActivities = (filters?: {
  action?: string;
  user?: string;
  patient?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => activityService.getActivities(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get recent activities
export const useRecentActivities = (limit?: number) => {
  return useQuery({
    queryKey: ['activities', 'recent', limit],
    queryFn: () => activityService.getRecentActivities(limit),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get my activities
export const useMyActivities = () => {
  return useQuery({
    queryKey: ['activities', 'my'],
    queryFn: () => activityService.getMyActivities(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get patient activities
export const usePatientActivities = (patientId: string) => {
  return useQuery({
    queryKey: ['activities', 'patient', patientId],
    queryFn: () => activityService.getPatientActivities(patientId),
    enabled: !!patientId,
    staleTime: 30 * 1000, // 30 seconds
  });
};
