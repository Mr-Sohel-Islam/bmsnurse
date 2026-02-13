import { useState, useMemo } from "react";
import { Bed, Users, AlertTriangle, LogOut, Plus, Loader2 } from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { PatientFilters } from "@/components/filters/PatientFilters";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { BedManagement } from "@/components/ipd/BedManagement";
import { DischargePanel } from "@/components/ipd/DischargePanel";
import { PatientDetailModal } from "@/components/modals/PatientDetailModal";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/hooks/usePatients";
import { mapApiPatientToUI } from "@/utils/patientMapper";
import type { Patient, PatientStatus } from "@/data/mockPatients";

const IPDPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const [nurseFilter, setNurseFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: patientsResponse, isLoading } = usePatients({
    department: 'IPD',
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 100,
  });

  const ipdPatients = useMemo(() => {
    return (patientsResponse?.data || []).map((p) => mapApiPatientToUI(p));
  }, [patientsResponse]);

  const nurses = [...new Set(ipdPatients.map((p) => p.attendingNurse))];

  const filteredPatients = useMemo(() => {
    return ipdPatients.filter((patient) => {
      const matchesSearch =
        !searchQuery ||
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesNurse = nurseFilter === 'all' || patient.attendingNurse === nurseFilter;
      return matchesSearch && matchesStatus && matchesNurse;
    });
  }, [ipdPatients, searchQuery, statusFilter, nurseFilter]);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter('all');
    setNurseFilter('all');
  };

  const stats = {
    total: ipdPatients.length,
    critical: ipdPatients.filter((p) => p.status === 'critical').length,
    inBed: ipdPatients.filter((p) => p.isInBed).length,
    pendingDischarge: ipdPatients.filter((p) => p.status === 'stable').length,
  };

  return (
    <DepartmentLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-dept-ipd/10">
              <Bed className="h-8 w-8 text-dept-ipd" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Inpatient Department</h1>
              <p className="text-muted-foreground">
                Manage admitted patients, beds, and discharge planning
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Discharge Planning
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Admit Patient
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Admitted"
          value={stats.total}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Critical Patients"
          value={stats.critical}
          icon={AlertTriangle}
          variant="critical"
        />
        <StatsCard
          title="Currently In Bed"
          value={stats.inBed}
          icon={Bed}
          variant="accent"
        />
        <StatsCard
          title="Pending Discharge"
          value={stats.pendingDischarge}
          icon={LogOut}
          variant="default"
        />
      </div>

      {/* Bed Management */}
      <div className="mb-8">
        <BedManagement />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-2 space-y-6">
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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
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
          )}
        </div>

        {/* Discharge Panel */}
        <div>
          <DischargePanel />
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

export default IPDPage;
