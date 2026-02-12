import { useState } from "react";
import { 
  Users, 
  Bed, 
  AlertTriangle, 
  Activity,
  Building2,
  Siren,
  Loader2,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DepartmentTabs } from "@/components/dashboard/DepartmentTabs";
import { BedOccupancyCard } from "@/components/dashboard/BedOccupancyCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { PatientDetailModal } from "@/components/modals/PatientDetailModal";
import { usePatients, usePatientStats } from "@/hooks/usePatients";
import { useAuthContext } from "@/contexts/AuthContext";
import { mapApiPatientToUI } from "@/utils/patientMapper";
import type { Patient } from "@/data/mockPatients";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const [sidebarCollapsed] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuthContext();

  const { data: patientsResponse, isLoading: isLoadingPatients } = usePatients({ limit: 100 });
  const { data: patientStats } = usePatientStats();

  const patients = (patientsResponse?.data || []).map((p) => mapApiPatientToUI(p));

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const stats = {
    totalPatients: patientStats?.total ?? patients.length,
    criticalPatients: patientStats?.critical ?? patients.filter((p) => p.status === 'critical').length,
    opdPatients: patientStats?.byDepartment?.OPD ?? patients.filter((p) => p.department === 'OPD').length,
    ipdPatients: patientStats?.byDepartment?.IPD ?? patients.filter((p) => p.department === 'IPD').length,
    emergencyPatients: patientStats?.byDepartment?.Emergency ?? patients.filter((p) => p.department === 'Emergency').length,
    inBedPatients: patientStats?.inBed ?? patients.filter((p) => p.isInBed).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopHeader sidebarCollapsed={sidebarCollapsed} />

      <main
        className={cn(
          "transition-all duration-300 pt-20 pb-8 px-4 md:px-6",
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back, {user?.name || 'User'}. Here's your patient overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} variant="primary" />
          <StatsCard title="Critical" value={stats.criticalPatients} icon={AlertTriangle} variant="critical" />
          <StatsCard title="OPD Today" value={stats.opdPatients} icon={Building2} variant="default" />
          <StatsCard title="IPD Admitted" value={stats.ipdPatients} icon={Bed} variant="accent" />
          <StatsCard title="Emergency" value={stats.emergencyPatients} icon={Siren} variant="warning" />
          <StatsCard title="In Bed Now" value={stats.inBedPatients} icon={Activity} variant="default" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <QuickActionsCard />
            {isLoadingPatients ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DepartmentTabs 
                patients={patients} 
                onViewPatient={handleViewPatient}
              />
            )}
          </div>

          <div className="space-y-4 md:space-y-6">
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
