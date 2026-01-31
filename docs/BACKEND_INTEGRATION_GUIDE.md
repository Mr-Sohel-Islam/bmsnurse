# Backend Integration Guide: Node.js + Express + MongoDB

## 📋 Project Overview

This document provides a comprehensive roadmap for integrating a Node.js/Express/MongoDB backend with the BMS Nurse Station frontend application.

---

## 🗺️ Application Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pages                    │  Components                │  Data Layer        │
│  ─────────                │  ──────────                │  ──────────        │
│  • LoginPage              │  • AppSidebar              │  • mockPatients    │
│  • Index (Dashboard)      │  • TopHeader               │  • mockStaff       │
│  • PatientsPage           │  • PatientCard             │  • mockMedications │
│  • OPDPage                │  • StatsCard               │                    │
│  • IPDPage                │  • VitalSignsChart         │                    │
│  • EmergencyPage          │  • BedManagement           │                    │
│  • TasksPage              │  • MedicationScheduler     │                    │
│  • AlertsPage             │  • AssignTaskModal         │                    │
│  • NurseSchedulePage      │  • TriageQueue             │                    │
│  • AdminMasterPage        │  • AppointmentQueue        │                    │
│  • SettingsPage           │  • DischargePanel          │                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ REST API / HTTP
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js + Express)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Routes                   │  Controllers               │  Middleware        │
│  ──────                   │  ───────────               │  ──────────        │
│  • /api/auth              │  • authController          │  • authMiddleware  │
│  • /api/patients          │  • patientController       │  • errorHandler    │
│  • /api/staff             │  • staffController         │  • validation      │
│  • /api/tasks             │  • taskController          │  • rateLimiter     │
│  • /api/alerts            │  • alertController         │  • cors            │
│  • /api/schedule          │  • scheduleController      │  • logging         │
│  • /api/medications       │  • medicationController    │                    │
│  • /api/beds              │  • bedController           │                    │
│  • /api/vitals            │  • vitalsController        │                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Mongoose ODM
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE (MongoDB)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  Collections                                                                │
│  ───────────                                                                │
│  • users          (staff accounts, authentication)                          │
│  • patients       (patient records, demographics, history)                  │
│  • vitals         (vital signs readings, timestamps)                        │
│  • tasks          (assigned tasks, status, priority)                        │
│  • alerts         (system alerts, acknowledgments)                          │
│  • schedules      (staff schedules, shifts)                                 │
│  • medications    (medication records, schedules)                           │
│  • beds           (bed assignments, occupancy)                              │
│  • departments    (OPD, IPD, Emergency configs)                             │
│  • activity_logs  (audit trail, system events)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Recommended Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── env.js                # Environment variables
│   │   └── cors.js               # CORS configuration
│   │
│   ├── models/
│   │   ├── User.js               # Staff/Admin accounts
│   │   ├── Patient.js            # Patient records
│   │   ├── Vital.js              # Vital signs
│   │   ├── Task.js               # Tasks
│   │   ├── Alert.js              # Alerts
│   │   ├── Schedule.js           # Staff schedules
│   │   ├── Medication.js         # Medications
│   │   ├── Bed.js                # Bed management
│   │   └── ActivityLog.js        # Audit logs
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── staff.routes.js
│   │   ├── task.routes.js
│   │   ├── alert.routes.js
│   │   ├── schedule.routes.js
│   │   ├── medication.routes.js
│   │   ├── bed.routes.js
│   │   └── vitals.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── staff.controller.js
│   │   ├── task.controller.js
│   │   ├── alert.controller.js
│   │   ├── schedule.controller.js
│   │   ├── medication.controller.js
│   │   ├── bed.controller.js
│   │   └── vitals.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── role.middleware.js    # Role-based access
│   │   ├── error.middleware.js   # Error handling
│   │   └── validate.middleware.js # Request validation
│   │
│   ├── utils/
│   │   ├── jwt.js                # Token utilities
│   │   ├── password.js           # Password hashing
│   │   └── response.js           # API response helpers
│   │
│   └── app.js                    # Express app setup
│
├── .env                          # Environment variables
├── .env.example                  # Env template
├── package.json
└── server.js                     # Entry point
```

---

## 🔐 Step 1: Authentication System

### Database Schema: User Model

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'doctor', 'nurse', 'staff'], 
    required: true 
  },
  department: { 
    type: String, 
    enum: ['OPD', 'IPD', 'Emergency', 'General'] 
  },
  phone: String,
  avatar: String,
  status: { 
    type: String, 
    enum: ['active', 'on-break', 'off-duty', 'on-leave'], 
    default: 'off-duty' 
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  refreshToken: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### API Endpoints for LoginPage

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/auth/login` | User login | `{ email, password, rememberMe }` |
| POST | `/api/auth/logout` | User logout | - |
| POST | `/api/auth/refresh` | Refresh token | `{ refreshToken }` |
| GET | `/api/auth/me` | Get current user | - |
| POST | `/api/auth/forgot-password` | Password reset | `{ email }` |

