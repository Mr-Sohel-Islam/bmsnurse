import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LogOut, CheckCircle, Clock, FileText, Pill, CreditCard, Loader2 } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { useMemo } from "react";
import type { Patient } from "@/types/api";

export function DischargePanel() {
  const { data: patientsResponse, isLoading } = usePatients({
    department: 'IPD',
    status: 'normal',
    limit: 10,
  });

  const dischargeCandidates = useMemo(() => {
    const patients = patientsResponse?.data || [];
    // Patients with 'normal' status in IPD are likely discharge candidates
    return patients.map((p) => {
      const bedRef = p.bed;
      const bedNumber = typeof bedRef === 'object' && bedRef ? bedRef.bedNumber : 'N/A';
      const daysSinceAdmission = Math.floor(
        (Date.now() - new Date(p.admissionDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      // Estimate discharge progress based on days admitted
      const progress = Math.min(95, 50 + daysSinceAdmission * 10);

      const pendingTasks: string[] = [];
      if (progress < 70) pendingTasks.push('Physical therapy evaluation');
      if (progress < 80) pendingTasks.push('Medication review');
      if (progress < 90) pendingTasks.push('Home care instructions');
      if (progress < 95) pendingTasks.push('Discharge summary');
      if (pendingTasks.length === 0) pendingTasks.push('Final vitals check');

      return {
        id: p.patientId || p._id,
        name: p.name,
        bedNumber,
        diagnosis: p.diagnosis || 'Not specified',
        expectedDischarge: p.dischargeDate || '',
        progress,
        pendingTasks,
      };
    });
  }, [patientsResponse]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="h-5 w-5 text-primary" />
          Upcoming Discharges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : dischargeCandidates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <LogOut className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No discharge candidates</p>
          </div>
        ) : (
          dischargeCandidates.map((patient) => (
            <div key={patient.id} className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.bedNumber} • {patient.diagnosis}
                  </p>
                </div>
                {patient.expectedDischarge && (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(patient.expectedDischarge).toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Discharge readiness</span>
                  <span className="font-medium">{patient.progress}%</span>
                </div>
                <Progress value={patient.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Pending Tasks:</p>
                {patient.pendingTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded border flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <FileText className="h-4 w-4" />
                  Summary
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <Pill className="h-4 w-4" />
                  Medications
                </Button>
                <Button size="sm" className="flex-1 gap-1">
                  <CreditCard className="h-4 w-4" />
                  Process
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
