import { useState } from "react";
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Pill,
  Activity,
  FileText,
  Filter,
} from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "medication" | "vitals" | "documentation" | "procedure" | "discharge";
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "overdue";
  dueTime: string;
  patientId?: string;
  patientName?: string;
  room?: string;
  assignedTo: string;
}

const mockTasks: Task[] = [
  {
    id: "T001",
    title: "Administer Insulin",
    description: "10 units subcutaneous before breakfast",
    type: "medication",
    priority: "high",
    status: "overdue",
    dueTime: "07:30 AM",
    patientId: "P005",
    patientName: "James Wilson",
    room: "IPD-201",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "T002",
    title: "Record Vital Signs",
    description: "Hourly monitoring for post-op patient",
    type: "vitals",
    priority: "high",
    status: "pending",
    dueTime: "08:00 AM",
    patientId: "P002",
    patientName: "Maria Garcia",
    room: "ICU-01",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "T003",
    title: "Discharge Summary",
    description: "Complete discharge documentation",
    type: "documentation",
    priority: "medium",
    status: "in-progress",
    dueTime: "10:00 AM",
    patientId: "P006",
    patientName: "Robert Chen",
    room: "IPD-105",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "T004",
    title: "IV Line Change",
    description: "Replace peripheral IV catheter",
    type: "procedure",
    priority: "medium",
    status: "pending",
    dueTime: "09:00 AM",
    patientId: "P001",
    patientName: "John Smith",
    room: "IPD-102",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "T005",
    title: "Patient Education",
    description: "Diabetes management education before discharge",
    type: "discharge",
    priority: "low",
    status: "pending",
    dueTime: "02:00 PM",
    patientId: "P005",
    patientName: "James Wilson",
    room: "IPD-201",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "T006",
    title: "Blood Pressure Check",
    description: "Monitor BP every 4 hours",
    type: "vitals",
    priority: "medium",
    status: "completed",
    dueTime: "06:00 AM",
    patientId: "P004",
    patientName: "Emily Brown",
    room: "IPD-108",
    assignedTo: "Sarah Johnson",
  },
];

const taskTypeIcons = {
  medication: Pill,
  vitals: Activity,
  documentation: FileText,
  procedure: ClipboardList,
  discharge: CheckCircle2,
};

const priorityStyles = {
  high: "bg-status-critical/10 text-status-critical border-status-critical",
  medium: "bg-status-warning/10 text-status-warning border-status-warning",
  low: "bg-status-normal/10 text-status-normal border-status-normal",
};

const statusStyles = {
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pending" },
  "in-progress": { bg: "bg-primary/10", text: "text-primary", label: "In Progress" },
  completed: { bg: "bg-status-normal/10", text: "text-status-normal", label: "Completed" },
  overdue: { bg: "bg-status-critical/10", text: "text-status-critical", label: "Overdue" },
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesType = filterType === "all" || task.type === filterType;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending" || t.status === "overdue");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const toggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
          : task
      )
    );
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const TypeIcon = taskTypeIcons[task.type];
    const statusStyle = statusStyles[task.status];

    return (
      <Card className={`${task.status === "overdue" ? "border-status-critical/50" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={() => toggleTaskComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium truncate">{task.title}</span>
                <Badge variant="outline" className={`text-xs ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </Badge>
                <Badge className={`text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.dueTime}
                </span>
                {task.patientName && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.patientName}
                  </span>
                )}
                {task.room && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {task.room}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DepartmentLayout
      title="Tasks"
      icon={ClipboardList}
      headerActions={
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-warning/10">
              <Clock className="h-5 w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-critical/10">
              <AlertCircle className="h-5 w-5 text-status-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-normal/10">
              <CheckCircle2 className="h-5 w-5 text-status-normal" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Task Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="vitals">Vitals</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="procedure">Procedure</SelectItem>
              <SelectItem value="discharge">Discharge</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Lists */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            <Badge variant="secondary" className="ml-1">
              {pendingTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="gap-2">
            In Progress
            <Badge variant="secondary" className="ml-1">
              {inProgressTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Completed
            <Badge variant="secondary" className="ml-1">
              {completedTasks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending tasks</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-3">
          {inProgressTasks.length > 0 ? (
            inProgressTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks in progress</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed tasks</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DepartmentLayout>
  );
};

export default TasksPage;