### Frontend Integration (LoginPage.tsx)

```typescript
// src/services/authService.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login(email: string, password: string, rememberMe: boolean) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
      rememberMe
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (rememberMe) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    
    return response.data;
  },
  
  async logout() {
    await axios.post(`${API_URL}/auth/logout`);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  async getCurrentUser() {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }
};
```

---

## 👥 Step 2: Patient Management

### Database Schema: Patient Model

```javascript
// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true }, // e.g., "P-1001"
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  department: { 
    type: String, 
    enum: ['OPD', 'IPD', 'Emergency'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['critical', 'warning', 'stable', 'normal'], 
    default: 'normal' 
  },
  diagnosis: String,
  roomNumber: String,
  bedNumber: String,
  isInBed: { type: Boolean, default: false },
  admissionDate: { type: Date, default: Date.now },
  attendingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendingNurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  triageLevel: { 
    type: Number, 
    min: 1, 
    max: 5,
    // 1 = Resuscitation, 2 = Emergent, 3 = Urgent, 4 = Less Urgent, 5 = Non-Urgent
  },
  contactPhone: String,
  contactEmail: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  medicalHistory: [String],
  allergies: [String],
  insuranceInfo: {
    provider: String,
    policyNumber: String
  }
}, { timestamps: true });

// Auto-generate patient ID
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `P-${1001 + count}`;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
```

### API Endpoints for Patient Pages

| Method | Endpoint | Description | Used In |
|--------|----------|-------------|---------|
| GET | `/api/patients` | List all patients (with filters) | PatientsPage, Index |
| GET | `/api/patients/:id` | Get patient details | PatientDetailModal |
| POST | `/api/patients` | Create new patient | PatientsPage |
| PUT | `/api/patients/:id` | Update patient | PatientDetailModal |
| DELETE | `/api/patients/:id` | Delete patient | Admin only |
| GET | `/api/patients/department/:dept` | Filter by department | OPDPage, IPDPage, EmergencyPage |
| GET | `/api/patients/stats` | Get dashboard stats | Index |
| PATCH | `/api/patients/:id/assign` | Assign nurse/doctor | AdminMasterPage |
| PATCH | `/api/patients/:id/status` | Update patient status | All pages |

### Frontend Service

```typescript
// src/services/patientService.ts
import axios from 'axios';
import { Patient } from '@/data/mockPatients';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const patientService = {
  async getAll(filters?: {
    department?: string;
    status?: string;
    nurse?: string;
    search?: string;
  }) {
    const params = new URLSearchParams(filters as Record<string, string>);
    const response = await axios.get(`${API_URL}/patients?${params}`);
    return response.data;
  },
  
  async getById(id: string) {
    const response = await axios.get(`${API_URL}/patients/${id}`);
    return response.data;
  },
  
  async create(patient: Partial<Patient>) {
    const response = await axios.post(`${API_URL}/patients`, patient);
    return response.data;
  },
  
  async update(id: string, updates: Partial<Patient>) {
    const response = await axios.put(`${API_URL}/patients/${id}`, updates);
    return response.data;
  },
  
  async getStats() {
    const response = await axios.get(`${API_URL}/patients/stats`);
    return response.data;
  },
  
  async assignStaff(patientId: string, staffId: string, role: 'nurse' | 'doctor') {
    const response = await axios.patch(`${API_URL}/patients/${patientId}/assign`, {
      staffId,
      role
    });
    return response.data;
  }
};
```

