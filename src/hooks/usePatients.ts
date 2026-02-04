import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '@/services/patient.service';
import type { PatientFilters, CreatePatientData } from '@/types/api';
import { toast } from 'sonner';

// Get all patients with filters
export const usePatients = (filters?: PatientFilters) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getPatients(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single patient
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientService.getPatient(id),
    enabled: !!id,
  });
};

// Get patient statistics
export const usePatientStats = () => {
  return useQuery({
    queryKey: ['patients', 'stats'],
    queryFn: () => patientService.getPatientStats(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Create patient mutation
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePatientData) => patientService.createPatient(data),
    onSuccess: (patient) => {
      toast.success(`Patient ${patient.name} admitted successfully`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create patient');
    },
  });
};

// Update patient mutation
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientData> }) =>
      patientService.updatePatient(id, data),
    onSuccess: (patient) => {
      toast.success(`Patient ${patient.name} updated successfully`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update patient');
    },
  });
};

// Discharge patient mutation
export const useDischargePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.dischargePatient(id),
    onSuccess: (patient) => {
      toast.success(`Patient ${patient.name} discharged successfully`);
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to discharge patient');
    },
  });
};
