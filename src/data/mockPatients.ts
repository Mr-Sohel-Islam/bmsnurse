export type PatientStatus = 'critical' | 'warning' | 'stable' | 'normal';
export type Department = 'OPD' | 'IPD' | 'Emergency';

export interface VitalSigns {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
  lastUpdated: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: Department;
  bedNumber: string | null;
  roomNumber: string | null;
  status: PatientStatus;
  diagnosis: string;
  admissionDate: string;
  attendingNurse: string;
  vitals: VitalSigns;
  medications: string[];
  notes: string[];
  isInBed: boolean;
}

export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    department: 'IPD',
    bedNumber: 'B-101',
    roomNumber: 'R-10',
    status: 'critical',
    diagnosis: 'Acute Myocardial Infarction',
    admissionDate: '2026-01-20',
    attendingNurse: 'Sarah Johnson',
    vitals: {
      heartRate: 112,
      bloodPressure: { systolic: 165, diastolic: 98 },
      oxygenSaturation: 89,
      temperature: 38.2,
      lastUpdated: '2026-01-22T08:30:00',
    },
    medications: ['Aspirin 81mg', 'Metoprolol 25mg', 'Nitroglycerin PRN'],
    notes: ['Monitor cardiac rhythm continuously', 'NPO until further notice'],
    isInBed: true,
  },
  {
    id: 'P002',
    name: 'Mary Williams',
    age: 45,
    gender: 'Female',
    department: 'IPD',
    bedNumber: 'B-102',
    roomNumber: 'R-10',
    status: 'stable',
    diagnosis: 'Post-operative recovery (Appendectomy)',
    admissionDate: '2026-01-21',
    attendingNurse: 'Michael Chen',
    vitals: {
      heartRate: 78,
      bloodPressure: { systolic: 120, diastolic: 80 },
      oxygenSaturation: 98,
      temperature: 37.0,
      lastUpdated: '2026-01-22T08:15:00',
    },
    medications: ['Acetaminophen 500mg PRN', 'Ondansetron 4mg PRN'],
    notes: ['Ambulate 3x daily', 'Clear liquids diet'],
    isInBed: true,
  },
  {
    id: 'P003',
    name: 'Robert Davis',
    age: 72,
    gender: 'Male',
    department: 'Emergency',
    bedNumber: 'ER-3',
    roomNumber: null,
    status: 'critical',
    diagnosis: 'Severe Pneumonia',
    admissionDate: '2026-01-22',
    attendingNurse: 'Emily Rodriguez',
    vitals: {
      heartRate: 105,
      bloodPressure: { systolic: 90, diastolic: 60 },
      oxygenSaturation: 85,
      temperature: 39.5,
      lastUpdated: '2026-01-22T08:45:00',
    },
    medications: ['Ceftriaxone 1g IV', 'Azithromycin 500mg IV', 'Oxygen 4L NC'],
    notes: ['Respiratory isolation', 'Prepare for possible intubation'],
    isInBed: true,
  },
  {
    id: 'P004',
    name: 'Lisa Anderson',
    age: 32,
    gender: 'Female',
    department: 'OPD',
    bedNumber: null,
    roomNumber: 'Consult-3',
    status: 'normal',
    diagnosis: 'Routine prenatal checkup',
    admissionDate: '2026-01-22',
    attendingNurse: 'Sarah Johnson',
    vitals: {
      heartRate: 82,
      bloodPressure: { systolic: 118, diastolic: 75 },
      oxygenSaturation: 99,
      temperature: 36.8,
      lastUpdated: '2026-01-22T09:00:00',
    },
    medications: ['Prenatal vitamins'],
    notes: ['28 weeks gestation', 'Follow up in 2 weeks'],
    isInBed: false,
  },
  {
    id: 'P005',
    name: 'James Wilson',
    age: 58,
    gender: 'Male',
    department: 'IPD',
    bedNumber: 'B-205',
    roomNumber: 'R-20',
    status: 'warning',
    diagnosis: 'Diabetic Ketoacidosis',
    admissionDate: '2026-01-21',
    attendingNurse: 'Michael Chen',
    vitals: {
      heartRate: 95,
      bloodPressure: { systolic: 130, diastolic: 85 },
      oxygenSaturation: 96,
      temperature: 37.4,
      lastUpdated: '2026-01-22T08:20:00',
    },
    medications: ['Insulin drip', 'Normal saline IV', 'Potassium 20mEq'],
    notes: ['Hourly glucose checks', 'Monitor for cerebral edema'],
    isInBed: true,
  },
  {
    id: 'P006',
    name: 'Patricia Brown',
    age: 40,
    gender: 'Female',
    department: 'OPD',
    bedNumber: null,
    roomNumber: 'Consult-1',
    status: 'normal',
    diagnosis: 'Annual physical examination',
    admissionDate: '2026-01-22',
    attendingNurse: 'Emily Rodriguez',
    vitals: {
      heartRate: 70,
      bloodPressure: { systolic: 115, diastolic: 72 },
      oxygenSaturation: 99,
      temperature: 36.6,
      lastUpdated: '2026-01-22T09:10:00',
    },
    medications: [],
    notes: ['Labs ordered', 'Schedule mammogram'],
    isInBed: false,
  },
  {
    id: 'P007',
    name: 'Michael Thompson',
    age: 28,
    gender: 'Male',
    department: 'Emergency',
    bedNumber: 'ER-1',
    roomNumber: null,
    status: 'warning',
    diagnosis: 'Motor vehicle accident - minor injuries',
    admissionDate: '2026-01-22',
    attendingNurse: 'Sarah Johnson',
    vitals: {
      heartRate: 88,
      bloodPressure: { systolic: 135, diastolic: 88 },
      oxygenSaturation: 97,
      temperature: 37.1,
      lastUpdated: '2026-01-22T08:50:00',
    },
    medications: ['Morphine 4mg IV PRN', 'Tetanus booster'],
    notes: ['CT scan pending', 'Cervical collar in place'],
    isInBed: true,
  },
  {
    id: 'P008',
    name: 'Jennifer Martinez',
    age: 55,
    gender: 'Female',
    department: 'IPD',
    bedNumber: 'B-301',
    roomNumber: 'R-30',
    status: 'stable',
    diagnosis: 'Total knee replacement - Day 2',
    admissionDate: '2026-01-20',
    attendingNurse: 'Michael Chen',
    vitals: {
      heartRate: 75,
      bloodPressure: { systolic: 128, diastolic: 82 },
      oxygenSaturation: 98,
      temperature: 37.2,
      lastUpdated: '2026-01-22T08:25:00',
    },
    medications: ['Oxycodone 5mg PRN', 'Enoxaparin 40mg SC', 'Cefazolin 1g IV'],
    notes: ['Physical therapy 2x daily', 'Ice and elevate'],
    isInBed: false,
  },
];

export const bedOccupancy = {
  IPD: { total: 50, occupied: 35, available: 15 },
  Emergency: { total: 12, occupied: 8, available: 4 },
  ICU: { total: 10, occupied: 9, available: 1 },
};

export const nursesList = [
  { id: 'N001', name: 'Sarah Johnson', shift: 'Day', department: 'IPD' },
  { id: 'N002', name: 'Michael Chen', shift: 'Day', department: 'IPD' },
  { id: 'N003', name: 'Emily Rodriguez', shift: 'Day', department: 'Emergency' },
  { id: 'N004', name: 'David Kim', shift: 'Night', department: 'IPD' },
  { id: 'N005', name: 'Amanda White', shift: 'Night', department: 'Emergency' },
];
