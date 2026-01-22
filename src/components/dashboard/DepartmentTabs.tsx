import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PatientCard } from "./PatientCard";
import type { Patient, Department } from "@/data/mockPatients";
import { Building2, Bed, Siren } from "lucide-react";

interface DepartmentTabsProps {
  patients: Patient[];
  onViewPatient?: (patient: Patient) => void;
}

const deptConfig: Record<Department, { icon: React.ElementType; color: string }> = {
  OPD: { icon: Building2, color: 'text-dept-opd' },
  IPD: { icon: Bed, color: 'text-dept-ipd' },
  Emergency: { icon: Siren, color: 'text-dept-emergency' },
};

export function DepartmentTabs({ patients, onViewPatient }: DepartmentTabsProps) {
  const departments: Department[] = ['OPD', 'IPD', 'Emergency'];

  const getPatientsByDept = (dept: Department) => 
    patients.filter((p) => p.department === dept);

  const getCriticalCount = (dept: Department) =>
    getPatientsByDept(dept).filter((p) => p.status === 'critical').length;

  return (
    <Tabs defaultValue="IPD" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {departments.map((dept) => {
          const config = deptConfig[dept];
          const Icon = config.icon;
          const criticalCount = getCriticalCount(dept);
          const patientCount = getPatientsByDept(dept).length;

          return (
            <TabsTrigger
              key={dept}
              value={dept}
              className="flex items-center gap-2 relative"
            >
              <Icon className={`h-4 w-4 ${config.color}`} />
              <span>{dept}</span>
              <Badge variant="secondary" className="ml-1">
                {patientCount}
              </Badge>
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-critical text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {criticalCount}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {departments.map((dept) => (
        <TabsContent key={dept} value={dept} className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getPatientsByDept(dept).length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No patients in {dept} department
              </div>
            ) : (
              getPatientsByDept(dept)
                .sort((a, b) => {
                  const priority = { critical: 0, warning: 1, stable: 2, normal: 3 };
                  return priority[a.status] - priority[b.status];
                })
                .map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onViewDetails={onViewPatient}
                  />
                ))
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
