import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { getRikuzData } from '@/data/mock-data';
import type { EligibilityStats } from '@/types';

// The 8 eligibility category labels in Hebrew
const CATEGORIES: { key: keyof Omit<EligibilityStats, 'total'>; label: string; colorClass: string }[] = [
  { key: 'fullBagrut', label: 'בגרות מלאה', colorClass: 'bg-emerald-50' },
  { key: 'fullDespiteMissing', label: 'בגרות מלאה למרות בחינה חסרה', colorClass: 'bg-emerald-50/60' },
  { key: 'partial', label: 'חלקית', colorClass: 'bg-amber-50' },
  { key: 'missing1', label: 'חסר 1', colorClass: 'bg-orange-50' },
  { key: 'missing2', label: 'חסרים 2', colorClass: 'bg-orange-50' },
  { key: 'missing3', label: 'חסרים 3', colorClass: 'bg-red-50' },
  { key: 'missing4Plus', label: 'חסרים 4+', colorClass: 'bg-red-50' },
  { key: 'nonMatriculation', label: 'לא בגרותי', colorClass: 'bg-red-100' },
];

function getCellStyle(value: number, categoryKey: string): string {
  if (value === 0) return 'text-slate-300';

  // For positive categories (full bagrut), higher numbers are green
  if (categoryKey === 'fullBagrut' || categoryKey === 'fullDespiteMissing') {
    if (value >= 20) return 'bg-emerald-100 text-emerald-800 font-semibold';
    if (value >= 10) return 'bg-emerald-50 text-emerald-700';
    return 'text-emerald-600';
  }

  // For concerning categories, higher numbers are red
  if (categoryKey === 'nonMatriculation' || categoryKey === 'missing4Plus' || categoryKey === 'missing3') {
    if (value >= 3) return 'bg-red-100 text-red-700 font-semibold';
    if (value >= 1) return 'text-red-600';
    return '';
  }

  if (categoryKey === 'missing2' || categoryKey === 'missing1') {
    if (value >= 5) return 'bg-amber-100 text-amber-800 font-semibold';
    if (value >= 2) return 'text-amber-700';
    return 'text-amber-600';
  }

  return '';
}

export function RikuzMatrix() {
  const data = useMemo(() => {
    const rikuzData = getRikuzData();
    // Compute totals across all classes for each category
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    for (const cat of CATEGORIES) {
      totals[cat.key] = 0;
    }
    for (const row of rikuzData) {
      grandTotal += row.stats.total;
      for (const cat of CATEGORIES) {
        totals[cat.key] += row.stats[cat.key];
      }
    }
    return { rikuzData, totals, grandTotal };
  }, []);

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="inline-block w-1.5 h-5 bg-indigo-500 rounded-full" />
          ריכוז זכאות לבגרות לפי כיתות
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto scrollbar-thin">
        <Table className="text-[11px]">
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="sticky right-0 z-10 bg-slate-50 text-right min-w-[160px] text-xs font-bold border-l">
                קטגוריה
              </TableHead>
              {data.rikuzData.map((row) => (
                <TableHead
                  key={row.classId}
                  className="text-center px-1.5 text-xs font-bold min-w-[42px]"
                >
                  {row.className}
                </TableHead>
              ))}
              <TableHead className="text-center px-1.5 text-xs font-bold bg-slate-100 border-r min-w-[50px]">
                סה״כ
              </TableHead>
              <TableHead className="text-center px-1.5 text-xs font-bold bg-slate-100 min-w-[55px]">
                אחוז
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORIES.map((cat, catIdx) => (
              <TableRow
                key={cat.key}
                className={`${catIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-blue-50/40 transition-colors`}
              >
                <TableCell className={`sticky right-0 z-10 font-medium text-right pr-3 border-l ${cat.colorClass} text-[11px]`}>
                  {cat.label}
                </TableCell>
                {data.rikuzData.map((row) => {
                  const value = row.stats[cat.key];
                  return (
                    <TableCell
                      key={row.classId}
                      dir="ltr"
                      className={`text-center px-1 tabular-nums ${getCellStyle(value, cat.key)}`}
                    >
                      {value === 0 ? '–' : value}
                    </TableCell>
                  );
                })}
                <TableCell dir="ltr" className="text-center font-bold bg-slate-50 border-r tabular-nums">
                  {data.totals[cat.key]}
                </TableCell>
                <TableCell dir="ltr" className="text-center font-semibold bg-slate-50 tabular-nums">
                  {data.grandTotal > 0
                    ? `${((data.totals[cat.key] / data.grandTotal) * 100).toFixed(1)}%`
                    : '–'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-slate-100 font-bold">
              <TableCell className="sticky right-0 z-10 bg-slate-100 text-right pr-3 border-l text-[11px]">
                סה״כ תלמידים
              </TableCell>
              {data.rikuzData.map((row) => (
                <TableCell key={row.classId} className="text-center tabular-nums">
                  {row.stats.total}
                </TableCell>
              ))}
              <TableCell className="text-center border-r tabular-nums">
                {data.grandTotal}
              </TableCell>
              <TableCell className="text-center tabular-nums">100%</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
