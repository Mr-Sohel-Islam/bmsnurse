import { useState, useMemo } from "react";
import { Siren, Plus, Phone, Radio } from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { PatientFilters } from "@/components/filters/PatientFilters";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { TriageQueue } from "@/components/emergency/TriageQueue";
import { EmergencyStats } from "@/components/emergency/EmergencyStats";
import { PatientDetailModal } from "@/components/modals/PatientDetailModal";
import { Button } from "@/components/ui/button";
import { mockPatients, type Patient, type PatientStatus } from "@/data/mockPatients";

const EmergencyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const [nurseFilter, setNurseFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const emergencyPatients = mockPatients.filter((p) => p.department === 'Emergency');
  const nurses = [...new Set(emergencyPatients.map((p) => p.attendingNurse))];

  const filteredPatients = useMemo(() => {
    return emergencyPatients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesNurse = nurseFilter === 'all' || patient.attendingNurse === nurseFilter;
      return matchesSearch && matchesStatus && matchesNurse;
    });
  }, [emergencyPatients, searchQuery, statusFilter, nurseFilter]);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter('all');
    setNurseFilter('all');
  };

  return (
    <DepartmentLayout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 rounded-xl bg-dept-emergency/10 animate-pulse">
              <Siren className="h-6 w-6 md:h-8 md:w-8 text-dept-emergency" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Emergency Department</h1>
              <p className="text-sm md:text-base text-muted-foreground hidden sm:block">
                Triage, critical care, and emergency response management
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Radio className="h-4 w-4" />
            <span className="hidden sm:inline">Dispatch</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Specialist</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span> Emergency
          </Button>
        </div>
      </div>

      {/* Emergency Stats */}
      <div className="mb-6 md:mb-8">
        <EmergencyStats />
      </div>

      {/* Triage Queue */}
      <div className="mb-6 md:mb-8">
        <TriageQueue />
      </div>

      {/* Filters & Patient List */}
      <div className="space-y-4 md:space-y-6">
        <PatientFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          nurseFilter={nurseFilter}
          onNurseChange={setNurseFilter}
          nurses={nurses}
          onClearFilters={clearFilters}
        />

        <h2 className="text-lg md:text-xl font-semibold">Current ER Patients</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full text-center py-8 md:py-12 text-muted-foreground bg-card rounded-xl border">
              No patients found matching your filters
            </div>
          ) : (
            filteredPatients
              .sort((a, b) => {
                const priority = { critical: 0, warning: 1, stable: 2, normal: 3 };
                return priority[a.status] - priority[b.status];
              })
              .map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onViewDetails={handleViewPatient}
                />
              ))
          )}
        </div>
      </div>

      <PatientDetailModal
        patient={selectedPatient}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </DepartmentLayout>
  );
};

export default EmergencyPage;
