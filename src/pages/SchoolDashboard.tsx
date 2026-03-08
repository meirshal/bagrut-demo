import { getAllStudents, getExamPeriods } from '@/data/mock-data';
import { KPICards } from '@/components/dashboard/KPICards';
import { RikuzMatrix } from '@/components/dashboard/RikuzMatrix';
import { TrendCharts } from '@/components/dashboard/TrendCharts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { usePeriod } from '@/components/layout/AppShell';

export function SchoolDashboard() {
  const totalStudents = getAllStudents().length;
  const { selectedPeriod } = usePeriod();
  const periods = getExamPeriods();
  const currentPeriodName = periods.find((p) => p.id === selectedPeriod)?.name ?? 'אחרי חורף+תיקונים';

  return (
    <div dir="rtl" className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">לוח בקרה</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            סקירה כללית של מצב הבגרויות בבית הספר &middot; {totalStudents} תלמידים ב-16 כיתות &middot; תשפ״ה
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 px-3 py-1.5 rounded-lg border">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          מועד פעיל: {currentPeriodName}
        </div>
      </div>

      {/* KPI Cards Row */}
      <KPICards selectedPeriod={selectedPeriod} />

      {/* Rikuz Matrix - Full Width */}
      <RikuzMatrix selectedPeriod={selectedPeriod} />

      {/* Bottom Section: Trends + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7">
          <TrendCharts />
        </div>
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
