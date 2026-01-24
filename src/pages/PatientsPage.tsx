import { useState, useMemo } from "react";
import { Users, UserPlus, Download, Filter } from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { PatientFilters } from "@/components/filters/PatientFilters";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { PatientDetailModal } from "@/components/modals/PatientDetailModal";
import { Button } from "@/components/ui/button";
import { mockPatients, nursesList, type Patient } from "@/data/mockPatients";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Bed, AlertTriangle, Activity, Building2 } from "lucide-react";

const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "critical" | "warning" | "stable" | "normal">("all");
  const [nurseFilter, setNurseFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    return mockPatients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
      const matchesNurse = nurseFilter === "all" || patient.attendingNurse === nurseFilter;
      return matchesSearch && matchesStatus && matchesNurse;
    });
  }, [searchQuery, statusFilter, nurseFilter]);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setNurseFilter("all");
  };

  const stats = {
    total: mockPatients.length,
    critical: mockPatients.filter((p) => p.status === "critical").length,
    opd: mockPatients.filter((p) => p.department === "OPD").length,
    ipd: mockPatients.filter((p) => p.department === "IPD").length,
    emergency: mockPatients.filter((p) => p.department === "Emergency").length,
  };

  return (
    <DepartmentLayout
      title="All Patients"
      icon={Users}
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatsCard title="Total Patients" value={stats.total} icon={Users} variant="primary" />
        <StatsCard title="Critical" value={stats.critical} icon={AlertTriangle} variant="critical" />
        <StatsCard title="OPD" value={stats.opd} icon={Building2} variant="default" />
        <StatsCard title="IPD" value={stats.ipd} icon={Bed} variant="accent" />
        <StatsCard title="Emergency" value={stats.emergency} icon={Activity} variant="warning" />
      </div>

      {/* Filters */}
      <PatientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        nurseFilter={nurseFilter}
        onNurseChange={setNurseFilter}
        nurses={nursesList}
        onClearFilters={clearFilters}
      />

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onViewDetails={handleViewPatient}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm">Try adjusting your filters</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <PatientDetailModal
        patient={selectedPatient}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </DepartmentLayout>
  );
};

export default PatientsPage;
