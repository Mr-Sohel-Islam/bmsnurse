import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";

interface DepartmentLayoutProps {
  children: ReactNode;
}

export function DepartmentLayout({ children }: DepartmentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <TopHeader sidebarCollapsed={false} />
      <main className="transition-all duration-300 pt-20 pb-8 px-6 ml-64">
        {children}
      </main>
    </div>
  );
}
