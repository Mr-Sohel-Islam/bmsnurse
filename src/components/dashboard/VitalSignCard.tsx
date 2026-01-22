import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Droplets, Thermometer } from "lucide-react";
import type { VitalSigns, PatientStatus } from "@/data/mockPatients";

interface VitalSignCardProps {
  vitals: VitalSigns;
  status: PatientStatus;
  compact?: boolean;
}

export function VitalSignCard({ vitals, status, compact = false }: VitalSignCardProps) {
  const getVitalStatus = (type: string, value: number): 'normal' | 'warning' | 'critical' => {
    switch (type) {
      case 'heartRate':
        if (value < 50 || value > 120) return 'critical';
        if (value < 60 || value > 100) return 'warning';
        return 'normal';
      case 'oxygen':
        if (value < 90) return 'critical';
        if (value < 95) return 'warning';
        return 'normal';
      case 'temp':
        if (value > 39 || value < 35) return 'critical';
        if (value > 38 || value < 36) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const statusColors = {
    normal: 'text-status-stable',
    warning: 'text-status-warning',
    critical: 'text-status-critical',
  };

  const vitalItems = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: `${vitals.heartRate}`,
      unit: 'bpm',
      color: 'text-vital-heart',
      bgColor: 'bg-vital-heart/10',
      status: getVitalStatus('heartRate', vitals.heartRate),
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: 'mmHg',
      color: 'text-vital-bp',
      bgColor: 'bg-vital-bp/10',
      status: 'normal' as const,
    },
    {
      icon: Droplets,
      label: 'SpO2',
      value: `${vitals.oxygenSaturation}`,
      unit: '%',
      color: 'text-vital-oxygen',
      bgColor: 'bg-vital-oxygen/10',
      status: getVitalStatus('oxygen', vitals.oxygenSaturation),
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${vitals.temperature.toFixed(1)}`,
      unit: '°C',
      color: 'text-vital-temp',
      bgColor: 'bg-vital-temp/10',
      status: getVitalStatus('temp', vitals.temperature),
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {vitalItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 p-2 rounded-lg ${item.bgColor}`}
          >
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className={`text-sm font-semibold ${statusColors[item.status]}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {vitalItems.map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-xl ${item.bgColor} transition-all hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${statusColors[item.status]}`}>
                  {item.value}
                </span>
                <span className="text-xs text-muted-foreground">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Last updated: {new Date(vitals.lastUpdated).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
}
