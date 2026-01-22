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
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-dept-emergency/10 animate-pulse">
              <Siren className="h-8 w-8 text-dept-emergency" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Emergency Department</h1>
              <p className="text-muted-foreground">
                Triage, critical care, and emergency response management
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Radio className="h-4 w-4" />
            Dispatch
          </Button>
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Call Specialist
          </Button>
          <Button variant="destructive" className="gap-2">
            <Plus className="h-4 w-4" />
            New Emergency
          </Button>
        </div>
      </div>

      {/* Emergency Stats */}
      <div className="mb-8">
        <EmergencyStats />
      </div>

      {/* Triage Queue */}
      <div className="mb-8">
        <TriageQueue />
      </div>

      {/* Filters & Patient List */}
      <div className="space-y-6">
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

        <h2 className="text-xl font-semibold">Current ER Patients</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPatients.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground bg-card rounded-xl border">
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
