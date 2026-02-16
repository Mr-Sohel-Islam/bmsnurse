import { useState } from "react";
import { 
  Shield, 
  Users, 
  Activity, 
  Clock, 
  Search, 
  UserCheck,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2
} from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaff, useStaffStats } from "@/hooks/useStaff";
import { usePatients } from "@/hooks/usePatients";
import { useRecentActivities } from "@/hooks/useActivities";
import { useAlertCounts } from "@/hooks/useAlerts";
import { AssignTaskModal } from "@/components/tasks/AssignTaskModal";
import { cn } from "@/lib/utils";
import type { User, StaffMember, ActivityLog } from "@/types/api";

const activityTypeIcons: Record<string, string> = {
  task: "📋",
  patient: "🏥",
  medication: "💊",
  alert: "🔔",
  login: "🔐",
  logout: "🚪",
  bed_assigned: "🛏️",
  bed_released: "🛏️",
  vital_recorded: "❤️",
};

export default function AdminMasterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [assignTaskOpen, setAssignTaskOpen] = useState(false);

  const { data: staffList = [], isLoading: staffLoading } = useStaff({
    role: roleFilter !== "all" ? roleFilter : undefined,
    department: departmentFilter !== "all" ? departmentFilter : undefined,
  });
  const { data: staffStats } = useStaffStats();
  const { data: patientsResponse } = usePatients({ limit: 100 });
  const { data: recentActivities = [], isLoading: activitiesLoading } = useRecentActivities(20);
  const { data: alertCounts } = useAlertCounts();

  const patients = patientsResponse?.data || [];

  const filteredStaff = staffList.filter((staff) => {
    if (searchQuery && !staff.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const stats = [
    { 
      label: "Total Staff", 
      value: staffStats?.total ?? staffList.length, 
      icon: Users, 
      color: "text-primary" 
    },
    { 
      label: "Active Staff", 
      value: staffStats?.active ?? staffList.filter((s) => s.isActive).length, 
      icon: UserCheck, 
      color: "text-green-500" 
    },
    { 
      label: "Departments", 
      value: staffStats?.byDepartment ? Object.keys(staffStats.byDepartment).length : 0, 
      icon: Clock, 
      color: "text-blue-500" 
    },
    { 
      label: "Active Alerts", 
      value: alertCounts?.unread ?? 0, 
      icon: AlertCircle, 
      color: "text-red-500" 
    },
  ];

  const getActivityUser = (activity: ActivityLog) => {
    if (typeof activity.user === "string") return activity.user;
    return (activity.user as User)?.name || "Unknown";
  };

  const getActivityIcon = (action: string) => {
    return activityTypeIcons[action] || "📝";
  };

  return (
    <DepartmentLayout
      title="Admin Dashboard"
      icon={Shield}
      headerActions={
        <Button onClick={() => setAssignTaskOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Task
        </Button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-muted", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="staff">Staff Overview</TabsTrigger>
          <TabsTrigger value="assignments">Patient Assignments</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Staff Overview Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>All Staff Members</CardTitle>
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search staff..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-48"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Depts</SelectItem>
                      <SelectItem value="IPD">IPD</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="OPD">OPD</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {staffLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {staff.avatar || getInitials(staff.name)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-xs text-muted-foreground">{staff.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{staff.role}</Badge>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              staff.isActive ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {staff.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Patient-Staff Assignments</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Assigned Nurse</TableHead>
                    <TableHead>Assigned Doctor</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.slice(0, 10).map((patient) => {
                    const nurse = patient.attendingNurse && typeof patient.attendingNurse !== "string"
                      ? (patient.attendingNurse as User) : null;
                    const doctor = patient.attendingDoctor && typeof patient.attendingDoctor !== "string"
                      ? (patient.attendingDoctor as User) : null;

                    return (
                      <TableRow key={patient._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {getInitials(patient.name)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">{patient.patientId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              patient.status === "critical" && "bg-destructive/10 text-destructive",
                              patient.status === "warning" && "bg-amber-500/10 text-amber-600",
                              patient.status === "normal" && "bg-green-500/10 text-green-600"
                            )}
                          >
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {nurse ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[10px] font-semibold text-primary">
                                  {getInitials(nurse.name)}
                                </span>
                              </div>
                              <span className="text-sm">{nurse.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {doctor ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <span className="text-[10px] font-semibold text-blue-600">
                                  {getInitials(doctor.name)}
                                </span>
                              </div>
                              <span className="text-sm">{doctor.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((log) => (
                    <div
                      key={log._id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-2xl">{getActivityIcon(log.action)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{getActivityUser(log)}</span>
                          <span className="text-muted-foreground">{log.action}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{log.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignTaskModal open={assignTaskOpen} onOpenChange={setAssignTaskOpen} />
    </DepartmentLayout>
  );
}
