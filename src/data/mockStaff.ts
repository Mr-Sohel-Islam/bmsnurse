export interface StaffMember {
  id: string;
  name: string;
  role: "Admin" | "Doctor" | "Nurse" | "Staff";
  department: string;
  avatar: string;
  email: string;
  phone: string;
  status: "online" | "busy" | "offline" | "on-break";
  shift: "morning" | "afternoon" | "night";
  assignedPatients: string[];
}

export interface ScheduleShift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: "morning" | "afternoon" | "night";
  department: string;
  status: "scheduled" | "in-progress" | "completed" | "absent";
}

export interface ActivityLog {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  target: string;
  timestamp: string;
  type: "task" | "patient" | "medication" | "alert" | "login" | "logout";
}

export const mockStaff: StaffMember[] = [
  {
    id: "S001",
    name: "Sarah Johnson",
    role: "Nurse",
    department: "IPD",
    avatar: "SJ",
    email: "sarah.johnson@medicare.com",
    phone: "+1 555-0101",
    status: "online",
    shift: "morning",
    assignedPatients: ["P001", "P002", "P005"],
  },
  {
    id: "S002",
    name: "Michael Chen",
    role: "Nurse",
    department: "ICU",
    avatar: "MC",
    email: "michael.chen@medicare.com",
    phone: "+1 555-0102",
    status: "busy",
    shift: "morning",
    assignedPatients: ["P003"],
  },
  {
    id: "S003",
    name: "Emily Davis",
    role: "Nurse",
    department: "Emergency",
    avatar: "ED",
    email: "emily.davis@medicare.com",
    phone: "+1 555-0103",
    status: "online",
    shift: "afternoon",
    assignedPatients: ["P004", "P006"],
  },
  {
    id: "S004",
    name: "Robert Wilson",
    role: "Nurse",
    department: "OPD",
    avatar: "RW",
    email: "robert.wilson@medicare.com",
    phone: "+1 555-0104",
    status: "on-break",
    shift: "morning",
    assignedPatients: ["P007"],
  },
  {
    id: "S005",
    name: "Dr. Amanda Foster",
    role: "Doctor",
    department: "ICU",
    avatar: "AF",
    email: "amanda.foster@medicare.com",
    phone: "+1 555-0201",
    status: "busy",
    shift: "morning",
    assignedPatients: ["P001", "P003"],
  },
  {
    id: "S006",
    name: "Dr. James Martinez",
    role: "Doctor",
    department: "Emergency",
    avatar: "JM",
    email: "james.martinez@medicare.com",
    phone: "+1 555-0202",
    status: "online",
    shift: "afternoon",
    assignedPatients: ["P004", "P006", "P008"],
  },
  {
    id: "S007",
    name: "Lisa Thompson",
    role: "Nurse",
    department: "IPD",
    avatar: "LT",
    email: "lisa.thompson@medicare.com",
    phone: "+1 555-0105",
    status: "offline",
    shift: "night",
    assignedPatients: [],
  },
  {
    id: "S008",
    name: "Admin User",
    role: "Admin",
    department: "Administration",
    avatar: "AU",
    email: "admin@medicare.com",
    phone: "+1 555-0001",
    status: "online",
    shift: "morning",
    assignedPatients: [],
  },
];

export const mockSchedule: ScheduleShift[] = [
  // Today's shifts
  { id: "SCH001", staffId: "S001", date: "2026-01-30", startTime: "06:00", endTime: "14:00", shiftType: "morning", department: "IPD", status: "in-progress" },
  { id: "SCH002", staffId: "S002", date: "2026-01-30", startTime: "06:00", endTime: "14:00", shiftType: "morning", department: "ICU", status: "in-progress" },
  { id: "SCH003", staffId: "S003", date: "2026-01-30", startTime: "14:00", endTime: "22:00", shiftType: "afternoon", department: "Emergency", status: "scheduled" },
  { id: "SCH004", staffId: "S004", date: "2026-01-30", startTime: "06:00", endTime: "14:00", shiftType: "morning", department: "OPD", status: "in-progress" },
  { id: "SCH005", staffId: "S007", date: "2026-01-30", startTime: "22:00", endTime: "06:00", shiftType: "night", department: "IPD", status: "scheduled" },
  // Tomorrow's shifts
  { id: "SCH006", staffId: "S001", date: "2026-01-31", startTime: "06:00", endTime: "14:00", shiftType: "morning", department: "IPD", status: "scheduled" },
  { id: "SCH007", staffId: "S003", date: "2026-01-31", startTime: "06:00", endTime: "14:00", shiftType: "morning", department: "Emergency", status: "scheduled" },
  { id: "SCH008", staffId: "S002", date: "2026-01-31", startTime: "14:00", endTime: "22:00", shiftType: "afternoon", department: "ICU", status: "scheduled" },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: "ACT001", staffId: "S001", staffName: "Sarah Johnson", action: "Administered medication", target: "John Smith (P001)", timestamp: "2026-01-30T08:45:00", type: "medication" },
  { id: "ACT002", staffId: "S002", staffName: "Michael Chen", action: "Updated vital signs", target: "David Brown (P003)", timestamp: "2026-01-30T08:30:00", type: "patient" },
  { id: "ACT003", staffId: "S005", staffName: "Dr. Amanda Foster", action: "Completed patient assessment", target: "John Smith (P001)", timestamp: "2026-01-30T08:15:00", type: "patient" },
  { id: "ACT004", staffId: "S001", staffName: "Sarah Johnson", action: "Acknowledged alert", target: "High Blood Pressure Alert", timestamp: "2026-01-30T08:00:00", type: "alert" },
  { id: "ACT005", staffId: "S003", staffName: "Emily Davis", action: "Logged in", target: "System", timestamp: "2026-01-30T13:55:00", type: "login" },
  { id: "ACT006", staffId: "S004", staffName: "Robert Wilson", action: "Completed task", target: "Wound Care - Mary Johnson", timestamp: "2026-01-30T07:45:00", type: "task" },
  { id: "ACT007", staffId: "S006", staffName: "Dr. James Martinez", action: "Ordered lab tests", target: "Lisa Anderson (P004)", timestamp: "2026-01-30T07:30:00", type: "patient" },
  { id: "ACT008", staffId: "S002", staffName: "Michael Chen", action: "Started IV treatment", target: "David Brown (P003)", timestamp: "2026-01-30T07:15:00", type: "medication" },
];
