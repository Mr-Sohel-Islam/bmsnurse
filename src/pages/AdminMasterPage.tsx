import { useState } from "react";
import { 
  Shield, 
  Users, 
  Activity, 
  Clock, 
  Search, 
  Filter,
  UserCheck,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus
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
import { mockStaff, mockActivityLogs, mockSchedule } from "@/data/mockStaff";
import { mockPatients } from "@/data/mockPatients";
import { AssignTaskModal } from "@/components/tasks/AssignTaskModal";
import { cn } from "@/lib/utils";

const statusColors = {
  online: "bg-green-500",
  busy: "bg-yellow-500",
  "on-break": "bg-orange-500",
  offline: "bg-muted-foreground",
};

const statusLabels = {
  online: "Online",
  busy: "Busy",
  "on-break": "On Break",
  offline: "Offline",
};

const activityTypeIcons = {
  task: "📋",
  patient: "🏥",
  medication: "💊",
  alert: "🔔",
  login: "🔐",
  logout: "🚪",
};

export default function AdminMasterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [assignTaskOpen, setAssignTaskOpen] = useState(false);

  const filteredStaff = mockStaff.filter((staff) => {
    if (searchQuery && !staff.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (roleFilter !== "all" && staff.role !== roleFilter) return false;
    if (departmentFilter !== "all" && staff.department !== departmentFilter) return false;
    return true;
  });

  const getPatientNames = (patientIds: string[]) => {
    return patientIds
      .map((id) => mockPatients.find((p) => p.id === id)?.name || id)
      .join(", ");
  };

  const stats = [
    { 
      label: "Total Staff", 
      value: mockStaff.length, 
      icon: Users, 
      color: "text-primary" 
    },
    { 
      label: "Currently Online", 
      value: mockStaff.filter((s) => s.status === "online").length, 
      icon: UserCheck, 
      color: "text-green-500" 
    },
    { 
      label: "On Duty Today", 
      value: mockSchedule.filter((s) => s.date === "2026-01-30").length, 
      icon: Clock, 
      color: "text-blue-500" 
    },
    { 
      label: "Active Alerts", 
      value: 5, 
      icon: AlertCircle, 
      color: "text-red-500" 
    },
  ];

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
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {staff.avatar}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                                statusColors[staff.status]
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.role}</Badge>
                      </TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            staff.status === "online" && "bg-green-500/10 text-green-600",
                            staff.status === "busy" && "bg-yellow-500/10 text-yellow-600",
                            staff.status === "on-break" && "bg-orange-500/10 text-orange-600",
                            staff.status === "offline" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {statusLabels[staff.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{staff.shift}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {staff.assignedPatients.length > 0
                            ? `${staff.assignedPatients.length} patients`
                            : "-"}
                        </span>
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
                    <TableHead>Room</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Assigned Nurse</TableHead>
                    <TableHead>Assigned Doctor</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPatients.slice(0, 6).map((patient) => {
                    const assignedNurse = mockStaff.find(
                      (s) => s.role === "Nurse" && s.assignedPatients.includes(patient.id)
                    );
                    const assignedDoctor = mockStaff.find(
                      (s) => s.role === "Doctor" && s.assignedPatients.includes(patient.id)
                    );

                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {patient.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">{patient.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.roomNumber || patient.bedNumber || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              patient.status === "critical" && "bg-destructive/10 text-destructive",
                              patient.status === "warning" && "bg-amber-500/10 text-amber-600",
                              patient.status === "stable" && "bg-green-500/10 text-green-600",
                              patient.status === "normal" && "bg-primary/10 text-primary"
                            )}
                          >
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignedNurse ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[10px] font-semibold text-primary">
                                  {assignedNurse.avatar}
                                </span>
                              </div>
                              <span className="text-sm">{assignedNurse.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {assignedDoctor ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <span className="text-[10px] font-semibold text-blue-600">
                                  {assignedDoctor.avatar}
                                </span>
                              </div>
                              <span className="text-sm">{assignedDoctor.name}</span>
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
              <div className="space-y-4">
                {mockActivityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-2xl">{activityTypeIcons[log.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{log.staffName}</span>
                        <span className="text-muted-foreground">{log.action}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{log.target}</p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignTaskModal open={assignTaskOpen} onOpenChange={setAssignTaskOpen} />
    </DepartmentLayout>
  );
}
