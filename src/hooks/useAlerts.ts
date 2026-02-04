import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services/alert.service';
import type { CreateAlertData } from '@/types/api';
import { toast } from 'sonner';

// Get all alerts
export const useAlerts = (filters?: { severity?: string; isResolved?: boolean; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertService.getAlerts(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get my alerts
export const useMyAlerts = () => {
  return useQuery({
    queryKey: ['alerts', 'my'],
    queryFn: () => alertService.getMyAlerts(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Get alert counts
export const useAlertCounts = () => {
  return useQuery({
    queryKey: ['alerts', 'counts'],
    queryFn: () => alertService.getAlertCounts(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Create alert mutation
export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAlertData) => alertService.createAlert(data),
    onSuccess: () => {
      toast.success('Alert created successfully');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create alert');
    },
  });
};

// Acknowledge alert mutation
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertService.acknowledgeAlert(id),
    onSuccess: () => {
      toast.success('Alert acknowledged');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to acknowledge alert');
    },
  });
};

// Resolve alert mutation
export const useResolveAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertService.resolveAlert(id),
    onSuccess: () => {
      toast.success('Alert resolved');
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resolve alert');
    },
  });
};

// Dismiss alert mutation
export const useDismissAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertService.dismissAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to dismiss alert');
    },
  });
};
