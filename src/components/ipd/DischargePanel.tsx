import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LogOut, CheckCircle, Clock, FileText, Pill, CreditCard } from "lucide-react";

interface DischargeCandidate {
  id: string;
  name: string;
  bedNumber: string;
  diagnosis: string;
  expectedDischarge: string;
  progress: number;
  pendingTasks: string[];
}

const mockDischargeCandidates: DischargeCandidate[] = [
  {
    id: 'P002',
    name: 'Mary Williams',
    bedNumber: 'B-102',
    diagnosis: 'Post-operative recovery (Appendectomy)',
    expectedDischarge: '2026-01-23',
    progress: 85,
    pendingTasks: ['Final vitals check', 'Discharge summary'],
  },
  {
    id: 'P008',
    name: 'Jennifer Martinez',
    bedNumber: 'B-301',
    diagnosis: 'Total knee replacement',
    expectedDischarge: '2026-01-24',
    progress: 60,
    pendingTasks: ['Physical therapy evaluation', 'Medication review', 'Home care instructions'],
  },
];

export function DischargePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="h-5 w-5 text-primary" />
          Upcoming Discharges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockDischargeCandidates.map((patient) => (
          <div key={patient.id} className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-muted-foreground">
                  {patient.bedNumber} • {patient.diagnosis}
                </p>
              </div>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {new Date(patient.expectedDischarge).toLocaleDateString()}
              </Badge>
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
        ))}
      </CardContent>
    </Card>
  );
}
