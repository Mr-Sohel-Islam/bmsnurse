import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Siren, Clock, User, AlertTriangle, ArrowRight } from "lucide-react";

interface TriagePatient {
  id: string;
  name: string;
  age: number;
  chiefComplaint: string;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  arrivalTime: string;
  waitTime: number;
  assignedBed?: string;
}

const mockTriageQueue: TriagePatient[] = [
  {
    id: 'ER-001',
    name: 'Robert Davis',
    age: 72,
    chiefComplaint: 'Severe respiratory distress',
    triageLevel: 1,
    arrivalTime: '08:30 AM',
    waitTime: 0,
    assignedBed: 'ER-3',
  },
  {
    id: 'ER-002',
    name: 'Michael Thompson',
    age: 28,
    chiefComplaint: 'MVA - multiple lacerations',
    triageLevel: 2,
    arrivalTime: '08:45 AM',
    waitTime: 0,
    assignedBed: 'ER-1',
  },
  {
    id: 'ER-003',
    name: 'Anna Johnson',
    age: 45,
    chiefComplaint: 'Chest pain, possible cardiac',
    triageLevel: 2,
    arrivalTime: '09:00 AM',
    waitTime: 5,
  },
  {
    id: 'ER-004',
    name: 'Kevin Brown',
    age: 34,
    chiefComplaint: 'Severe abdominal pain',
    triageLevel: 3,
    arrivalTime: '09:15 AM',
    waitTime: 15,
  },
  {
    id: 'ER-005',
    name: 'Sarah Miller',
    age: 8,
    chiefComplaint: 'High fever, vomiting',
    triageLevel: 3,
    arrivalTime: '09:20 AM',
    waitTime: 20,
  },
];

const triageLevelConfig = {
  1: { label: 'Resuscitation', color: 'bg-status-critical text-white', priority: 'Immediate' },
  2: { label: 'Emergent', color: 'bg-status-critical/80 text-white', priority: '< 15 min' },
  3: { label: 'Urgent', color: 'bg-status-warning text-white', priority: '< 30 min' },
  4: { label: 'Less Urgent', color: 'bg-dept-ipd text-white', priority: '< 60 min' },
  5: { label: 'Non-Urgent', color: 'bg-status-stable text-white', priority: '< 120 min' },
};

export function TriageQueue() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-dept-emergency" />
            Emergency Triage Queue
          </CardTitle>
          <div className="flex gap-2">
            {[1, 2, 3].map((level) => (
              <Badge key={level} className={triageLevelConfig[level as 1 | 2 | 3].color}>
                Level {level}: {mockTriageQueue.filter((p) => p.triageLevel === level).length}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockTriageQueue
          .sort((a, b) => a.triageLevel - b.triageLevel)
          .map((patient) => {
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
                <div className="flex items-center justify-between">
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
                      <Button size="sm" className="gap-1">
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
          })}
      </CardContent>
    </Card>
  );
}
