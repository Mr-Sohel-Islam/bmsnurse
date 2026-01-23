import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Syringe,
  AlertCircle,
  History,
  Ban,
} from "lucide-react";
import {
  type Medication,
  type ScheduledDose,
  type AdministrationLog,
  type MedicationStatus,
  mockAdministrationLogs,
} from "@/data/mockMedications";

interface MedicationSchedulerProps {
  medications: Medication[];
  patientName: string;
  onAdminister?: (medicationId: string, doseId: string, notes: string) => void;
}

const statusConfig: Record<MedicationStatus, { label: string; className: string; icon: React.ElementType }> = {
  scheduled: { label: 'Scheduled', className: 'bg-muted text-muted-foreground', icon: Clock },
  due: { label: 'Due Now', className: 'bg-status-warning text-white animate-pulse', icon: Timer },
  overdue: { label: 'Overdue', className: 'bg-status-critical text-white animate-pulse', icon: AlertTriangle },
  administered: { label: 'Given', className: 'bg-status-stable text-white', icon: CheckCircle },
  held: { label: 'Held', className: 'bg-muted text-muted-foreground', icon: Ban },
  discontinued: { label: 'D/C', className: 'bg-muted text-muted-foreground line-through', icon: XCircle },
};

const routeLabels: Record<string, string> = {
  'PO': 'Oral',
  'IV': 'Intravenous',
  'IM': 'Intramuscular',
  'SC': 'Subcutaneous',
  'SL': 'Sublingual',
  'topical': 'Topical',
  'inhaled': 'Inhaled',
};

