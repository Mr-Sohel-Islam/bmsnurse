# BMS Nurse Dashboard - Backend

Complete Node.js/Express/MongoDB backend for the BMS Nurse Dashboard application.

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account

### 2. Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secrets

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

### 3. Test Credentials
After seeding:
- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123
- **Nurse**: sarah@hospital.com / nurse123

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new user (Admin only) |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| PUT | `/api/auth/password` | Change password |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients (with filters) |
| GET | `/api/patients/stats` | Get patient statistics |
| GET | `/api/patients/:id` | Get single patient |
| POST | `/api/patients` | Create patient |
| PUT | `/api/patients/:id` | Update patient |
| PUT | `/api/patients/:id/discharge` | Discharge patient |

### Vitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vitals/patient/:patientId` | Get patient vitals |
| GET | `/api/vitals/patient/:patientId/latest` | Get latest vital |
| GET | `/api/vitals/patient/:patientId/trends` | Get vital trends |
| POST | `/api/vitals` | Record new vitals |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/my` | Get my assigned tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PUT | `/api/tasks/:id/complete` | Complete task |
| DELETE | `/api/tasks/:id` | Delete task (Admin) |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedule` | Get schedules |
| GET | `/api/schedule/my` | Get my schedule |
| GET | `/api/schedule/weekly` | Get weekly view |
| POST | `/api/schedule` | Create schedule (Admin) |
| POST | `/api/schedule/bulk` | Bulk create schedules (Admin) |
| PUT | `/api/schedule/:id` | Update schedule (Admin) |
| DELETE | `/api/schedule/:id` | Delete schedule (Admin) |

### Beds
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beds` | Get all beds |
| GET | `/api/beds/occupancy` | Get occupancy stats |
| GET | `/api/beds/:id` | Get single bed |
| POST | `/api/beds` | Create bed (Admin) |
| PUT | `/api/beds/:id/assign` | Assign patient to bed |
| PUT | `/api/beds/:id/release` | Release bed |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| GET | `/api/alerts/my` | Get my alerts |
| GET | `/api/alerts/counts` | Get alert counts |
| POST | `/api/alerts` | Create alert |
| PUT | `/api/alerts/:id/acknowledge` | Acknowledge alert |
| PUT | `/api/alerts/:id/resolve` | Resolve alert |
| PUT | `/api/alerts/:id/dismiss` | Dismiss alert |

### Medications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications/patient/:patientId` | Get patient medications |
| GET | `/api/medications/due` | Get due medications |
| POST | `/api/medications` | Create medication (Doctor/Admin) |
| POST | `/api/medications/:id/administer` | Record administration |
| PUT | `/api/medications/:id/discontinue` | Discontinue medication |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get all activities |
| GET | `/api/activities/recent` | Get recent activities |
| GET | `/api/activities/my` | Get my activities |
| GET | `/api/activities/patient/:patientId` | Get patient activities |

### Staff
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/staff` | Get all staff |
| GET | `/api/staff/nurses` | Get nurses list |
| GET | `/api/staff/doctors` | Get doctors list |
| GET | `/api/staff/stats` | Get staff statistics |
| GET | `/api/staff/:id` | Get staff member |
| PUT | `/api/staff/:id` | Update staff (Admin) |
| PUT | `/api/staff/:id/deactivate` | Deactivate staff (Admin) |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── vital.controller.js
│   │   ├── task.controller.js
│   │   ├── schedule.controller.js
│   │   ├── bed.controller.js
│   │   ├── alert.controller.js
│   │   ├── medication.controller.js
│   │   ├── activity.controller.js
│   │   └── staff.controller.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & RBAC
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validators.js        # Request validation
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Vital.js
│   │   ├── Task.js
│   │   ├── Schedule.js
│   │   ├── Bed.js
│   │   ├── Alert.js
│   │   ├── Medication.js
│   │   ├── ActivityLog.js
│   │   └── index.js
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── vital.routes.js
│   │   ├── task.routes.js
│   │   ├── schedule.routes.js
│   │   ├── bed.routes.js
│   │   ├── alert.routes.js
│   │   ├── medication.routes.js
│   │   ├── activity.routes.js
│   │   └── staff.routes.js
│   ├── seeds/
│   │   └── seedDatabase.js      # Database seeder
│   └── server.js                # Entry point
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## Frontend Integration

To connect the React frontend to this backend:

1. Create `src/lib/axios.ts`:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

2. Use with React Query for data fetching
3. Update mock data imports to API calls

## Role-Based Access

| Role | Permissions |
|------|-------------|
| Admin | Full access to all resources |
| Doctor | Create/update patients, prescribe medications, create tasks |
| Nurse | Record vitals, administer medications, complete tasks |
| Staff | View-only access to assigned resources |
