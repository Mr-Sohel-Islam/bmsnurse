import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useMyAlerts, useDismissAlert } from "@/hooks/useAlerts";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const severityToType = (severity: string) => {
  if (severity === 'critical' || severity === 'high') return 'critical' as const;
  if (severity === 'medium') return 'warning' as const;
  return 'info' as const;
};

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
  const { data: alerts = [], isLoading } = useMyAlerts();
  const dismissAlert = useDismissAlert();
  const navigate = useNavigate();

  const activeAlerts = alerts.filter((a) => !a.isAcknowledged && !a.isDismissed).slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Active Alerts
        </CardTitle>
        <Badge variant="secondary">{activeAlerts.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : activeAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            const displayType = severityToType(alert.severity);
            const style = alertStyles[displayType];
            const Icon = style.icon;
            
            return (
              <div
                key={alert._id}
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
                        {displayType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground"
                      onClick={() => dismissAlert.mutate(alert._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/alerts')}>
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
