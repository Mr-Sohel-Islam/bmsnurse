import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationService } from '@/services/medication.service';
import type { CreateMedicationData } from '@/types/api';
import { toast } from 'sonner';

// Get patient medications
export const usePatientMedications = (patientId: string) => {
  return useQuery({
    queryKey: ['medications', 'patient', patientId],
    queryFn: () => medicationService.getPatientMedications(patientId),
    enabled: !!patientId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get due medications
export const useDueMedications = () => {
  return useQuery({
    queryKey: ['medications', 'due'],
    queryFn: () => medicationService.getDueMedications(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Create medication mutation (doctor/admin only)
export const useCreateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMedicationData) => medicationService.createMedication(data),
    onSuccess: (medication) => {
      toast.success(`Medication ${medication.name} prescribed successfully`);
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create medication');
    },
  });
};

// Administer medication mutation
export const useAdministerMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, scheduledTime, notes }: { id: string; scheduledTime: string; notes?: string }) =>
      medicationService.administerMedication(id, { scheduledTime, notes }),
    onSuccess: () => {
      toast.success('Medication administered successfully');
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to administer medication');
    },
  });
};

// Update medication mutation
export const useUpdateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMedicationData> }) =>
      medicationService.updateMedication(id, data),
    onSuccess: () => {
      toast.success('Medication updated successfully');
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update medication');
    },
  });
};

// Discontinue medication mutation (doctor/admin only)
export const useDiscontinueMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      medicationService.discontinueMedication(id, reason),
    onSuccess: () => {
      toast.success('Medication discontinued');
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to discontinue medication');
    },
  });
};