---

## 📊 Step 3: Vital Signs Monitoring

### Database Schema: Vital Model

```javascript
// models/Vital.js
const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  recordedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  heartRate: { type: Number }, // bpm
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  temperature: { type: Number }, // °F or °C
  oxygenSaturation: { type: Number }, // SpO2 %
  respiratoryRate: { type: Number }, // breaths/min
  painLevel: { type: Number, min: 0, max: 10 },
  notes: String,
  isAbnormal: { type: Boolean, default: false },
  alertGenerated: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-detect abnormal vitals and generate alerts
vitalSchema.pre('save', function(next) {
  this.isAbnormal = (
    this.heartRate < 60 || this.heartRate > 100 ||
    this.bloodPressure?.systolic > 140 || this.bloodPressure?.systolic < 90 ||
    this.bloodPressure?.diastolic > 90 || this.bloodPressure?.diastolic < 60 ||
    this.temperature > 100.4 || this.temperature < 97 ||
    this.oxygenSaturation < 95
  );
  next();
});

module.exports = mongoose.model('Vital', vitalSchema);
```

### API Endpoints

| Method | Endpoint | Description | Used In |
|--------|----------|-------------|---------|
| GET | `/api/vitals/patient/:patientId` | Get patient vitals history | PatientDetailModal |
| POST | `/api/vitals` | Record new vitals | VitalSignsChart |
| GET | `/api/vitals/patient/:patientId/latest` | Get latest vitals | PatientCard |
| GET | `/api/vitals/alerts` | Get abnormal vitals alerts | AlertsPage |

---

## ✅ Step 4: Task Management

### Database Schema: Task Model

```javascript
// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { 
    type: String, 
    enum: ['medication', 'vitals', 'procedure', 'discharge', 'admission', 'follow-up', 'lab', 'other'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['urgent', 'high', 'medium', 'low'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  dueDate: Date,
  dueTime: String,
  completedAt: Date,
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
```

### API Endpoints for TasksPage & AssignTaskModal

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (with filters) |
| GET | `/api/tasks/my-tasks` | Get logged-in user's tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats` | Get task statistics |

---

## 🔔 Step 5: Alert System

### Database Schema: Alert Model

```javascript
// models/Alert.js
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['critical', 'warning', 'info', 'medication', 'vital', 'task', 'system'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['critical', 'high', 'medium', 'low'], 
    default: 'medium' 
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetDepartment: String,
  isRead: { type: Boolean, default: false },
  isAcknowledged: { type: Boolean, default: false },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acknowledgedAt: Date,
  relatedVital: { type: mongoose.Schema.Types.ObjectId, ref: 'Vital' },
  relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  expiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
```

### API Endpoints for AlertsPage

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List all alerts |
| GET | `/api/alerts/unread` | Get unread alerts count |
| PATCH | `/api/alerts/:id/read` | Mark as read |
| PATCH | `/api/alerts/:id/acknowledge` | Acknowledge alert |
| POST | `/api/alerts` | Create new alert |
| DELETE | `/api/alerts/:id` | Delete alert |

---

## 📅 Step 6: Staff Scheduling

### Database Schema: Schedule Model

```javascript
// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  shiftType: { 
    type: String, 
    enum: ['morning', 'afternoon', 'night', 'off', 'leave'],
    required: true 
  },
  shiftStart: String, // "07:00"
  shiftEnd: String,   // "15:00"
  department: String,
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Compound index for efficient queries
scheduleSchema.index({ staff: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
```

