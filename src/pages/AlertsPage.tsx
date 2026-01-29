import { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Clock,
  Info,
  CheckCircle2,
  X,
  Filter,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DepartmentLayout } from "@/components/department/DepartmentLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  time: string;
  timestamp: Date;
  patientId?: string;
  patientName?: string;
  room?: string;
  acknowledged: boolean;
  category: "vitals" | "medication" | "system" | "admission" | "discharge";
}

const mockAlerts: Alert[] = [
  {
    id: "A001",
    type: "critical",
    title: "Critical Vital Signs",
    description: "SpO2 dropped to 89% - requires immediate attention",
    time: "2 min ago",
    timestamp: new Date(Date.now() - 2 * 60000),
    patientId: "P001",
    patientName: "John Smith",
    room: "ICU-01",
    acknowledged: false,
    category: "vitals",
  },
  {
    id: "A002",
    type: "critical",
    title: "Cardiac Arrhythmia Detected",
    description: "Irregular heart rhythm detected - ECG review needed",
    time: "5 min ago",
    timestamp: new Date(Date.now() - 5 * 60000),
    patientId: "P002",
    patientName: "Maria Garcia",
    room: "ICU-02",
    acknowledged: false,
    category: "vitals",
  },
  {
    id: "A003",
    type: "warning",
    title: "Medication Overdue",
    description: "Insulin administration is 30 minutes overdue",
    time: "8 min ago",
    timestamp: new Date(Date.now() - 8 * 60000),
    patientId: "P005",
    patientName: "James Wilson",
    room: "IPD-201",
    acknowledged: false,
    category: "medication",
  },
  {
    id: "A004",
    type: "warning",
    title: "High Temperature Alert",
    description: "Temperature reading 39.2°C - fever protocol recommended",
    time: "15 min ago",
    timestamp: new Date(Date.now() - 15 * 60000),
    patientId: "P004",
    patientName: "Emily Brown",
    room: "IPD-108",
    acknowledged: true,
    category: "vitals",
  },
  {
    id: "A005",
    type: "info",
    title: "New Emergency Admission",
    description: "Patient admitted to ER-3 with chest pain",
    time: "20 min ago",
    timestamp: new Date(Date.now() - 20 * 60000),
    patientId: "P003",
    patientName: "Alex Thompson",
    room: "ER-3",
    acknowledged: true,
    category: "admission",
  },
  {
    id: "A006",
    type: "info",
    title: "Shift Change Reminder",
    description: "Evening shift starts in 30 minutes",
    time: "25 min ago",
    timestamp: new Date(Date.now() - 25 * 60000),
    acknowledged: true,
    category: "system",
  },
  {
    id: "A007",
    type: "info",
    title: "Discharge Ready",
    description: "Patient cleared for discharge - documentation pending",
    time: "45 min ago",
    timestamp: new Date(Date.now() - 45 * 60000),
    patientId: "P006",
    patientName: "Robert Chen",
    room: "IPD-105",
    acknowledged: true,
    category: "discharge",
  },
];

const alertStyles = {
  critical: {
    border: "border-l-status-critical",
    bg: "bg-status-critical/5",
    badge: "bg-status-critical text-white",
    icon: AlertTriangle,
    iconBg: "bg-status-critical",
  },
  warning: {
    border: "border-l-status-warning",
    bg: "bg-status-warning/5",
    badge: "bg-status-warning text-white",
    icon: Clock,
    iconBg: "bg-status-warning",
  },
  info: {
    border: "border-l-status-normal",
    bg: "bg-status-normal/5",
    badge: "bg-status-normal text-white",
    icon: Info,
    iconBg: "bg-status-normal",
  },
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = filterType === "all" || alert.type === filterType;
    const matchesCategory = filterCategory === "all" || alert.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const unacknowledged = filteredAlerts.filter((a) => !a.acknowledged);
  const acknowledged = filteredAlerts.filter((a) => a.acknowledged);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })));
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.type === "critical" && !a.acknowledged).length,
    warning: alerts.filter((a) => a.type === "warning" && !a.acknowledged).length,
    info: alerts.filter((a) => a.type === "info" && !a.acknowledged).length,
  };

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const style = alertStyles[alert.type];
    const Icon = style.icon;

    return (
      <Card
        className={`${style.border} border-l-4 ${!alert.acknowledged ? style.bg : ""} ${
          alert.type === "critical" && !alert.acknowledged ? "animate-pulse" : ""
        }`}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-full ${style.iconBg} text-white shrink-0`}>
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-medium text-sm sm:text-base">{alert.title}</span>
                <Badge className={`${style.badge} text-xs`}>{alert.type}</Badge>
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  {alert.category}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{alert.description}</p>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                <span>{alert.time}</span>
                {alert.patientName && <span className="truncate max-w-[100px]">{alert.patientName}</span>}
                {alert.room && <span>{alert.room}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {!alert.acknowledged && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="gap-1 text-xs px-2 sm:px-3"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Acknowledge</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DepartmentLayout
      title="Alerts"
      icon={Bell}
      headerActions={
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            <Label htmlFor="sound" className="flex items-center gap-1 text-sm">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden sm:inline">Sound</span>
            </Label>
          </div>
          {unacknowledged.length > 0 && (
            <Button variant="outline" size="sm" onClick={acknowledgeAll} className="text-xs sm:text-sm">
              Ack All ({unacknowledged.length})
            </Button>
          )}
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.critical > 0 ? "border-status-critical/50" : ""}>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-status-critical/10">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-status-critical" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-status-warning/10">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-status-warning" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.warning}</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-status-normal/10">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-status-normal" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold">{stats.info}</p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px] sm:w-[150px]">
              <SelectValue placeholder="Alert Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[120px] sm:w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="vitals">Vitals</SelectItem>
            <SelectItem value="medication">Medication</SelectItem>
            <SelectItem value="admission">Admission</SelectItem>
            <SelectItem value="discharge">Discharge</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert Lists */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="active" className="gap-1 sm:gap-2">
            Active
            {unacknowledged.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unacknowledged.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="acknowledged" className="gap-1 sm:gap-2">
            Acknowledged
            <Badge variant="secondary" className="ml-1 text-xs">
              {acknowledged.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {unacknowledged.length > 0 ? (
            unacknowledged.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          ) : (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">All clear!</p>
              <p className="text-sm">No active alerts at the moment</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-3">
          {acknowledged.length > 0 ? (
            acknowledged.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          ) : (
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Bell className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
              <p>No acknowledged alerts</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DepartmentLayout>
  );
};

export default AlertsPage;
