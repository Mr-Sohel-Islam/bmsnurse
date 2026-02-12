import { useState, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { useMyTasks, useCompleteTask, useUpdateTask } from "@/hooks/useTasks";
import type { Task as ApiTask } from "@/types/api";
import { format } from "date-fns";

const taskTypeIcons: Record<string, React.ElementType> = {
  medication: Pill,
  vitals: Activity,
  documentation: FileText,
  procedure: ClipboardList,
  observation: ClipboardList,
  other: ClipboardList,
};

const priorityStyles: Record<string, string> = {
  high: "bg-status-critical/10 text-status-critical border-status-critical",
  urgent: "bg-status-critical/10 text-status-critical border-status-critical",
  medium: "bg-status-warning/10 text-status-warning border-status-warning",
  low: "bg-status-normal/10 text-status-normal border-status-normal",
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pending" },
  in_progress: { bg: "bg-primary/10", text: "text-primary", label: "In Progress" },
  completed: { bg: "bg-status-normal/10", text: "text-status-normal", label: "Completed" },
  cancelled: { bg: "bg-muted", text: "text-muted-foreground", label: "Cancelled" },
};

const TasksPage = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const { data: tasks = [], isLoading } = useMyTasks();
  const completeTask = useCompleteTask();
  const updateTask = useUpdateTask();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesType = filterType === "all" || task.type === filterType;
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      return matchesType && matchesPriority;
    });
  }, [tasks, filterType, filterPriority]);

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const toggleTaskComplete = (task: ApiTask) => {
    if (task.status === "completed") {
      updateTask.mutate({ id: task._id, data: { status: "pending" } });
    } else {
      completeTask.mutate({ id: task._id });
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const getPatientName = (task: ApiTask): string | undefined => {
    if (!task.patient) return undefined;
    if (typeof task.patient === 'object') return (task.patient as any).name;
    return undefined;
  };

  const TaskCard = ({ task }: { task: ApiTask }) => {
    const TypeIcon = taskTypeIcons[task.type] || ClipboardList;
    const statusStyle = statusStyles[task.status] || statusStyles.pending;
    const patientName = getPatientName(task);
    const isOverdue = task.status === 'pending' && new Date(task.dueDate) < new Date();

    return (
      <Card className={isOverdue ? "border-status-critical/50" : ""}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={() => toggleTaskComplete(task)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <TypeIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">{task.title}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <Badge variant="outline" className={`text-xs ${priorityStyles[task.priority] || ''}`}>
                  {task.priority}
                </Badge>
                <Badge className={`text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                  {isOverdue ? 'Overdue' : statusStyle.label}
                </Badge>
              </div>
              {task.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.dueDate), 'MMM d, h:mm a')}
                </span>
                {patientName && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-[100px]">{patientName}</span>
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
          <span className="hidden sm:inline">New</span> Task
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-status-warning/10">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-status-normal/10">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-status-normal" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[130px] sm:w-[150px]">
              <SelectValue placeholder="Task Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="vitals">Vitals</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="procedure">Procedure</SelectItem>
              <SelectItem value="observation">Observation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[130px] sm:w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="pending" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              Pending
              <Badge variant="secondary" className="ml-1 text-xs">{pendingTasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="hidden sm:inline">In </span>Progress
              <Badge variant="secondary" className="ml-1 text-xs">{inProgressTasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              Done
              <Badge variant="secondary" className="ml-1 text-xs">{completedTasks.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => <TaskCard key={task._id} task={task} />)
            ) : (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p>No pending tasks</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-3">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => <TaskCard key={task._id} task={task} />)
            ) : (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks in progress</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => <TaskCard key={task._id} task={task} />)
            ) : (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                <p>No completed tasks</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </DepartmentLayout>
  );
};

export default TasksPage;
