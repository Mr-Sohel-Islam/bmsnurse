# MediCare Patient Monitor — User Guide

## Getting Started

### 1. Login
- Navigate to `/login`
- Enter your credentials (email & password)
- Roles available: **Admin**, **Doctor**, **Nurse**, **Staff**
- Access is role-based — certain pages are restricted by role

### 2. Dashboard (Home)
- View overall hospital stats: total patients, occupied beds, pending tasks, active alerts
- Quick department tabs (OPD, IPD, Emergency)
- Recent alerts panel with priority indicators
- Vital signs charts for monitored patients

---

## Core Modules

### Patients (`/patients`)
- Browse all registered patients with search and filters
- Filter by status (Active, Discharged, Critical) and department
- Click a patient card to view detailed info, vitals, and medications

### OPD — Outpatient (`/opd`)
- View today's appointment queue
- Track patient flow: Waiting → In Consultation → Completed
- Accessible to **Admin**, **Doctor**, **Nurse**

### IPD — Inpatient (`/ipd`)
- **Bed Management**: Visual grid of all IPD beds with status (Available, Occupied, Maintenance)
- **Assign Patient**: Click an available bed → select an unassigned patient → confirm
- **Release Bed**: Click the "Release" button on an occupied bed to free it
- **Discharge Panel**: Manage patient discharge workflows
- Accessible to **Admin**, **Doctor**, **Nurse**

### Emergency (`/emergency`)
- **Triage Queue**: Patients sorted by triage level (1 = Critical, 2 = Urgent, 3 = Standard)
- **Assign Bed**: Click "Assign Bed" on any unassigned patient to open the bed picker modal
- **Stats**: Real-time counts of active cases, critical patients, and bed availability
- Accessible to **Admin**, **Doctor**, **Nurse**

### Tasks (`/tasks`)
- View and manage clinical tasks assigned to you or your team
- Filter by status, priority, or assignee
- Accessible to **all authenticated users**

### Alerts (`/alerts`)
- Central alert feed with severity levels (Critical, Warning, Info)
- Acknowledge or dismiss alerts
- Accessible to **all authenticated users**

---

## Admin-Only Features

### Nurse Schedule (`/schedule`)
- Weekly schedule grid for all nursing staff
- Navigate between weeks with Previous / Next buttons
- Filter by department and shift type (Morning, Afternoon, Night)
- Accessible to **Admin**, **Nurse**

### Admin Dashboard (`/admin`)
- Hospital-wide statistics: staff count, patient count, alert counts
- Staff directory with search and role/department filters
- Recent activity log showing system-wide actions
- Accessible to **Admin only**

### Settings (`/settings`)
- Profile and account preferences
- Accessible to **all authenticated users**

---

## Backend Setup (for Developers)

### Prerequisites
- Node.js ≥ 18
- MongoDB instance (local or Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, and port
   ```

5. **Seed the database** (optional — creates sample data)
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run dev
   ```

7. **Start the frontend** (from project root)
   ```bash
   cd ..
   npm run dev
   ```

8. **Open in browser**
   Visit `http://localhost:5173`

---

## API Base URL

The frontend expects the API at `http://localhost:5000/api` by default. To change this, update the Axios base URL in `src/lib/axios.ts`.

---

## Role Permissions Summary

| Feature          | Admin | Doctor | Nurse | Staff |
|------------------|:-----:|:------:|:-----:|:-----:|
| Dashboard        | ✅    | ✅     | ✅    | ✅    |
| All Patients     | ✅    | ✅     | ✅    | ✅    |
| OPD              | ✅    | ✅     | ✅    | ❌    |
| IPD              | ✅    | ✅     | ✅    | ❌    |
| Emergency        | ✅    | ✅     | ✅    | ❌    |
| Tasks            | ✅    | ✅     | ✅    | ✅    |
| Alerts           | ✅    | ✅     | ✅    | ✅    |
| Nurse Schedule   | ✅    | ❌     | ✅    | ❌    |
| Admin Dashboard  | ✅    | ❌     | ❌    | ❌    |
| Settings         | ✅    | ✅     | ✅    | ✅    |
