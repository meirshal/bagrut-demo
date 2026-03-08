import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <div dir="rtl" className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar on the RIGHT (appears first in RTL flex) */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main
            className={cn(
              'flex-1 overflow-y-auto p-6 transition-all duration-300'
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
