import { Card, CardContent } from "@/components/ui/card";
import { Siren, Clock, Bed, Users, AlertTriangle, Ambulance } from "lucide-react";

const stats = [
  { label: 'Active Cases', value: 8, icon: Users, color: 'text-dept-emergency bg-dept-emergency/10' },
  { label: 'Critical', value: 2, icon: AlertTriangle, color: 'text-status-critical bg-status-critical/10', pulse: true },
  { label: 'Available Beds', value: 4, icon: Bed, color: 'text-status-stable bg-status-stable/10' },
  { label: 'Avg Wait Time', value: '12 min', icon: Clock, color: 'text-status-warning bg-status-warning/10' },
  { label: 'Incoming', value: 1, icon: Ambulance, color: 'text-primary bg-primary/10' },
  { label: 'Discharged Today', value: 5, icon: Siren, color: 'text-muted-foreground bg-muted' },
];

export function EmergencyStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={stat.pulse ? 'animate-pulse' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
