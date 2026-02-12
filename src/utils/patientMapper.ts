import type { Patient as ApiPatient } from '@/types/api';
import type { Patient as UIPatient, VitalSigns } from '@/data/mockPatients';

// Default vitals when none are available from the API
const defaultVitals: VitalSigns = {
  heartRate: 0,
  bloodPressure: { systolic: 0, diastolic: 0 },
  oxygenSaturation: 0,
  temperature: 0,
  lastUpdated: new Date().toISOString(),
};

/**
 * Maps an API Patient to the UI Patient format used by components.
 * The API stores vitals/medications/notes separately, so defaults are used
 * unless overridden.
 */
export function mapApiPatientToUI(
  apiPatient: ApiPatient,
  overrides?: {
    vitals?: VitalSigns;
    medications?: string[];
    notes?: string[];
  }
): UIPatient {
  const bedRef = apiPatient.bed;
  const bedNumber = typeof bedRef === 'object' && bedRef ? bedRef.bedNumber : null;

  return {
    id: apiPatient.patientId || apiPatient._id,
    name: apiPatient.name,
    age: apiPatient.age,
    gender: capitalize(apiPatient.gender) as UIPatient['gender'],
    department: apiPatient.department === 'ICU' ? 'IPD' : apiPatient.department as UIPatient['department'],
    bedNumber: bedNumber || null,
    roomNumber: null,
    status: apiPatient.status === 'normal' ? 'normal' 
      : apiPatient.status === 'warning' ? 'warning' 
      : apiPatient.status === 'critical' ? 'critical' 
      : 'stable',
    diagnosis: apiPatient.diagnosis || 'Not specified',
    admissionDate: apiPatient.admissionDate,
    attendingNurse: typeof apiPatient.attendingNurse === 'object' && apiPatient.attendingNurse
      ? (apiPatient.attendingNurse as any).name
      : 'Unassigned',
    vitals: overrides?.vitals || defaultVitals,
    medications: overrides?.medications || [],
    notes: overrides?.notes || [],
    isInBed: apiPatient.isInBed,
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
