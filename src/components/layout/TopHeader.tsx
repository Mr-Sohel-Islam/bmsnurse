import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  sidebarCollapsed?: boolean;
}

export function TopHeader({ sidebarCollapsed = false }: TopHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-card border-b border-border transition-all duration-300",
        isMobile ? "left-0" : sidebarCollapsed ? "left-20" : "left-64"
      )}
    >
      <div className={cn(
        "flex items-center justify-between h-full px-4 md:px-6",
        isMobile && "pl-16" // Space for mobile menu button
      )}>
        {/* Search - hidden on small mobile, visible on larger screens */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, rooms..."
              className="pl-10 bg-muted/50 border-0"
            />
          </div>
          {/* Mobile search icon */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Add Patient - icon only on mobile */}
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Patient</span>
          </Button>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-status-critical text-white text-xs"
            >
              3
            </Badge>
          </Button>

          {/* Date/Shift info - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <div className="h-8 w-px bg-border" />
            <div className="text-right">
              <p className="text-sm font-medium">Jan 22, 2026</p>
              <p className="text-xs text-muted-foreground">Day Shift • 08:00 - 16:00</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
