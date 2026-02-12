import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bed, Loader2 } from "lucide-react";
import { useBedOccupancy } from "@/hooks/useBeds";

export function BedOccupancyCard() {
  const { data: occupancy, isLoading } = useBedOccupancy();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Bed Occupancy
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Build department list from API data or fallback
  const byDept = occupancy?.byDepartment || {};
  const departments = Object.entries(byDept).map(([name, data]) => ({
    name,
    total: data.total,
    occupied: data.occupied,
    available: data.total - data.occupied,
    percentage: data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0,
  }));

  // If no data from API, show a placeholder
  if (departments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Bed Occupancy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No bed data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-status-critical';
    if (percentage >= 75) return 'bg-status-warning';
    return 'bg-status-stable';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-primary" />
          Bed Occupancy
          {occupancy && (
            <span className="text-sm font-normal text-muted-foreground ml-auto">
              {occupancy.occupancyRate}% overall
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {departments.map((dept) => (
          <div key={dept.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{dept.name}</span>
              <span className="text-muted-foreground">
                {dept.occupied}/{dept.total} beds ({dept.percentage}%)
              </span>
            </div>
            <div className="relative">
              <Progress value={dept.percentage} className="h-3" />
              <div 
                className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(dept.percentage)}`}
                style={{ width: `${dept.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {dept.available} beds available
            </p>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            {departments.slice(0, 3).map((dept) => (
              <div key={dept.name} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{dept.available}</p>
                <p className="text-xs text-muted-foreground">{dept.name} Available</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
