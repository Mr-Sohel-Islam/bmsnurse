import { useState } from "react";
import { 
  Users, 
  Bed, 
  AlertTriangle, 
  Activity,
  Building2,
  Siren,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DepartmentTabs } from "@/components/dashboard/DepartmentTabs";
import { BedOccupancyCard } from "@/components/dashboard/BedOccupancyCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { PatientDetailModal } from "@/components/modals/PatientDetailModal";
import { mockPatients, type Patient } from "@/data/mockPatients";

const Index = () => {
  const [sidebarCollapsed] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const stats = {
    totalPatients: mockPatients.length,
    criticalPatients: mockPatients.filter((p) => p.status === 'critical').length,
    opdPatients: mockPatients.filter((p) => p.department === 'OPD').length,
    ipdPatients: mockPatients.filter((p) => p.department === 'IPD').length,
    emergencyPatients: mockPatients.filter((p) => p.department === 'Emergency').length,
    inBedPatients: mockPatients.filter((p) => p.isInBed).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopHeader sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`transition-all duration-300 pt-20 pb-8 px-6 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Sarah. Here's your patient overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Critical"
            value={stats.criticalPatients}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatsCard
            title="OPD Today"
            value={stats.opdPatients}
            icon={Building2}
            variant="default"
          />
          <StatsCard
            title="IPD Admitted"
            value={stats.ipdPatients}
            icon={Bed}
            variant="accent"
          />
          <StatsCard
            title="Emergency"
            value={stats.emergencyPatients}
            icon={Siren}
            variant="warning"
          />
          <StatsCard
            title="In Bed Now"
            value={stats.inBedPatients}
            icon={Activity}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patients by Department */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActionsCard />
            <DepartmentTabs 
              patients={mockPatients} 
              onViewPatient={handleViewPatient}
            />
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6">
            <AlertsPanel />
            <BedOccupancyCard />
          </div>
        </div>
      </main>

      <PatientDetailModal
        patient={selectedPatient}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Index;
