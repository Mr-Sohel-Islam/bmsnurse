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

interface PatientFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: PatientStatus | 'all';
  onStatusChange: (value: PatientStatus | 'all') => void;
  nurseFilter: string;
  onNurseChange: (value: string) => void;
  nurses: string[];
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

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or diagnosis..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as PatientStatus | 'all')}>
        <SelectTrigger className="w-[160px] bg-background">
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
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Attending Nurse" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">All Nurses</SelectItem>
          {nurses.map((nurse) => (
            <SelectItem key={nurse} value={nurse}>
              {nurse}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
