import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bed,
  Siren,
  Building2,
  ClipboardList,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "All Patients", path: "/patients" },
  { icon: Building2, label: "OPD", path: "/opd", badge: 2 },
  { icon: Bed, label: "IPD", path: "/ipd", badge: 4 },
  { icon: Siren, label: "Emergency", path: "/emergency", badge: 2, critical: true },
  { icon: ClipboardList, label: "Tasks", path: "/tasks" },
  { icon: Bell, label: "Alerts", path: "/alerts", badge: 5 },
];

const bottomMenuItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogOut, label: "Logout", path: "/logout" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-sidebar-foreground">MediCare</h1>
              <p className="text-xs text-sidebar-foreground/60">Patient Monitor</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "absolute -right-3 top-6 bg-sidebar border border-sidebar-border rounded-full w-6 h-6 p-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        item.critical && "bg-status-critical text-white animate-pulse"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span
                  className={cn(
                    "absolute top-1 right-1 w-2 h-2 rounded-full",
                    item.critical ? "bg-status-critical animate-pulse" : "bg-primary"
                  )}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {bottomMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
              "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">SJ</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">Sarah Johnson</p>
              <p className="text-xs text-sidebar-foreground/60">Head Nurse • IPD</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
