import api from '@/lib/axios';
import type { 
  PaginatedResponse, 
  Patient, 
  CreatePatientData, 
  PatientFilters,
  PatientStats 
} from '@/types/api';
import { extractData, extractList, extractPaginated } from './apiAdapter';

const toPatient = (raw: any): Patient => {
  const firstName = raw?.firstName || '';
  const lastName = raw?.lastName || '';
  const name = raw?.name || `${firstName} ${lastName}`.trim();
  const age =
    typeof raw?.age === 'number'
      ? raw.age
      : raw?.dateOfBirth
        ? Math.max(0, new Date().getFullYear() - new Date(raw.dateOfBirth).getFullYear())
        : undefined;

  return {
    ...raw,
    name,
    age,
    gender: (raw?.gender || 'other').toLowerCase(),
    admissionDate: raw?.admissionDate || raw?.createdAt || new Date().toISOString(),
    department: raw?.department || raw?.registrationType?.toUpperCase() || 'OPD',
  };
};

export const patientService = {
  // Get all patients with filters
  async getPatients(filters?: PatientFilters): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await api.get(`/patients?${params.toString()}`);
    const paginated = extractPaginated<any>(response.data, 'patients');
    return {
      ...paginated,
      data: paginated.data.map(toPatient),
    };
  },

  // Get single patient
  async getPatient(id: string): Promise<Patient> {
    const response = await api.get(`/patients/${id}`);
    return toPatient(extractData<any>(response.data, 'patient'));
  },

  // Create patient
  async createPatient(data: CreatePatientData): Promise<Patient> {
    const [firstName, ...rest] = String(data.name || '').trim().split(' ');
    const lastName = rest.join(' ') || '-';

    const payload = {
      firstName,
      lastName,
      dateOfBirth: data.dateOfBirth || new Date().toISOString().slice(0, 10),
      gender: data.gender,
      phone: data.phone || 'N/A',
      email: data.email,
      address: data.address,
      emergencyContact: data.emergencyContact,
      registrationType: data.department?.toLowerCase() || 'opd',
      diagnosis: data.diagnosis,
    };

    const response = await api.post('/patients', payload);
    return toPatient(extractData<any>(response.data, 'patient'));
  },

  // Update patient
  async updatePatient(id: string, data: Partial<CreatePatientData>): Promise<Patient> {
    const payload: Record<string, unknown> = { ...data };
    if (data.name) {
      const [firstName, ...rest] = data.name.trim().split(' ');
      payload.firstName = firstName;
      payload.lastName = rest.join(' ') || '-';
      delete payload.name;
    }
    const response = await api.put(`/patients/${id}`, payload);
    return toPatient(extractData<any>(response.data, 'patient'));
  },

  // Discharge patient
  async dischargePatient(id: string): Promise<Patient> {
    const response = await api.put(`/patients/${id}`, {
      status: 'discharged',
      admissionStatus: 'DISCHARGED',
    });
    return toPatient(extractData<any>(response.data, 'patient'));
  },

  // Get patient statistics
  async getPatientStats(): Promise<PatientStats> {
    // Backend currently does not expose /patients/stats route; derive from list.
    const response = await api.get('/patients?limit=200');
    const patients = extractList<any>(response.data, 'patients').map(toPatient);

    const byDepartment: Record<string, number> = {};
    let critical = 0;
    let inBed = 0;
    let admitted = 0;

    patients.forEach((patient) => {
      const department = patient.department || 'Unknown';
      byDepartment[department] = (byDepartment[department] || 0) + 1;
      if (patient.status === 'critical') critical += 1;
      if (patient.isInBed || patient.bed) inBed += 1;
      if (patient.status === 'admitted') admitted += 1;
    });

    return {
      total: patients.length,
      critical,
      inBed,
      admitted,
      byDepartment,
    };
  },
};

export default patientService;
