import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import type { PatientStatus } from "@/data/mockPatients";

interface Nurse {
  id: string;
  name: string;
  shift: string;
  department: string;
}

interface PatientFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: PatientStatus | 'all';
  onStatusChange: (value: PatientStatus | 'all') => void;
  nurseFilter: string;
  onNurseChange: (value: string) => void;
  nurses: string[] | Nurse[];
  onClearFilters: () => void;
}

export function PatientFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  nurseFilter,
  onNurseChange,
  nurses,
  onClearFilters,
}: PatientFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || nurseFilter !== 'all';

  // Normalize nurses to handle both string[] and Nurse[] formats
  const nurseNames = nurses.map((nurse) => 
    typeof nurse === 'string' ? nurse : nurse.name
  );

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-xl border">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or diagnosis..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as PatientStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[140px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Needs Attention</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={nurseFilter} onValueChange={onNurseChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background">
            <SelectValue placeholder="Attending Nurse" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Nurses</SelectItem>
            {nurseNames.map((nurse) => (
              <SelectItem key={nurse} value={nurse}>
                {nurse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 shrink-0">
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}
