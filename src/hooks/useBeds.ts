import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bedService } from '@/services/bed.service';
import type { Bed } from '@/types/api';
import { toast } from 'sonner';

// Get all beds
export const useBeds = (filters?: { department?: string; status?: string; ward?: string; floor?: number }) => {
  return useQuery({
    queryKey: ['beds', filters],
    queryFn: () => bedService.getBeds(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get bed occupancy
export const useBedOccupancy = () => {
  return useQuery({
    queryKey: ['beds', 'occupancy'],
    queryFn: () => bedService.getBedOccupancy(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get single bed
export const useBed = (id: string) => {
  return useQuery({
    queryKey: ['beds', id],
    queryFn: () => bedService.getBed(id),
    enabled: !!id,
  });
};

// Create bed mutation (admin only)
export const useCreateBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Bed>) => bedService.createBed(data),
    onSuccess: (bed) => {
      toast.success(`Bed ${bed.bedNumber} created successfully`);
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create bed');
    },
  });
};

// Update bed mutation (admin only)
export const useUpdateBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bed> }) => bedService.updateBed(id, data),
    onSuccess: (bed) => {
      toast.success(`Bed ${bed.bedNumber} updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update bed');
    },
  });
};

// Assign patient to bed
export const useAssignPatientToBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bedId, patientId }: { bedId: string; patientId: string }) =>
      bedService.assignPatient(bedId, patientId),
    onSuccess: (bed) => {
      toast.success(`Patient assigned to bed ${bed.bedNumber}`);
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign patient to bed');
    },
  });
};

// Release bed
export const useReleaseBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bedService.releaseBed(id),
    onSuccess: (bed) => {
      toast.success(`Bed ${bed.bedNumber} released`);
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to release bed');
    },
  });
};