### API Endpoints for NurseSchedulePage

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedule` | Get all schedules (with date range) |
| GET | `/api/schedule/staff/:staffId` | Get staff member's schedule |
| GET | `/api/schedule/week/:startDate` | Get weekly schedule |
| POST | `/api/schedule` | Create schedule entry |
| PUT | `/api/schedule/:id` | Update schedule |
| DELETE | `/api/schedule/:id` | Delete schedule |
| POST | `/api/schedule/bulk` | Bulk create schedules |

---

## 🏥 Step 7: Bed Management

### Database Schema: Bed Model

```javascript
// models/Bed.js
const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  roomNumber: { type: String, required: true },
  department: { 
    type: String, 
    enum: ['IPD', 'ICU', 'Emergency', 'General'],
    required: true 
  },
  floor: String,
  ward: String,
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'reserved', 'maintenance', 'cleaning'],
    default: 'available' 
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  admissionDate: Date,
  expectedDischargeDate: Date,
  features: [String], // ['oxygen', 'monitor', 'ventilator']
  notes: String
}, { timestamps: true });

bedSchema.index({ department: 1, status: 1 });

module.exports = mongoose.model('Bed', bedSchema);
```

### API Endpoints for IPDPage & BedManagement

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beds` | List all beds |
| GET | `/api/beds/available` | Get available beds |
| GET | `/api/beds/department/:dept` | Get beds by department |
| POST | `/api/beds` | Create new bed |
| PUT | `/api/beds/:id` | Update bed |
| PATCH | `/api/beds/:id/assign` | Assign patient to bed |
| PATCH | `/api/beds/:id/release` | Release bed |
| GET | `/api/beds/occupancy-stats` | Get occupancy statistics |

---

## 💊 Step 8: Medication Management

### Database Schema: Medication Model

```javascript
// models/Medication.js
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: String, // "Every 8 hours", "Once daily"
  route: { 
    type: String, 
    enum: ['oral', 'iv', 'im', 'sc', 'topical', 'inhalation', 'sublingual'],
    default: 'oral' 
  },
  scheduledTimes: [String], // ["08:00", "16:00", "00:00"]
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'discontinued', 'on-hold'],
    default: 'active' 
  },
  notes: String,
  administrations: [{
    scheduledTime: String,
    actualTime: Date,
    administeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['given', 'missed', 'refused', 'held'] },
    notes: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);
```

### API Endpoints for MedicationScheduler

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications/patient/:patientId` | Get patient medications |
| GET | `/api/medications/due` | Get medications due now |
| POST | `/api/medications` | Create medication order |
| PUT | `/api/medications/:id` | Update medication |
| POST | `/api/medications/:id/administer` | Record administration |
| PATCH | `/api/medications/:id/status` | Update medication status |

---

## 👨‍💼 Step 9: Admin Dashboard (AdminMasterPage)

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/staff-overview` | Get all staff with status |
| GET | `/api/admin/patient-assignments` | Get all patient-staff assignments |
| GET | `/api/admin/activity-log` | Get system activity log |
| GET | `/api/admin/dashboard-stats` | Get comprehensive stats |
| PATCH | `/api/admin/staff/:id/status` | Update staff status |

### Activity Log Model

```javascript
// models/ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actionType: { 
    type: String, 
    enum: ['patient', 'task', 'medication', 'vital', 'alert', 'schedule', 'bed', 'auth', 'system'],
    required: true 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ actionType: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
```

---

## 🚀 Implementation Steps

### Phase 1: Setup & Authentication (Week 1)

1. **Initialize Backend Project**
   ```bash
   mkdir backend && cd backend
   npm init -y
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken helmet morgan
   npm install -D nodemon
   ```

2. **Setup MongoDB Connection**
   ```javascript
   // src/config/db.js
   const mongoose = require('mongoose');
   
   const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log('MongoDB Connected');
     } catch (error) {
       console.error('MongoDB connection error:', error);
       process.exit(1);
     }
   };
   
   module.exports = connectDB;
   ```

3. **Create User Model & Auth Routes**
4. **Implement JWT Authentication**
5. **Add Auth Middleware**
6. **Test with LoginPage.tsx**

### Phase 2: Core Models (Week 2)

1. Create Patient Model
2. Create Vital Model
3. Create Task Model
4. Create Alert Model
5. Implement CRUD operations for each

### Phase 3: Department Features (Week 3)

1. Bed Management for IPDPage
2. Appointment Queue for OPDPage
3. Triage System for EmergencyPage
4. Medication Scheduler

