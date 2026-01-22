import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, CheckCircle, ArrowRight } from "lucide-react";

interface QueueItem {
  id: string;
  patientName: string;
  patientId: string;
  appointmentTime: string;
  consultationType: string;
  status: 'waiting' | 'in-consultation' | 'completed';
  waitTime: number;
}

const mockQueue: QueueItem[] = [
  {
    id: 'Q001',
    patientName: 'Lisa Anderson',
    patientId: 'P004',
    appointmentTime: '09:00 AM',
    consultationType: 'Prenatal Checkup',
    status: 'in-consultation',
    waitTime: 0,
  },
  {
    id: 'Q002',
    patientName: 'Patricia Brown',
    patientId: 'P006',
    appointmentTime: '09:30 AM',
    consultationType: 'Annual Physical',
    status: 'waiting',
    waitTime: 15,
  },
  {
    id: 'Q003',
    patientName: 'David Lee',
    patientId: 'P009',
    appointmentTime: '10:00 AM',
    consultationType: 'Follow-up',
    status: 'waiting',
    waitTime: 25,
  },
  {
    id: 'Q004',
    patientName: 'Susan Clark',
    patientId: 'P010',
    appointmentTime: '10:30 AM',
    consultationType: 'Vaccination',
    status: 'waiting',
    waitTime: 35,
  },
];

const statusStyles = {
  'waiting': 'bg-status-warning/10 text-status-warning border-status-warning/30',
  'in-consultation': 'bg-primary/10 text-primary border-primary/30',
  'completed': 'bg-status-stable/10 text-status-stable border-status-stable/30',
};

export function AppointmentQueue() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Today's Appointment Queue
        </CardTitle>
        <Badge variant="secondary">{mockQueue.length} appointments</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockQueue.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border ${
              item.status === 'in-consultation' 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.consultationType} • ID: {item.patientId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{item.appointmentTime}</p>
                  {item.status === 'waiting' && (
                    <p className="text-xs text-muted-foreground">
                      Wait: {item.waitTime} min
                    </p>
                  )}
                </div>
                <Badge variant="outline" className={statusStyles[item.status]}>
                  {item.status === 'in-consultation' ? 'In Consultation' : 
                   item.status === 'completed' ? 'Completed' : 'Waiting'}
                </Badge>
                {item.status === 'waiting' && (
                  <Button size="sm" variant="outline" className="gap-1">
                    Call Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                {item.status === 'in-consultation' && (
                  <Button size="sm" className="gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
