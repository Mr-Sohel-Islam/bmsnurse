import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  X,
  ChevronRight 
} from "lucide-react";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  patientId?: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Critical Vital Signs',
    description: 'Patient John Smith (P001) - SpO2 dropped to 89%',
    time: '2 min ago',
    patientId: 'P001',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Medication Due',
    description: 'Patient James Wilson (P005) - Insulin administration overdue',
    time: '5 min ago',
    patientId: 'P005',
  },
  {
    id: '3',
    type: 'critical',
    title: 'Emergency Admission',
    description: 'New patient in ER-3 requires immediate attention',
    time: '8 min ago',
    patientId: 'P003',
  },
  {
    id: '4',
    type: 'info',
    title: 'Shift Change',
    description: 'Evening shift starts in 30 minutes',
    time: '15 min ago',
  },
];

const alertStyles = {
  critical: {
    border: 'border-l-status-critical',
    bg: 'bg-status-critical/5',
    badge: 'bg-status-critical text-white',
    icon: AlertTriangle,
  },
  warning: {
    border: 'border-l-status-warning',
    bg: 'bg-status-warning/5',
    badge: 'bg-status-warning text-white',
    icon: Clock,
  },
  info: {
    border: 'border-l-status-normal',
    bg: 'bg-status-normal/5',
    badge: 'bg-status-normal text-white',
    icon: Bell,
  },
};

export function AlertsPanel() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Active Alerts
        </CardTitle>
        <Badge variant="secondary">{mockAlerts.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;
          
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border-l-4 ${style.border} ${style.bg} group relative`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${style.badge}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{alert.title}</p>
                    <Badge className={`text-xs ${style.badge}`}>
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {alert.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        
        <Button variant="outline" className="w-full mt-4">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