### Phase 4: Admin & Scheduling (Week 4)

1. Staff Schedule Management
2. Admin Dashboard APIs
3. Activity Logging
4. Real-time notifications (Socket.io)

### Phase 5: Frontend Integration (Week 5)

1. Create API service layer
2. Setup React Query for data fetching
3. Replace mock data with API calls
4. Add loading states and error handling

---

## 🔧 Frontend API Layer Setup

### Axios Configuration

```typescript
// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        
        localStorage.setItem('token', response.data.token);
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### React Query Hooks

```typescript
// src/hooks/usePatients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '@/services/patientService';

export const usePatients = (filters?: PatientFilters) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getAll(filters),
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) =>
      patientService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
};
```

---

## 📊 Page-by-Page Integration Checklist

### ✅ LoginPage.tsx
- [ ] POST `/api/auth/login` - Email/password login
- [ ] Social OAuth integration (Google, etc.)
- [ ] Token storage and refresh
- [ ] Remember me functionality
- [ ] Redirect after login

### ✅ Index.tsx (Dashboard)
- [ ] GET `/api/patients/stats` - Dashboard statistics
- [ ] GET `/api/alerts/unread` - Alert badge count
- [ ] GET `/api/patients?limit=10` - Recent patients
- [ ] Real-time updates via WebSocket

### ✅ PatientsPage.tsx
- [ ] GET `/api/patients` - Patient list with filtering
- [ ] Search, status filter, nurse filter
- [ ] POST `/api/patients` - Add new patient
- [ ] Pagination support

### ✅ OPDPage.tsx
- [ ] GET `/api/patients?department=OPD` - OPD patients
- [ ] GET `/api/appointments/today` - Today's appointments
- [ ] Appointment queue management

### ✅ IPDPage.tsx
- [ ] GET `/api/patients?department=IPD` - IPD patients
- [ ] GET `/api/beds` - Bed management
- [ ] Discharge workflow

### ✅ EmergencyPage.tsx
- [ ] GET `/api/patients?department=Emergency` - ER patients
- [ ] Triage queue with priority sorting
- [ ] Critical patient alerts

### ✅ TasksPage.tsx
- [ ] GET `/api/tasks/my-tasks` - User's tasks
- [ ] PATCH `/api/tasks/:id/status` - Update status
- [ ] POST `/api/tasks` - Create task

### ✅ AlertsPage.tsx
- [ ] GET `/api/alerts` - All alerts
- [ ] PATCH `/api/alerts/:id/acknowledge` - Acknowledge
- [ ] Real-time alert notifications

### ✅ NurseSchedulePage.tsx
- [ ] GET `/api/schedule/week/:date` - Weekly schedule
- [ ] POST `/api/schedule` - Add shift
- [ ] Department filtering

### ✅ AdminMasterPage.tsx
- [ ] GET `/api/admin/staff-overview` - Staff list
- [ ] GET `/api/admin/patient-assignments` - Assignments
- [ ] GET `/api/admin/activity-log` - Activity log
- [ ] Staff status management

### ✅ SettingsPage.tsx
- [ ] GET `/api/auth/me` - Get profile
- [ ] PUT `/api/auth/profile` - Update profile
- [ ] PUT `/api/auth/password` - Change password
- [ ] Notification preferences

---

## 🔒 Security Considerations

1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Use Joi or express-validator
4. **Rate Limiting**: Prevent brute force attacks
5. **CORS**: Configure for frontend domain only
6. **Helmet**: Security headers
7. **Data Encryption**: Sensitive data at rest
8. **Audit Logging**: Track all actions
9. **HTTPS**: SSL/TLS in production

---

## 📦 Environment Variables

```env
# .env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bms_nurse_station

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# Email (for password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

---

## 🎯 Summary

This integration guide provides a complete roadmap for building a robust Node.js/Express/MongoDB backend for the BMS Nurse Station application. Follow the phases sequentially, starting with authentication, then core models, and finally real-time features.

**Key Technologies:**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io (optional)
- **Validation**: Joi/express-validator
- **Security**: Helmet, bcrypt, rate-limiting

**Estimated Timeline**: 4-5 weeks for complete integration
