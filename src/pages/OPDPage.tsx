import { useState, useMemo } from "react";
import { Building2, Users, Clock, CheckCircle, Calendar } from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { PatientFilters } from "@/components/filters/PatientFilters";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { AppointmentQueue } from "@/components/opd/AppointmentQueue";
import { PatientDetailModal } from "@/components/modals/PatientDetailModal";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { mockPatients, type Patient, type PatientStatus } from "@/data/mockPatients";

const OPDPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const [nurseFilter, setNurseFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const opdPatients = mockPatients.filter((p) => p.department === 'OPD');
  const nurses = [...new Set(opdPatients.map((p) => p.attendingNurse))];

  const filteredPatients = useMemo(() => {
    return opdPatients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesNurse = nurseFilter === 'all' || patient.attendingNurse === nurseFilter;
      return matchesSearch && matchesStatus && matchesNurse;
    });
  }, [opdPatients, searchQuery, statusFilter, nurseFilter]);

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
            <div className="p-3 rounded-xl bg-dept-opd/10">
              <Building2 className="h-8 w-8 text-dept-opd" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Outpatient Department</h1>
              <p className="text-muted-foreground">
                Manage consultations, appointments, and walk-in patients
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            View Schedule
          </Button>
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Register Patient
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Today's Appointments"
          value={12}
          icon={Calendar}
          variant="primary"
        />
        <StatsCard
          title="Waiting"
          value={4}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="In Consultation"
          value={2}
          icon={Users}
          variant="accent"
        />
        <StatsCard
          title="Completed"
          value={6}
          icon={CheckCircle}
          variant="default"
        />
      </div>

      {/* Appointment Queue */}
      <div className="mb-8">
        <AppointmentQueue />
      </div>

      {/* Filters */}
      <div className="mb-6">
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
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground bg-card rounded-xl border">
            No patients found matching your filters
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onViewDetails={handleViewPatient}
            />
          ))
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

export default OPDPage;