export function MedicationScheduler({ 
  medications, 
  patientName,
  onAdminister 
}: MedicationSchedulerProps) {
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [selectedDose, setSelectedDose] = useState<ScheduledDose | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [countdown, setCountdown] = useState<Record<string, number>>({});

  // Countdown timer for due medications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newCountdown: Record<string, number> = {};
      
      medications.forEach(med => {
        med.scheduledDoses.forEach(dose => {
          if (dose.status === 'due' || dose.status === 'scheduled') {
            const doseTime = new Date(dose.scheduledTime);
            const diff = Math.floor((doseTime.getTime() - now.getTime()) / 1000);
            newCountdown[dose.id] = diff;
          }
        });
      });
      
      setCountdown(newCountdown);
    }, 1000);

    return () => clearInterval(interval);
  }, [medications]);

  const formatCountdown = (seconds: number): string => {
    if (seconds < 0) {
      const absSeconds = Math.abs(seconds);
      const mins = Math.floor(absSeconds / 60);
      const secs = absSeconds % 60;
      return `-${mins}:${secs.toString().padStart(2, '0')} overdue`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAdminister = () => {
    if (selectedMed && selectedDose && onAdminister) {
      onAdminister(selectedMed.id, selectedDose.id, adminNotes);
    }
    setAdminDialogOpen(false);
    setSelectedMed(null);
    setSelectedDose(null);
    setAdminNotes("");
  };

  const openAdminDialog = (med: Medication, dose: ScheduledDose) => {
    setSelectedMed(med);
    setSelectedDose(dose);
    setAdminDialogOpen(true);
  };

  const dueMedications = medications.filter(m => 
    m.scheduledDoses.some(d => d.status === 'due' || d.status === 'overdue')
  );

  const upcomingMedications = medications.filter(m =>
    m.scheduledDoses.some(d => d.status === 'scheduled')
  );

  const patientLogs = mockAdministrationLogs.filter(log => 
    medications.some(m => m.id === log.medicationId)
  );

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Medication Schedule</CardTitle>
          </div>
          <Badge variant="outline">{patientName}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="due" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="due" className="relative">
              Due Now
              {dueMedications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-status-critical text-white text-xs rounded-full flex items-center justify-center">
                  {dueMedications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Meds</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="due">
            <ScrollArea className="h-[400px] pr-4">
              {dueMedications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-status-stable" />
                  <p>No medications due at this time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dueMedications.map(med => (
                    <MedicationDueCard
                      key={med.id}
                      medication={med}
                      countdown={countdown}
                      formatCountdown={formatCountdown}
                      onAdminister={openAdminDialog}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {medications.map(med => (
                  <MedicationCard
                    key={med.id}
                    medication={med}
                    countdown={countdown}
                    formatCountdown={formatCountdown}
                    onAdminister={openAdminDialog}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="interactions">
            <ScrollArea className="h-[400px] pr-4">
              <DrugInteractionsPanel medications={medications} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[400px] pr-4">
              <AdministrationHistory logs={patientLogs} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Administration Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Syringe className="h-5 w-5" />
              Administer Medication
            </DialogTitle>
          </DialogHeader>
          
          {selectedMed && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{selectedMed.name}</span>
                  {selectedMed.isHighAlert && (
                    <Badge className="bg-status-critical text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      HIGH ALERT
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedMed.genericName}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Dose:</span>{" "}
                    <span className="font-medium">{selectedMed.dosage}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Route:</span>{" "}
                    <span className="font-medium">{routeLabels[selectedMed.route]}</span>
                  </div>
                </div>
                {selectedMed.instructions && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Instructions:</span>{" "}
                    <span>{selectedMed.instructions}</span>
                  </div>
                )}
              </div>

              {selectedMed.warnings.length > 0 && (
                <div className="p-3 bg-status-warning/10 border border-status-warning/30 rounded-lg">
                  <p className="font-medium text-status-warning flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    Warnings
                  </p>
                  <ul className="text-sm space-y-1">
                    {selectedMed.warnings.map((warning, idx) => (
                      <li key={idx} className="text-muted-foreground">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Administration Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter any observations, vital signs, or notes..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAdminDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" className="text-status-warning border-status-warning">
              Hold Medication
            </Button>
            <Button onClick={handleAdminister} className="bg-status-stable hover:bg-status-stable/90">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Given
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface MedicationDueCardProps {
  medication: Medication;
  countdown: Record<string, number>;
  formatCountdown: (seconds: number) => string;
  onAdminister: (med: Medication, dose: ScheduledDose) => void;
}

function MedicationDueCard({ 
  medication, 
  countdown, 
  formatCountdown, 
  onAdminister 
}: MedicationDueCardProps) {
  const dueDoses = medication.scheduledDoses.filter(
    d => d.status === 'due' || d.status === 'overdue'
  );

  return (
    <div className={`p-4 rounded-lg border-2 ${
      medication.scheduledDoses.some(d => d.status === 'overdue') 
        ? 'border-status-critical bg-status-critical/5' 
        : 'border-status-warning bg-status-warning/5'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{medication.name}</span>
            {medication.isHighAlert && (
              <Badge className="bg-status-critical text-white text-xs">
                HIGH ALERT
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {medication.dosage} • {routeLabels[medication.route]}
          </p>
        </div>
        {dueDoses.map(dose => {
          const countdownVal = countdown[dose.id];
          return (
            <div key={dose.id} className="text-right">
              <Badge className={statusConfig[dose.status].className}>
                {statusConfig[dose.status].label}
              </Badge>
              {countdownVal !== undefined && (
                <p className={`text-sm font-mono mt-1 ${
                  countdownVal < 0 ? 'text-status-critical' : 'text-muted-foreground'
                }`}>
                  {formatCountdown(countdownVal)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {medication.instructions && (
        <p className="text-sm text-muted-foreground mb-3">
          ℹ️ {medication.instructions}
        </p>
      )}

      {dueDoses.map(dose => (
        <Button 
          key={dose.id}
          className="w-full" 
          onClick={() => onAdminister(medication, dose)}
        >
          <Syringe className="h-4 w-4 mr-2" />
          Administer Now
        </Button>
      ))}
    </div>
  );
}

interface MedicationCardProps {
  medication: Medication;
  countdown: Record<string, number>;
  formatCountdown: (seconds: number) => string;
  onAdminister: (med: Medication, dose: ScheduledDose) => void;
}

function MedicationCard({ 
  medication, 
  countdown, 
  formatCountdown,
  onAdminister 
}: MedicationCardProps) {
  const administeredCount = medication.scheduledDoses.filter(
    d => d.status === 'administered'
  ).length;
  const totalDoses = medication.scheduledDoses.length || 1;
  const progress = (administeredCount / totalDoses) * 100;

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{medication.name}</span>
            {medication.isHighAlert && (
              <Badge className="bg-status-critical text-white text-xs">
                HIGH ALERT
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {medication.dosage} • {routeLabels[medication.route]} • {medication.frequency}
          </p>
        </div>
      </div>

      {medication.scheduledDoses.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground">
              {administeredCount}/{totalDoses}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {medication.scheduledDoses.map(dose => {
              const StatusIcon = statusConfig[dose.status].icon;
              const time = new Date(dose.scheduledTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const countdownVal = countdown[dose.id];
              
              return (
                <button
                  key={dose.id}
                  onClick={() => {
                    if (dose.status === 'due' || dose.status === 'scheduled') {
                      onAdminister(medication, dose);
                    }
                  }}
                  disabled={dose.status === 'administered'}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                    dose.status === 'administered' 
                      ? 'bg-status-stable/10 text-status-stable cursor-default'
                      : dose.status === 'overdue'
                      ? 'bg-status-critical/10 text-status-critical hover:bg-status-critical/20 cursor-pointer'
                      : dose.status === 'due'
                      ? 'bg-status-warning/10 text-status-warning hover:bg-status-warning/20 cursor-pointer'
                      : 'bg-muted hover:bg-muted/80 cursor-pointer'
                  }`}
                >
                  <StatusIcon className="h-3 w-3" />
                  <span>{time}</span>
                  {countdownVal !== undefined && countdownVal > 0 && dose.status === 'scheduled' && (
                    <span className="text-muted-foreground">
                      ({formatCountdown(countdownVal)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {medication.frequency === 'PRN' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => onAdminister(medication, {
            id: `prn-${Date.now()}`,
            scheduledTime: new Date().toISOString(),
            status: 'due'
          })}
        >
          <Syringe className="h-3 w-3 mr-1" />
          Give PRN Dose
        </Button>
      )}
    </div>
  );
}

interface DrugInteractionsPanelProps {
  medications: Medication[];
}

function DrugInteractionsPanel({ medications }: DrugInteractionsPanelProps) {
  const allInteractions = medications.flatMap(med => 
    med.interactions.map(interaction => ({
      drug1: med.name,
      ...interaction
    }))
  );

  const severeInteractions = allInteractions.filter(i => i.severity === 'severe');
  const moderateInteractions = allInteractions.filter(i => i.severity === 'moderate');
  const mildInteractions = allInteractions.filter(i => i.severity === 'mild');

  if (allInteractions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-status-stable" />
        <p>No known drug interactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {severeInteractions.length > 0 && (
        <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-lg">
          <h4 className="font-semibold text-status-critical flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5" />
            Severe Interactions ({severeInteractions.length})
          </h4>
          <div className="space-y-2">
            {severeInteractions.map((interaction, idx) => (
              <div key={idx} className="p-2 bg-background rounded">
                <p className="font-medium">
                  {interaction.drug1} ↔ {interaction.drugName}
                </p>
                <p className="text-sm text-muted-foreground">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {moderateInteractions.length > 0 && (
        <div className="p-4 bg-status-warning/10 border border-status-warning/30 rounded-lg">
          <h4 className="font-semibold text-status-warning flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5" />
            Moderate Interactions ({moderateInteractions.length})
          </h4>
          <div className="space-y-2">
            {moderateInteractions.map((interaction, idx) => (
              <div key={idx} className="p-2 bg-background rounded">
                <p className="font-medium">
                  {interaction.drug1} ↔ {interaction.drugName}
                </p>
                <p className="text-sm text-muted-foreground">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mildInteractions.length > 0 && (
        <div className="p-4 bg-muted border rounded-lg">
          <h4 className="font-semibold text-muted-foreground flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5" />
            Mild Interactions ({mildInteractions.length})
          </h4>
          <div className="space-y-2">
            {mildInteractions.map((interaction, idx) => (
              <div key={idx} className="p-2 bg-background rounded">
                <p className="font-medium">
                  {interaction.drug1} ↔ {interaction.drugName}
                </p>
                <p className="text-sm text-muted-foreground">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AdministrationHistoryProps {
  logs: AdministrationLog[];
}

function AdministrationHistory({ logs }: AdministrationHistoryProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <History className="h-12 w-12 mx-auto mb-3" />
        <p>No administration history</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs
        .sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime())
        .map(log => (
          <div key={log.id} className="p-3 border rounded-lg bg-card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium">{log.medicationName}</p>
                <p className="text-sm text-muted-foreground">
                  {routeLabels[log.route]}
                </p>
              </div>
              <Badge className={
                log.status === 'given' 
                  ? 'bg-status-stable text-white' 
                  : log.status === 'held'
                  ? 'bg-status-warning text-white'
                  : 'bg-muted'
              }>
                {log.status === 'given' ? 'Given' : log.status === 'held' ? 'Held' : log.status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <Clock className="h-3 w-3 inline mr-1" />
                {new Date(log.administeredAt).toLocaleString()}
              </p>
              <p>By: {log.administeredBy}</p>
              {log.notes && <p className="italic">"{log.notes}"</p>}
            </div>
          </div>
        ))}
    </div>
  );
}
