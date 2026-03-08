import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getYearComparisons } from '@/data/mock-data';

interface MiniChartProps {
  title: string;
  dataKey: string;
  data: Array<Record<string, string | number>>;
  color: string;
  gradientId: string;
  suffix?: string;
  domain?: [number, number];
}

function MiniChart({ title, dataKey, data, color, gradientId, suffix = '%', domain }: MiniChartProps) {
  const lastValue = data[data.length - 1]?.[dataKey];
  const prevValue = data[data.length - 2]?.[dataKey];
  const isDecline = typeof lastValue === 'number' && typeof prevValue === 'number' && lastValue < prevValue;

  return (
    <Card className="rounded-xl shadow-md flex-1">
      <CardHeader className="pb-1 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold text-slate-700">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-slate-900">
              {typeof lastValue === 'number' ? lastValue.toFixed(1) : lastValue}{suffix}
            </span>
            <span className={`text-xs ${isDecline ? 'text-red-500' : 'text-emerald-600'}`}>
              {isDecline ? '↓' : '↑'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div style={{ width: '100%', height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                domain={domain || ['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
                  direction: 'rtl',
                  fontFamily: 'Heebo, sans-serif',
                }}
                formatter={(value) => [`${Number(value).toFixed(1)}${suffix}`, title]}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                dot={{ r: 3, fill: color, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendCharts() {
  const chartData = useMemo(() => {
    return getYearComparisons().map((yc) => ({
      year: yc.year,
      eligibilityRate: yc.eligibilityRate,
      excellenceRate: yc.excellenceRate,
      math5Rate: yc.math5Rate,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-indigo-500 rounded-full" />
        מגמות רב-שנתיות
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniChart
          title="אחוזי זכאות"
          dataKey="eligibilityRate"
          data={chartData}
          color="#16a34a"
          gradientId="gradEligibility"
          domain={[65, 85]}
        />
        <MiniChart
          title="אחוזי הצטיינות"
          dataKey="excellenceRate"
          data={chartData}
          color="#2563eb"
          gradientId="gradExcellence"
          domain={[15, 25]}
        />
        <MiniChart
          title='5 יח"ל מתמטיקה'
          dataKey="math5Rate"
          data={chartData}
          color="#9333ea"
          gradientId="gradMath5"
          domain={[28, 42]}
        />
      </div>
    </div>
  );
}
