import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TopHeaderProps {
  sidebarCollapsed: boolean;
}

export function TopHeader({ sidebarCollapsed }: TopHeaderProps) {
  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-card border-b border-border transition-all duration-300 ${
        sidebarCollapsed ? "left-20" : "left-64"
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, rooms, medications..."
              className="pl-10 bg-muted/50 border-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-status-critical text-white text-xs"
            >
              3
            </Badge>
          </Button>

          <div className="h-8 w-px bg-border" />

          <div className="text-right">
            <p className="text-sm font-medium">Jan 22, 2026</p>
            <p className="text-xs text-muted-foreground">Day Shift • 08:00 - 16:00</p>
          </div>
        </div>
      </div>
    </header>
  );
}
