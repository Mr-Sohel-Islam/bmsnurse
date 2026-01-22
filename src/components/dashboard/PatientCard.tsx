import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Bed, 
  Clock, 
  Pill, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { VitalSignCard } from "./VitalSignCard";
import type { Patient, PatientStatus } from "@/data/mockPatients";

interface PatientCardProps {
  patient: Patient;
  onViewDetails?: (patient: Patient) => void;
}

const statusConfig: Record<PatientStatus, { label: string; className: string; icon: React.ElementType }> = {
  critical: { 
    label: 'Critical', 
    className: 'bg-status-critical text-white', 
    icon: AlertTriangle 
  },
  warning: { 
    label: 'Needs Attention', 
    className: 'bg-status-warning text-white', 
    icon: AlertCircle 
  },
  stable: { 
    label: 'Stable', 
    className: 'bg-status-stable text-white', 
    icon: CheckCircle 
  },
  normal: { 
    label: 'Normal', 
    className: 'bg-status-normal text-white', 
    icon: Info 
  },
};

const deptColors: Record<string, string> = {
  OPD: 'bg-dept-opd/10 text-dept-opd border-dept-opd/30',
  IPD: 'bg-dept-ipd/10 text-dept-ipd border-dept-ipd/30',
  Emergency: 'bg-dept-emergency/10 text-dept-emergency border-dept-emergency/30',
};

export function PatientCard({ patient, onViewDetails }: PatientCardProps) {
  const statusInfo = statusConfig[patient.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={`border-l-4 transition-all hover:shadow-lg ${
      patient.status === 'critical' ? 'border-l-status-critical animate-pulse' :
      patient.status === 'warning' ? 'border-l-status-warning' :
      patient.status === 'stable' ? 'border-l-status-stable' :
      'border-l-status-normal'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} yrs • {patient.gender} • ID: {patient.id}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusInfo.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
            <Badge variant="outline" className={deptColors[patient.department]}>
              {patient.department}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Bed className="h-4 w-4" />
            <span>
              {patient.bedNumber ? `Bed: ${patient.bedNumber}` : 'No bed assigned'}
              {patient.roomNumber && ` • ${patient.roomNumber}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">Diagnosis</p>
          <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
        </div>

        <VitalSignCard vitals={patient.vitals} status={patient.status} compact />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Pill className="h-4 w-4" />
            <span>{patient.medications.length} medications</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{patient.notes.length} notes</span>
          </div>
          {patient.isInBed && (
            <Badge variant="secondary" className="ml-auto">
              <Bed className="h-3 w-3 mr-1" />
              In Bed
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(patient)}
          >
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Quick Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
