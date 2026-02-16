import { useState, useMemo } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchedules } from "@/hooks/useSchedules";
import { useNurses } from "@/hooks/useStaff";
import { cn } from "@/lib/utils";
import type { Schedule, User } from "@/types/api";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const shiftColors: Record<string, string> = {
  morning: "bg-amber-500/10 text-amber-600 border-amber-200",
  afternoon: "bg-blue-500/10 text-blue-600 border-blue-200",
  night: "bg-purple-500/10 text-purple-600 border-purple-200",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-muted text-muted-foreground",
  confirmed: "bg-green-500/10 text-green-600",
  completed: "bg-primary/10 text-primary",
  absent: "bg-red-500/10 text-red-600",
  swapped: "bg-orange-500/10 text-orange-600",
};

export default function NurseSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
  });
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");

  const weekStart = currentWeek.toISOString().split("T")[0];
  const { data: schedules = [], isLoading: schedulesLoading } = useSchedules({ department: departmentFilter !== "all" ? departmentFilter : undefined, shift: shiftFilter !== "all" ? shiftFilter : undefined });
  const { data: nurses = [], isLoading: nursesLoading } = useNurses();

  const isLoading = schedulesLoading || nursesLoading;

  const filteredNurses = useMemo(() => {
    if (departmentFilter === "all") return nurses;
    return nurses.filter((n) => n.department === departmentFilter);
  }, [nurses, departmentFilter]);

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const getShiftForNurse = (nurseId: string, date: Date): Schedule | undefined => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules.find((s) => {
      const staffId = typeof s.staff === "string" ? s.staff : (s.staff as User)?.id;
      const schedDate = new Date(s.date).toISOString().split("T")[0];
      return staffId === nurseId && schedDate === dateStr;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStaffName = (staff: string | User) => {
    if (typeof staff === "string") return staff;
    return staff.name;
  };

  const getStaffInitials = (staff: string | User) => {
    const name = typeof staff === "string" ? staff : staff.name;
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const getStaffDept = (staff: string | User) => {
    if (typeof staff === "string") return "";
    return staff.department;
  };

  return (
    <DepartmentLayout
      title="Nurse Schedule"
      icon={Calendar}
      headerActions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Shift
        </Button>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium min-w-32 text-center">
                {formatDateHeader(weekDates[0])} - {formatDateHeader(weekDates[6])}
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                const today = new Date();
                const day = today.getDay();
                const start = new Date(today);
                start.setDate(today.getDate() - day);
                start.setHours(0, 0, 0, 0);
                setCurrentWeek(start);
              }}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
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
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredNurses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No nurses found</p>
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground w-48">Nurse</th>
                  {weekDates.map((date, i) => (
                    <th
                      key={i}
                      className={cn(
                        "text-center p-4 font-medium",
                        isToday(date) ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="text-xs text-muted-foreground">{weekDays[date.getDay()]}</div>
                      <div className={cn("text-sm", isToday(date) && "text-primary font-bold")}>
                        {date.getDate()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredNurses.map((nurse) => (
                  <tr key={nurse._id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {nurse.avatar || nurse.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{nurse.name}</p>
                          <p className="text-xs text-muted-foreground">{nurse.department}</p>
                        </div>
                      </div>
                    </td>
                    {weekDates.map((date, i) => {
                      const shift = getShiftForNurse(nurse._id, date);
                      return (
                        <td
                          key={i}
                          className={cn(
                            "p-2 text-center",
                            isToday(date) ? "bg-primary/5" : ""
                          )}
                        >
                          {shift ? (
                            <div
                              className={cn(
                                "p-2 rounded-lg border text-xs",
                                shiftColors[shift.shift] || "bg-muted"
                              )}
                            >
                              <div className="font-medium capitalize">{shift.shift}</div>
                              <div className="text-[10px] opacity-75">
                                {shift.shiftStart} - {shift.shiftEnd}
                              </div>
                              <Badge
                                variant="secondary"
                                className={cn("mt-1 text-[10px]", statusColors[shift.status] || "")}
                              >
                                {shift.status}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-muted-foreground/50 text-xs">Off</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", "bg-amber-500/10")} />
          <span>Morning (6AM-2PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", "bg-blue-500/10")} />
          <span>Afternoon (2PM-10PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", "bg-purple-500/10")} />
          <span>Night (10PM-6AM)</span>
        </div>
      </div>
    </DepartmentLayout>
  );
}
