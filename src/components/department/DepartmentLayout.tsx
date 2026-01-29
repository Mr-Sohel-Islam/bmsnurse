import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopHeader sidebarCollapsed={false} />
      <main className={cn(
        "transition-all duration-300 pt-20 pb-8 px-4 md:px-6",
        isMobile ? "ml-0" : "ml-64"
      )}>
        {(title || headerActions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              )}
              {title && <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>}
            </div>
            {headerActions && (
              <div className="flex items-center gap-2 flex-wrap">
                {headerActions}
              </div>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
