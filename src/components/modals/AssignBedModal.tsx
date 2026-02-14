import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Loader2, CheckCircle } from "lucide-react";
import { useBeds, useAssignPatientToBed } from "@/hooks/useBeds";
import type { Bed as BedType } from "@/types/api";

interface AssignBedModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  department: 'IPD' | 'ICU' | 'Emergency';
}

export function AssignBedModal({ open, onClose, patientId, patientName, department }: AssignBedModalProps) {
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const { data: beds = [], isLoading } = useBeds({ department, status: 'available' });
  const assignBed = useAssignPatientToBed();

  const handleAssign = () => {
    if (!selectedBedId) return;
    assignBed.mutate(
      { bedId: selectedBedId, patientId },
      {
        onSuccess: () => {
          setSelectedBedId(null);
          onClose();
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedBedId(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Assign Bed
          </DialogTitle>
          <DialogDescription>
            Select an available bed for <span className="font-medium text-foreground">{patientName}</span> in {department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : beds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bed className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No available beds</p>
              <p className="text-xs">All beds in {department} are currently occupied</p>
            </div>
          ) : (
            beds.map((bed) => (
              <button
                key={bed._id}
                onClick={() => setSelectedBedId(bed._id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  selectedBedId === bed._id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedBedId === bed._id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Bed className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{bed.bedNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {bed.ward} • Floor {bed.floor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bed.features?.length > 0 && (
                      <div className="flex gap-1">
                        {bed.features.slice(0, 2).map((f) => (
                          <Badge key={f} variant="outline" className="text-xs">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {selectedBedId === bed._id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex gap-3 pt-2 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={assignBed.isPending}>
            Cancel
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={handleAssign}
            disabled={!selectedBedId || assignBed.isPending}
          >
            {assignBed.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bed className="h-4 w-4" />
            )}
            {assignBed.isPending ? 'Assigning...' : 'Assign Bed'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
