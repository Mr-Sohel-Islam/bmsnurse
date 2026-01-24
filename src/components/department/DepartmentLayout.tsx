import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";

interface DepartmentLayoutProps {
  children: ReactNode;
  title?: string;
  icon?: LucideIcon;
  headerActions?: ReactNode;
}

export function DepartmentLayout({ 
  children, 
  title, 
  icon: Icon, 
  headerActions 
}: DepartmentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopHeader sidebarCollapsed={false} />
      <main className="transition-all duration-300 pt-20 pb-8 px-6 ml-64">
        {(title || headerActions) && (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              )}
              {title && <h1 className="text-3xl font-bold">{title}</h1>}
            </div>
            {headerActions}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
