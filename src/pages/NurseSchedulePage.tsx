import { useState } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockStaff, mockSchedule } from "@/data/mockStaff";
import { cn } from "@/lib/utils";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const shiftColors = {
  morning: "bg-amber-500/10 text-amber-600 border-amber-200",
  afternoon: "bg-blue-500/10 text-blue-600 border-blue-200",
  night: "bg-purple-500/10 text-purple-600 border-purple-200",
};

const statusColors = {
  scheduled: "bg-muted text-muted-foreground",
  "in-progress": "bg-green-500/10 text-green-600",
  completed: "bg-primary/10 text-primary",
  absent: "bg-red-500/10 text-red-600",
};

export default function NurseSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date("2026-01-26")); // Start of week
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");

  const nurses = mockStaff.filter((s) => s.role === "Nurse");
  const filteredNurses = nurses.filter((nurse) => {
    if (departmentFilter !== "all" && nurse.department !== departmentFilter) return false;
    return true;
  });

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

  const getShiftForNurse = (nurseId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return mockSchedule.find(
      (s) => s.staffId === nurseId && s.date === dateStr
    );
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
    const today = new Date("2026-01-30");
    return date.toDateString() === today.toDateString();
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
              <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date("2026-01-26"))}>
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
                <tr key={nurse.id} className="border-b hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{nurse.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{nurse.name}</p>
                        <p className="text-xs text-muted-foreground">{nurse.department}</p>
                      </div>
                    </div>
                  </td>
                  {weekDates.map((date, i) => {
                    const shift = getShiftForNurse(nurse.id, date);
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
                              shiftColors[shift.shiftType]
                            )}
                          >
                            <div className="font-medium capitalize">{shift.shiftType}</div>
                            <div className="text-[10px] opacity-75">
                              {shift.startTime} - {shift.endTime}
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn("mt-1 text-[10px]", statusColors[shift.status])}
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
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", shiftColors.morning.split(" ")[0])} />
          <span>Morning (6AM-2PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", shiftColors.afternoon.split(" ")[0])} />
          <span>Afternoon (2PM-10PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", shiftColors.night.split(" ")[0])} />
          <span>Night (10PM-6AM)</span>
        </div>
      </div>
    </DepartmentLayout>
  );
}
