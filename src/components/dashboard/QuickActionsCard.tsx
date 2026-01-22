import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pill,
  Syringe,
  FileText,
  AlertTriangle,
  Phone,
  Droplets,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react";

const quickActions = [
  { icon: Pill, label: "Give Medication", color: "text-vital-bp bg-vital-bp/10 hover:bg-vital-bp/20" },
  { icon: Syringe, label: "Record Vitals", color: "text-vital-heart bg-vital-heart/10 hover:bg-vital-heart/20" },
  { icon: FileText, label: "Add Note", color: "text-primary bg-primary/10 hover:bg-primary/20" },
  { icon: AlertTriangle, label: "Report Issue", color: "text-status-warning bg-status-warning/10 hover:bg-status-warning/20" },
  { icon: Phone, label: "Call Doctor", color: "text-status-stable bg-status-stable/10 hover:bg-status-stable/20" },
  { icon: Droplets, label: "IV Check", color: "text-vital-oxygen bg-vital-oxygen/10 hover:bg-vital-oxygen/20" },
  { icon: Stethoscope, label: "Examination", color: "text-accent bg-accent/10 hover:bg-accent/20" },
  { icon: ClipboardCheck, label: "Checklist", color: "text-dept-ipd bg-dept-ipd/10 hover:bg-dept-ipd/20" },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className={`flex flex-col items-center gap-2 h-auto py-4 ${action.color} transition-all`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
