import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@/services/staff.service';
import type { StaffMember } from '@/types/api';
import { toast } from 'sonner';

// Get all staff
export const useStaff = (filters?: { role?: string; department?: string; isActive?: boolean }) => {
  return useQuery({
    queryKey: ['staff', filters],
    queryFn: () => staffService.getStaff(filters),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get nurses
export const useNurses = () => {
  return useQuery({
    queryKey: ['staff', 'nurses'],
    queryFn: () => staffService.getNurses(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get doctors
export const useDoctors = () => {
  return useQuery({
    queryKey: ['staff', 'doctors'],
    queryFn: () => staffService.getDoctors(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get staff member
export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffService.getStaffMember(id),
    enabled: !!id,
  });
};

// Get staff statistics
export const useStaffStats = () => {
  return useQuery({
    queryKey: ['staff', 'stats'],
    queryFn: () => staffService.getStaffStats(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Update staff mutation (admin only)
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffMember> }) => staffService.updateStaff(id, data),
    onSuccess: (staff) => {
      toast.success(`Staff member ${staff.name} updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff member');
    },
  });
};

// Deactivate staff mutation (admin only)
export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffService.deactivateStaff(id),
    onSuccess: (staff) => {
      toast.success(`Staff member ${staff.name} deactivated`);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to deactivate staff member');
    },
  });
};
