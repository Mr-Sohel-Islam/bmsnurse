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
  const firstName = (apiPatient as any).firstName || '';
  const lastName = (apiPatient as any).lastName || '';
  const fullName = apiPatient.name || `${firstName} ${lastName}`.trim();
  const derivedAge = typeof apiPatient.age === 'number'
    ? apiPatient.age
    : (apiPatient as any).dateOfBirth
      ? Math.max(0, new Date().getFullYear() - new Date((apiPatient as any).dateOfBirth).getFullYear())
      : 0;
  const registrationType = ((apiPatient as any).registrationType || '').toString().toUpperCase();
  const mappedDepartment = apiPatient.department || registrationType || 'OPD';
  const attendingNurseName =
    (typeof apiPatient.attendingNurse === 'object' && apiPatient.attendingNurse
      ? ((apiPatient.attendingNurse as any).name
        || `${(apiPatient.attendingNurse as any).firstName || ''} ${(apiPatient.attendingNurse as any).lastName || ''}`.trim())
      : '')
    || (apiPatient as any).attendingNurseName
    || (typeof (apiPatient as any).primaryNurse === 'object'
      ? `${(apiPatient as any).primaryNurse?.firstName || ''} ${(apiPatient as any).primaryNurse?.lastName || ''}`.trim()
      : '')
    || (Array.isArray((apiPatient as any).assignedNurses) && (apiPatient as any).assignedNurses.length > 0
      ? `${(apiPatient as any).assignedNurses[0]?.firstName || ''} ${(apiPatient as any).assignedNurses[0]?.lastName || ''}`.trim()
      : '')
    || 'Unassigned';

  return {
    id: apiPatient.patientId || apiPatient._id,
    name: fullName || 'Unknown Patient',
    age: derivedAge,
    gender: capitalize(apiPatient.gender) as UIPatient['gender'],
    department: mappedDepartment === 'ICU' ? 'IPD' : mappedDepartment as UIPatient['department'],
    bedNumber: bedNumber || null,
    roomNumber: null,
    status: apiPatient.status === 'normal' ? 'normal'
      : apiPatient.status === 'warning' ? 'warning' 
      : apiPatient.status === 'critical' ? 'critical' 
      : 'stable',
    diagnosis: apiPatient.diagnosis || 'Not specified',
    admissionDate: apiPatient.admissionDate,
    attendingNurse: attendingNurseName,
    vitals: overrides?.vitals || defaultVitals,
    medications: overrides?.medications || [],
    notes: overrides?.notes || [],
    isInBed: Boolean(apiPatient.isInBed || (apiPatient as any).assignedBed || bedNumber),
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
