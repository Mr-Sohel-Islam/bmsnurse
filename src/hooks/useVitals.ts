import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalService } from '@/services/vital.service';
import type { CreateVitalData } from '@/types/api';
import { toast } from 'sonner';

// Get patient vitals
export const usePatientVitals = (patientId: string, limit?: number) => {
  return useQuery({
    queryKey: ['vitals', patientId, limit],
    queryFn: () => vitalService.getPatientVitals(patientId, limit),
    enabled: !!patientId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get latest vital
export const useLatestVital = (patientId: string) => {
  return useQuery({
    queryKey: ['vitals', patientId, 'latest'],
    queryFn: () => vitalService.getLatestVital(patientId),
    enabled: !!patientId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get vital trends
export const useVitalTrends = (patientId: string, days?: number) => {
  return useQuery({
    queryKey: ['vitals', patientId, 'trends', days],
    queryFn: () => vitalService.getVitalTrends(patientId, days),
    enabled: !!patientId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Create vital mutation
export const useCreateVital = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVitalData) => vitalService.createVital(data),
    onSuccess: (vital) => {
      toast.success('Vital signs recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['vitals', vital.patient] });
      
      if (vital.isAbnormal) {
        toast.warning(`Abnormal readings detected: ${vital.abnormalReadings.join(', ')}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record vital signs');
    },
  });
};
