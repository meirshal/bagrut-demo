import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface PeriodContextValue {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

const PeriodContext = createContext<PeriodContextValue>({
  selectedPeriod: 'corrections',
  setSelectedPeriod: () => {},
});

export function usePeriod() {
  return useContext(PeriodContext);
}

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('corrections');

  return (
    <PeriodContext.Provider value={{ selectedPeriod, setSelectedPeriod }}>
      <TooltipProvider>
        <div dir="rtl" className="flex h-screen overflow-hidden bg-background">
          {/* Sidebar on the RIGHT (appears first in RTL flex) */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          />

          {/* Main content area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
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
    </PeriodContext.Provider>
  );
}
