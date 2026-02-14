import { Card, CardContent } from "@/components/ui/card";
import { Siren, Clock, Bed, Users, AlertTriangle, Ambulance, Loader2 } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { useBeds } from "@/hooks/useBeds";

export function EmergencyStats() {
  const { data: patientsResponse, isLoading: loadingPatients } = usePatients({
    department: 'Emergency',
    limit: 100,
  });
  const { data: beds = [], isLoading: loadingBeds } = useBeds({ department: 'Emergency' });

  const patients = patientsResponse?.data || [];
  const isLoading = loadingPatients || loadingBeds;

  const stats = [
    { label: 'Active Cases', value: patients.length, icon: Users, color: 'text-dept-emergency bg-dept-emergency/10' },
    { label: 'Critical', value: patients.filter((p) => p.status === 'critical').length, icon: AlertTriangle, color: 'text-status-critical bg-status-critical/10', pulse: true },
    { label: 'Available Beds', value: beds.filter((b) => b.status === 'available').length, icon: Bed, color: 'text-status-stable bg-status-stable/10' },
    { label: 'Warning', value: patients.filter((p) => p.status === 'warning').length, icon: Clock, color: 'text-status-warning bg-status-warning/10' },
    { label: 'In Bed', value: patients.filter((p) => p.isInBed).length, icon: Ambulance, color: 'text-primary bg-primary/10' },
    { label: 'Total Beds', value: beds.length, icon: Siren, color: 'text-muted-foreground bg-muted' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-center h-[76px]">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={stat.pulse && Number(stat.value) > 0 ? 'animate-pulse' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
