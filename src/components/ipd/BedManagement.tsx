import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, User, Clock, Loader2 } from "lucide-react";
import { useBeds } from "@/hooks/useBeds";
import type { Bed as BedType, Patient } from "@/types/api";

const statusStyles = {
  occupied: 'border-primary bg-primary/5',
  available: 'border-status-stable bg-status-stable/5',
  maintenance: 'border-muted bg-muted/50',
  reserved: 'border-status-warning bg-status-warning/5',
};

const patientStatusStyles = {
  critical: 'bg-status-critical',
  warning: 'bg-status-warning',
  normal: 'bg-status-stable',
};

export function BedManagement() {
  const { data: beds = [], isLoading } = useBeds({ department: 'IPD' });

  const stats = {
    total: beds.length,
    occupied: beds.filter((b) => b.status === 'occupied').length,
    available: beds.filter((b) => b.status === 'available').length,
    maintenance: beds.filter((b) => b.status === 'maintenance').length,
  };

  const getPatientInfo = (bed: BedType) => {
    if (!bed.currentPatient || typeof bed.currentPatient === 'string') return null;
    const p = bed.currentPatient as Patient;
    return {
      name: p.name,
      id: p.patientId || p._id,
      admissionDate: p.admissionDate,
      status: p.status as 'critical' | 'warning' | 'normal',
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Bed Management
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Bed Management
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{stats.occupied} Occupied</Badge>
            <Badge className="bg-status-stable text-white">{stats.available} Available</Badge>
            <Badge variant="outline">{stats.maintenance} Maintenance</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {beds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bed className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No beds found for this department</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {beds.map((bed) => {
              const patient = getPatientInfo(bed);
              return (
                <div
                  key={bed._id}
                  className={`p-4 rounded-xl border-2 ${statusStyles[bed.status]} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span className="font-bold">{bed.bedNumber}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{bed.ward}</span>
                  </div>

                  {bed.status === 'occupied' && patient && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.id}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${patientStatusStyles[patient.status] || 'bg-status-stable'}`} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Since {new Date(patient.admissionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {bed.status === 'available' && (
                    <div className="text-center py-2">
                      <Badge className="bg-status-stable text-white">Available</Badge>
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        Assign Patient
                      </Button>
                    </div>
                  )}

                  {bed.status === 'maintenance' && (
                    <div className="text-center py-2">
                      <Badge variant="secondary">Under Maintenance</Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {bed.lastSanitized
                          ? `Sanitized: ${new Date(bed.lastSanitized).toLocaleDateString()}`
                          : 'Est. available: TBD'}
                      </p>
                    </div>
                  )}

                  {bed.status === 'reserved' && (
                    <div className="text-center py-2">
                      <Badge className="bg-status-warning text-white">Reserved</Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {bed.notes || 'For incoming transfer'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
