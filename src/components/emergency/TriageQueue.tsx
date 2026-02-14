import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Siren, Clock, User, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { AssignBedModal } from "@/components/modals/AssignBedModal";
import type { Patient } from "@/types/api";
import { format } from "date-fns";

const triageLevelConfig = {
  1: { label: 'Resuscitation', color: 'bg-status-critical text-white', priority: 'Immediate' },
  2: { label: 'Emergent', color: 'bg-status-critical/80 text-white', priority: '< 15 min' },
  3: { label: 'Urgent', color: 'bg-status-warning text-white', priority: '< 30 min' },
  4: { label: 'Less Urgent', color: 'bg-dept-ipd text-white', priority: '< 60 min' },
  5: { label: 'Non-Urgent', color: 'bg-status-stable text-white', priority: '< 120 min' },
};

function getTriageLevel(patient: Patient): 1 | 2 | 3 | 4 | 5 {
  if (patient.status === 'critical') return 1;
  if (patient.status === 'warning') return 2;
  return 3;
}

function getWaitMinutes(admissionDate: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(admissionDate).getTime()) / 60000));
}

export function TriageQueue() {
  const [assignModal, setAssignModal] = useState<{ open: boolean; patientId: string; patientName: string }>({
    open: false, patientId: '', patientName: '',
  });

  const { data: patientsResponse, isLoading } = usePatients({
    department: 'Emergency',
    limit: 20,
  });

  const triagePatients = useMemo(() => {
    const patients = patientsResponse?.data || [];
    return patients
      .map((p) => {
        const bedRef = p.bed;
        const bedNumber = typeof bedRef === 'object' && bedRef ? bedRef.bedNumber : undefined;
        return {
          id: p.patientId || p._id,
          rawId: p._id,
          name: p.name,
          age: p.age,
          chiefComplaint: p.diagnosis || 'Awaiting assessment',
          triageLevel: getTriageLevel(p),
          arrivalTime: format(new Date(p.admissionDate), 'hh:mm a'),
          waitTime: p.isInBed ? 0 : getWaitMinutes(p.admissionDate),
          assignedBed: bedNumber,
        };
      })
      .sort((a, b) => a.triageLevel - b.triageLevel);
  }, [patientsResponse]);

  const levelCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    triagePatients.forEach((p) => {
      if (p.triageLevel <= 3) counts[p.triageLevel]++;
    });
    return counts;
  }, [triagePatients]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Siren className="h-5 w-5 text-dept-emergency" />
              Emergency Triage Queue
            </CardTitle>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((level) => (
                <Badge key={level} className={triageLevelConfig[level].color}>
                  Level {level}: {levelCounts[level]}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : triagePatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Siren className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No patients in triage queue</p>
            </div>
          ) : (
            triagePatients.map((patient) => {
              const config = triageLevelConfig[patient.triageLevel];
              return (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    patient.triageLevel <= 2
                      ? 'border-l-status-critical bg-status-critical/5 animate-pulse'
                      : patient.triageLevel === 3
                      ? 'border-l-status-warning bg-status-warning/5'
                      : 'border-l-status-stable bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <Badge className={config.color}>
                          Level {patient.triageLevel}
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-1">{config.priority}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{patient.name}</p>
                          <span className="text-sm text-muted-foreground">({patient.age} yrs)</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.chiefComplaint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{patient.arrivalTime}</span>
                        </div>
                        {patient.waitTime > 0 && (
                          <p className="text-xs text-status-warning">Wait: {patient.waitTime} min</p>
                        )}
                      </div>
                      {patient.assignedBed ? (
                        <Badge variant="outline" className="gap-1">
                          Bed: {patient.assignedBed}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => setAssignModal({ open: true, patientId: patient.rawId, patientName: patient.name })}
                        >
                          Assign Bed
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                      {patient.triageLevel <= 2 && (
                        <AlertTriangle className="h-5 w-5 text-status-critical animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <AssignBedModal
        open={assignModal.open}
        onClose={() => setAssignModal({ open: false, patientId: '', patientName: '' })}
        patientId={assignModal.patientId}
        patientName={assignModal.patientName}
        department="Emergency"
      />
    </>
  );
}
