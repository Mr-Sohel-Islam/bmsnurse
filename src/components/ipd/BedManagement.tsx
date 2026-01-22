import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, User, AlertTriangle, Clock } from "lucide-react";

interface BedInfo {
  bedNumber: string;
  roomNumber: string;
  status: 'occupied' | 'available' | 'maintenance' | 'reserved';
  patient?: {
    name: string;
    id: string;
    admissionDate: string;
    status: 'critical' | 'warning' | 'stable';
  };
}

const mockBeds: BedInfo[] = [
  {
    bedNumber: 'B-101',
    roomNumber: 'R-10',
    status: 'occupied',
    patient: { name: 'John Smith', id: 'P001', admissionDate: '2026-01-20', status: 'critical' },
  },
  {
    bedNumber: 'B-102',
    roomNumber: 'R-10',
    status: 'occupied',
    patient: { name: 'Mary Williams', id: 'P002', admissionDate: '2026-01-21', status: 'stable' },
  },
  {
    bedNumber: 'B-103',
    roomNumber: 'R-10',
    status: 'available',
  },
  {
    bedNumber: 'B-201',
    roomNumber: 'R-20',
    status: 'maintenance',
  },
  {
    bedNumber: 'B-202',
    roomNumber: 'R-20',
    status: 'reserved',
  },
  {
    bedNumber: 'B-205',
    roomNumber: 'R-20',
    status: 'occupied',
    patient: { name: 'James Wilson', id: 'P005', admissionDate: '2026-01-21', status: 'warning' },
  },
  {
    bedNumber: 'B-301',
    roomNumber: 'R-30',
    status: 'occupied',
    patient: { name: 'Jennifer Martinez', id: 'P008', admissionDate: '2026-01-20', status: 'stable' },
  },
  {
    bedNumber: 'B-302',
    roomNumber: 'R-30',
    status: 'available',
  },
];

const statusStyles = {
  occupied: 'border-primary bg-primary/5',
  available: 'border-status-stable bg-status-stable/5',
  maintenance: 'border-muted bg-muted/50',
  reserved: 'border-status-warning bg-status-warning/5',
};

const patientStatusStyles = {
  critical: 'bg-status-critical',
  warning: 'bg-status-warning',
  stable: 'bg-status-stable',
};

export function BedManagement() {
  const stats = {
    total: mockBeds.length,
    occupied: mockBeds.filter((b) => b.status === 'occupied').length,
    available: mockBeds.filter((b) => b.status === 'available').length,
    maintenance: mockBeds.filter((b) => b.status === 'maintenance').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Bed Management
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{stats.occupied} Occupied</Badge>
            <Badge className="bg-status-stable text-white">{stats.available} Available</Badge>
            <Badge variant="outline">{stats.maintenance} Maintenance</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockBeds.map((bed) => (
            <div
              key={bed.bedNumber}
              className={`p-4 rounded-xl border-2 ${statusStyles[bed.status]} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-bold">{bed.bedNumber}</span>
                </div>
                <span className="text-xs text-muted-foreground">{bed.roomNumber}</span>
              </div>

              {bed.status === 'occupied' && bed.patient && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{bed.patient.name}</p>
                      <p className="text-xs text-muted-foreground">{bed.patient.id}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${patientStatusStyles[bed.patient.status]}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Since {new Date(bed.patient.admissionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {bed.status === 'available' && (
                <div className="text-center py-2">
                  <Badge className="bg-status-stable text-white">Available</Badge>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    Assign Patient
                  </Button>
                </div>
              )}

              {bed.status === 'maintenance' && (
                <div className="text-center py-2">
                  <Badge variant="secondary">Under Maintenance</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Est. available: 2h</p>
                </div>
              )}

              {bed.status === 'reserved' && (
                <div className="text-center py-2">
                  <Badge className="bg-status-warning text-white">Reserved</Badge>
                  <p className="text-xs text-muted-foreground mt-2">For incoming transfer</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
