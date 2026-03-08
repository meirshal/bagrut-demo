import { useMemo } from 'react';
import { Users, Award, AlertTriangle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getKPIByPeriod, getYearComparisons } from '@/data/mock-data';

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  trend: { direction: 'up' | 'down'; value: string };
  accentColor: string;
  accentBg: string;
}

function KPICard({ icon, title, value, subtitle, trend, accentColor, accentBg }: KPICardProps) {
  const isPositiveTrend =
    (trend.direction === 'up' && title !== 'תלמידים בסיכון') ||
    (trend.direction === 'down' && title === 'תלמידים בסיכון');

  return (
    <Card className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
      <CardContent className="p-5 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums" dir="ltr" style={{ textAlign: 'right' }}>{value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: accentBg }}
          >
            <div style={{ color: accentColor }}>{icon}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 ${
              isPositiveTrend ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs text-muted-foreground">לעומת שנה קודמת</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  selectedPeriod: string;
}

export function KPICards({ selectedPeriod }: KPICardsProps) {
  const data = useMemo(() => {
    const kpi = getKPIByPeriod(selectedPeriod);
    const yearComps = getYearComparisons();

    // Trends: compare current year rates to previous year
    const currentYear = yearComps[yearComps.length - 1];
    const previousYear = yearComps[yearComps.length - 2];
    const eligibilityTrendDiff = (currentYear.eligibilityRate - previousYear.eligibilityRate).toFixed(1);
    const excellenceTrendDiff = (currentYear.excellenceRate - previousYear.excellenceRate).toFixed(1);

    return {
      ...kpi,
      eligibilityTrendDiff,
      excellenceTrendDiff,
    };
  }, [selectedPeriod]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        icon={<Users className="w-5 h-5" />}
        title="סה״כ תלמידים"
        value={data.totalStudents}
        subtitle="ב-16 כיתות יב"
        trend={{ direction: 'up', value: '2.1%' }}
        accentColor="#6366f1"
        accentBg="#eef2ff"
      />
      <KPICard
        icon={<Award className="w-5 h-5" />}
        title="זכאים לבגרות מלאה"
        value={data.fullEligible}
        subtitle={`${data.eligiblePct}% מכלל התלמידים`}
        trend={{
          direction: parseFloat(data.eligibilityTrendDiff) >= 0 ? 'up' : 'down',
          value: `${Math.abs(parseFloat(data.eligibilityTrendDiff))}%`,
        }}
        accentColor="#16a34a"
        accentBg="#f0fdf4"
      />
      <KPICard
        icon={<AlertTriangle className="w-5 h-5" />}
        title="תלמידים בסיכון"
        value={data.atRisk}
        subtitle={`${data.atRiskPct}% מכלל התלמידים`}
        trend={{ direction: 'up', value: '1.4%' }}
        accentColor="#d97706"
        accentBg="#fffbeb"
      />
      <KPICard
        icon={<Star className="w-5 h-5" />}
        title="מועמדים להצטיינות"
        value={data.excellence}
        subtitle={`${data.excellencePct}% מכלל התלמידים`}
        trend={{
          direction: parseFloat(data.excellenceTrendDiff) >= 0 ? 'up' : 'down',
          value: `${Math.abs(parseFloat(data.excellenceTrendDiff))}%`,
        }}
        accentColor="#2563eb"
        accentBg="#eff6ff"
      />
    </div>
  );
}
