// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role:
    | 'admin'
    | 'doctor'
    | 'nurse'
    | 'staff'
    | 'super_admin'
    | 'hospital_admin'
    | 'head_nurse'
    | 'receptionist'
    | 'billing_staff';
  department?: string;
  phone?: string;
  avatar?: string;
  lastLogin?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: User['role'];
  department: User['department'];
  phone?: string;
}

// Patient Types
export interface Patient {
  _id: string;
  patientId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  department?: 'OPD' | 'IPD' | 'Emergency' | 'ICU' | string;
  status: 'normal' | 'warning' | 'critical' | 'stable' | 'admitted' | 'active' | 'discharged';
  diagnosis?: string;
  admissionDate: string;
  dischargeDate?: string;
  attendingNurse?: User | string;
  attendingDoctor?: User | string;
  bed?: Bed | string;
  isInBed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientData {
  name: string;
  dateOfBirth?: string;
  age: number;
  gender: Patient['gender'];
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: Patient['emergencyContact'];
  department: Patient['department'];
  diagnosis?: string;
  attendingNurse?: string;
  attendingDoctor?: string;
  notes?: string;
}

export interface PatientFilters {
  department?: string;
  status?: string;
  nurse?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PatientStats {
  total: number;
  critical: number;
  inBed: number;
  admitted?: number;
  todayRegistrations?: number;
  byDepartment: Record<string, number>;
}

// Vital Types
export interface Vital {
  _id: string;
  patient: string | Patient;
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painLevel?: number;
  bloodGlucose?: number;
  notes?: string;
  isAbnormal: boolean;
  abnormalReadings: string[];
  recordedBy: string | User;
  recordedAt: string;
}

export interface CreateVitalData {
  patient: string;
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  painLevel?: number;
  bloodGlucose?: number;
  notes?: string;
}

export interface VitalTrend {
  date: string;
  temperature: number;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygenSaturation: number;
}

// Task Types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  type: 'medication' | 'vitals' | 'procedure' | 'observation' | 'documentation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  patient?: string | Patient;
  assignedTo: string | User;
  assignedBy: string | User;
  dueDate: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  type: Task['type'];
  priority: Task['priority'];
  patient?: string;
  assignedTo: string;
  dueDate: string;
  notes?: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  patient?: string;
  type?: string;
  page?: number;
  limit?: number;
}

// Alert Types
export interface Alert {
  _id: string;
  type: 'vital_abnormal' | 'medication_due' | 'task_overdue' | 'patient_critical' | 'system' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  patient?: string | Patient;
  relatedTask?: string | Task;
  relatedVital?: string | Vital;
  targetUsers: (string | User)[];
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string | User;
  acknowledgedAt?: string;
  isResolved: boolean;
  resolvedBy?: string | User;
  resolvedAt?: string;
  isDismissed: boolean;
  createdAt: string;
}

export interface CreateAlertData {
  type: Alert['type'];
  severity: Alert['severity'];
  title: string;
  message: string;
  patient?: string;
  targetUsers: string[];
}

export interface AlertCounts {
  total: number;
  unread: number;
  critical: number;
  bySeverity: Record<string, number>;
}

// Bed Types
export interface Bed {
  _id: string;
  bedNumber: string;
  ward: string;
  floor: number;
  department: 'IPD' | 'ICU' | 'Emergency';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentPatient?: string | Patient;
  features: string[];
  lastSanitized?: string;
  notes?: string;
}

export interface BedOccupancy {
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
  reserved: number;
  occupancyRate: number;
  byDepartment: Record<string, { total: number; occupied: number }>;
}

// Schedule Types
export interface Schedule {
  _id: string;
  staff: string | User;
  date: string;
  shift: 'morning' | 'afternoon' | 'night';
  shiftStart: string;
  shiftEnd: string;
  department: string;
  ward?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'absent' | 'swapped';
  notes?: string;
}

export interface CreateScheduleData {
  staff: string;
  date: string;
  shift: Schedule['shift'];
  shiftStart: string;
  shiftEnd: string;
  department: string;
  ward?: string;
  notes?: string;
}

export interface WeeklySchedule {
  week: string;
  schedules: Schedule[];
  staffList: User[];
}

// Medication Types
export interface Medication {
  _id: string;
  patient: string | Patient;
  name: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'iv' | 'im' | 'sc' | 'topical' | 'inhalation' | 'other';
  startDate: string;
  endDate?: string;
  prescribedBy: string | User;
  scheduledTimes: string[];
  administrations: {
    scheduledTime: string;
    administeredAt?: string;
    administeredBy?: string | User;
    status: 'pending' | 'administered' | 'missed' | 'held';
    notes?: string;
  }[];
  isActive: boolean;
  notes?: string;
}

export interface CreateMedicationData {
  patient: string;
  name: string;
  dosage: string;
  frequency: string;
  route: Medication['route'];
  startDate: string;
  endDate?: string;
  scheduledTimes: string[];
  notes?: string;
}

// Activity Log Types
export interface ActivityLog {
  _id: string;
  action: string;
  description: string;
  user: string | User;
  patient?: string | Patient;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Staff Types
export interface StaffMember extends User {
  _id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffStats {
  total: number;
  active: number;
  byRole: Record<string, number>;
  byDepartment: Record<string, number>;
}
