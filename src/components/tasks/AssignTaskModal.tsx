import { useState } from "react";
import { X, Search, Clock, AlertCircle, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockNurses = [
  { id: "1", name: "Sarah Johnson", role: "Head Nurse", department: "IPD", avatar: "SJ", available: true },
  { id: "2", name: "Michael Chen", role: "Staff Nurse", department: "ICU", avatar: "MC", available: true },
  { id: "3", name: "Emily Davis", role: "Staff Nurse", department: "Emergency", avatar: "ED", available: false },
  { id: "4", name: "Robert Wilson", role: "Senior Nurse", department: "OPD", avatar: "RW", available: true },
];

const mockPatients = [
  { id: "P001", name: "John Smith", room: "ICU-201", condition: "Critical" },
  { id: "P002", name: "Mary Johnson", room: "IPD-105", condition: "Stable" },
  { id: "P003", name: "David Brown", room: "IPD-108", condition: "Fair" },
  { id: "P004", name: "Lisa Anderson", room: "OPD", condition: "Stable" },
];

const taskTypes = [
  "Medication Administration",
  "Vital Signs Check",
  "Patient Assessment",
  "Wound Care",
  "IV Management",
  "Patient Education",
  "Discharge Preparation",
  "Lab Sample Collection",
  "Other",
];

export function AssignTaskModal({ open, onOpenChange }: AssignTaskModalProps) {
  const [selectedNurse, setSelectedNurse] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [taskType, setTaskType] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [nurseSearch, setNurseSearch] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("");

  const filteredNurses = mockNurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(nurseSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Assign New Task</DialogTitle>
          <DialogDescription>
            Create and assign a task to a nurse or healthcare staff member
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Task Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-type">Task Type</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <div className="flex gap-2">
                {[
                  { value: "low", label: "Low", color: "bg-green-500/10 text-green-600 border-green-200" },
                  { value: "medium", label: "Medium", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
                  { value: "high", label: "High", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
                  { value: "critical", label: "Critical", color: "bg-red-500/10 text-red-600 border-red-200" },
                ].map((p) => (
                  <Button
                    key={p.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 transition-all",
                      priority === p.value && p.color
                    )}
                    onClick={() => setPriority(p.value)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient">Assign to Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{patient.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{patient.room}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          patient.condition === "Critical" && "bg-red-500/10 text-red-600",
                          patient.condition === "Fair" && "bg-yellow-500/10 text-yellow-600",
                          patient.condition === "Stable" && "bg-green-500/10 text-green-600"
                        )}
                      >
                        {patient.condition}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nurse Selection */}
          <div className="space-y-3">
            <Label>Assign to Staff</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search nurses..."
                value={nurseSearch}
                onChange={(e) => setNurseSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filteredNurses.map((nurse) => (
                <div
                  key={nurse.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedNurse === nurse.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/30",
                    !nurse.available && "opacity-50"
                  )}
                  onClick={() => nurse.available && setSelectedNurse(nurse.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{nurse.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{nurse.name}</p>
                    <p className="text-xs text-muted-foreground">{nurse.role} • {nurse.department}</p>
                  </div>
                  {nurse.available ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Busy</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Due Time */}
          <div className="space-y-2">
            <Label htmlFor="due-time">Due Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="due-time"
                type="datetime-local"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              placeholder="Enter detailed task instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
