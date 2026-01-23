import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VitalSignCard } from "@/components/dashboard/VitalSignCard";
import { VitalSignsChart } from "@/components/dashboard/VitalSignsChart";
import {
  User,
  Bed,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  Phone,
  Stethoscope,
} from "lucide-react";
import type { Patient, PatientStatus } from "@/data/mockPatients";

interface PatientDetailModalProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}

const statusConfig: Record<PatientStatus, { label: string; className: string; icon: React.ElementType }> = {
  critical: { label: 'Critical', className: 'bg-status-critical text-white', icon: AlertTriangle },
  warning: { label: 'Needs Attention', className: 'bg-status-warning text-white', icon: AlertCircle },
  stable: { label: 'Stable', className: 'bg-status-stable text-white', icon: CheckCircle },
  normal: { label: 'Normal', className: 'bg-status-normal text-white', icon: Info },
};

export function PatientDetailModal({ patient, open, onClose }: PatientDetailModalProps) {
  if (!patient) return null;

  const statusInfo = statusConfig[patient.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{patient.name}</DialogTitle>
                <p className="text-muted-foreground">
                  {patient.age} yrs • {patient.gender} • ID: {patient.id}
                </p>
              </div>
            </div>
            <Badge className={statusInfo.className}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                {patient.bedNumber || 'N/A'} {patient.roomNumber && `• ${patient.roomNumber}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Admitted</p>
              <p className="font-medium">{new Date(patient.admissionDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Attending Nurse</p>
              <p className="font-medium">{patient.attendingNurse}</p>
            </div>
          </div>
        </div>

        <div className="py-4">
          <h3 className="font-semibold mb-2">Diagnosis</h3>
          <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">{patient.diagnosis}</p>
        </div>

        <Tabs defaultValue="vitals">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="charts">Live Monitor</TabsTrigger>
            <TabsTrigger value="medications">
              Medications ({patient.medications.length})
            </TabsTrigger>
            <TabsTrigger value="notes">
              Notes ({patient.notes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="mt-4">
            <VitalSignCard vitals={patient.vitals} status={patient.status} />
          </TabsContent>

          <TabsContent value="charts" className="mt-4">
            <VitalSignsChart 
              initialVitals={patient.vitals} 
              patientName={patient.name}
            />
          </TabsContent>

          <TabsContent value="medications" className="mt-4">
            <div className="space-y-2">
              {patient.medications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No medications prescribed</p>
              ) : (
                patient.medications.map((med, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Pill className="h-5 w-5 text-vital-bp" />
                    <span>{med}</span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-2">
              {patient.notes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No notes recorded</p>
              ) : (
                patient.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1">Record Vitals</Button>
          <Button variant="outline" className="flex-1">Add Note</Button>
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Call Doctor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
