import { useMemo, useState } from 'react';
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
import { getRikuzByPeriod } from '@/data/mock-data';
import type { EligibilityStats, FailureStats, RikuzRow } from '@/types';
import { RikuzScheme } from '@/types';

// ─── Category definitions for both schemes ───────────────────────────────────

interface CategoryDef<K extends string> {
  key: K;
  label: string;
  colorClass: string;
}

const ELIGIBILITY_CATEGORIES: CategoryDef<keyof Omit<EligibilityStats, 'total'>>[] = [
  { key: 'fullBagrut', label: 'בגרות מלאה', colorClass: 'bg-emerald-50' },
  { key: 'fullDespiteMissing', label: 'בגרות מלאה למרות בחינה חסרה', colorClass: 'bg-emerald-50/60' },
  { key: 'missing1', label: 'חסרה 1', colorClass: 'bg-orange-50' },
  { key: 'missing2', label: 'חסרות 2', colorClass: 'bg-orange-50' },
  { key: 'missing3', label: 'חסרות 3', colorClass: 'bg-red-50' },
  { key: 'missing4Plus', label: 'חסרות 4+', colorClass: 'bg-red-50' },
  { key: 'nonMatriculation', label: 'לא בגרותי', colorClass: 'bg-red-100' },
];

const FAILURE_CATEGORIES: CategoryDef<keyof Omit<FailureStats, 'total'>>[] = [
  { key: 'noFailures', label: 'ללא נכשלים', colorClass: 'bg-emerald-50' },
  { key: 'failures1', label: 'נכשל 1', colorClass: 'bg-amber-50' },
  { key: 'failures2', label: '2 נכשלים', colorClass: 'bg-orange-50' },
  { key: 'failures3', label: '3 נכשלים', colorClass: 'bg-orange-50' },
  { key: 'failures4', label: '4 נכשלים', colorClass: 'bg-red-50' },
  { key: 'failures5Plus', label: '5+ נכשלים', colorClass: 'bg-red-50' },
  { key: 'nonMatriculation', label: 'לא בגרותי', colorClass: 'bg-red-100' },
];

// ─── Cell styling ────────────────────────────────────────────────────────────

function getCellStyle(value: number, categoryKey: string): string {
  if (value === 0) return 'text-slate-300';

  // Positive categories
  if (categoryKey === 'fullBagrut' || categoryKey === 'fullDespiteMissing' || categoryKey === 'noFailures') {
    if (value >= 20) return 'bg-emerald-100 text-emerald-800 font-semibold';
    if (value >= 10) return 'bg-emerald-50 text-emerald-700';
    return 'text-emerald-600';
  }

  // Severe categories
  if (
    categoryKey === 'nonMatriculation' ||
    categoryKey === 'missing4Plus' ||
    categoryKey === 'missing3' ||
    categoryKey === 'failures5Plus' ||
    categoryKey === 'failures4'
  ) {
    if (value >= 3) return 'bg-red-100 text-red-700 font-semibold';
    if (value >= 1) return 'text-red-600';
    return '';
  }

  // Mid-level concern
  if (
    categoryKey === 'missing2' ||
    categoryKey === 'missing1' ||
    categoryKey === 'failures3' ||
    categoryKey === 'failures2' ||
    categoryKey === 'failures1'
  ) {
    if (value >= 5) return 'bg-amber-100 text-amber-800 font-semibold';
    if (value >= 2) return 'text-amber-700';
    return 'text-amber-600';
  }

  return '';
}

// ─── Component ───────────────────────────────────────────────────────────────

interface RikuzMatrixProps {
  selectedPeriod: string;
}

export function RikuzMatrix({ selectedPeriod }: RikuzMatrixProps) {
  const [scheme, setScheme] = useState<RikuzScheme>(RikuzScheme.EXAM_MISSING);

  const data = useMemo(() => {
    const rikuzData = getRikuzByPeriod(selectedPeriod);

    // Separate regular classes from special class (class 12 / ch"m)
    const regularRows = rikuzData.filter((r) => !r.isSpecialClass);
    const specialRows = rikuzData.filter((r) => r.isSpecialClass);

    // Compute totals for regular classes
    const regularTotals: Record<string, number> = {};
    const specialTotals: Record<string, number> = {};
    const combinedTotals: Record<string, number> = {};
    let regularGrandTotal = 0;
    let specialGrandTotal = 0;

    const isEligibility = scheme === RikuzScheme.EXAM_MISSING;
    const categories = isEligibility ? ELIGIBILITY_CATEGORIES : FAILURE_CATEGORIES;

    for (const cat of categories) {
      regularTotals[cat.key] = 0;
      specialTotals[cat.key] = 0;
      combinedTotals[cat.key] = 0;
    }

    for (const row of regularRows) {
      regularGrandTotal += row.stats.total;
      for (const cat of categories) {
        const statsObj = isEligibility ? row.stats : row.failureStats;
        const val = (statsObj as unknown as Record<string, number>)[cat.key] ?? 0;
        regularTotals[cat.key] += val;
        combinedTotals[cat.key] += val;
      }
    }

    for (const row of specialRows) {
      specialGrandTotal += row.stats.total;
      for (const cat of categories) {
        const statsObj = isEligibility ? row.stats : row.failureStats;
        const val = (statsObj as unknown as Record<string, number>)[cat.key] ?? 0;
        specialTotals[cat.key] += val;
        combinedTotals[cat.key] += val;
      }
    }

    const combinedGrandTotal = regularGrandTotal + specialGrandTotal;

    return {
      regularRows,
      specialRows,
      regularTotals,
      specialTotals,
      combinedTotals,
      regularGrandTotal,
      specialGrandTotal,
      combinedGrandTotal,
    };
  }, [selectedPeriod, scheme]);

  const isEligibility = scheme === RikuzScheme.EXAM_MISSING;
  const categories = isEligibility ? ELIGIBILITY_CATEGORIES : FAILURE_CATEGORIES;

  function getValueFromRow(row: RikuzRow, catKey: string): number {
    const statsObj = isEligibility ? row.stats : row.failureStats;
    return (statsObj as unknown as Record<string, number>)[catKey] ?? 0;
  }

  return (
    <Card className="rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="inline-block w-1.5 h-5 bg-indigo-500 rounded-full" />
            ריכוז זכאות לבגרות לפי כיתות
          </CardTitle>

          {/* Scheme toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setScheme(RikuzScheme.EXAM_MISSING)}
              className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                scheme === RikuzScheme.EXAM_MISSING
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              לפי בחינות חסרות
            </button>
            <button
              onClick={() => setScheme(RikuzScheme.FAILURE_COUNT)}
              className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                scheme === RikuzScheme.FAILURE_COUNT
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              לפי מספר כישלונות
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto scrollbar-thin">
        <Table className="text-[11px]">
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="sticky right-0 z-10 bg-slate-50 text-right min-w-[160px] text-xs font-bold border-l">
                קטגוריה
              </TableHead>
              {data.regularRows.map((row) => (
                <TableHead
                  key={row.classId}
                  className="text-center px-1.5 text-xs font-bold min-w-[42px]"
                >
                  {row.className}
                </TableHead>
              ))}
              <TableHead className="text-center px-1.5 text-xs font-bold bg-indigo-50 border-r border-l min-w-[56px]">
                סה״כ
                <div className="text-[9px] font-normal text-slate-500">ללא ח&quot;מ</div>
              </TableHead>
              {data.specialRows.map((row) => (
                <TableHead
                  key={row.classId}
                  className="text-center px-1.5 text-xs font-bold bg-amber-50/50 min-w-[42px]"
                >
                  ח&quot;מ
                  <div className="text-[9px] font-normal text-slate-500">{row.className}</div>
                </TableHead>
              ))}
              <TableHead className="text-center px-1.5 text-xs font-bold bg-slate-100 border-r min-w-[56px]">
                סה״כ
                <div className="text-[9px] font-normal text-slate-500">כולל ח&quot;מ</div>
              </TableHead>
              <TableHead className="text-center px-1.5 text-xs font-bold bg-slate-100 min-w-[55px]">
                %
                <div className="text-[9px] font-normal text-slate-500">ללא ח&quot;מ</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat, catIdx) => {
              const regularTotal = data.regularTotals[cat.key];
              const combinedTotal = data.combinedTotals[cat.key];
              const pctWithoutSpecial =
                data.regularGrandTotal > 0
                  ? ((regularTotal / data.regularGrandTotal) * 100).toFixed(1)
                  : '0.0';

              return (
                <TableRow
                  key={cat.key}
                  className={`${catIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-blue-50/40 transition-colors`}
                >
                  <TableCell className={`sticky right-0 z-10 font-medium text-right pr-3 border-l ${cat.colorClass} text-[11px]`}>
                    {cat.label}
                  </TableCell>
                  {data.regularRows.map((row) => {
                    const value = getValueFromRow(row, cat.key);
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
                  {/* Total without special class */}
                  <TableCell dir="ltr" className="text-center font-bold bg-indigo-50/60 border-r border-l tabular-nums">
                    {regularTotal}
                  </TableCell>
                  {/* Special class columns */}
                  {data.specialRows.map((row) => {
                    const value = getValueFromRow(row, cat.key);
                    return (
                      <TableCell
                        key={row.classId}
                        dir="ltr"
                        className={`text-center px-1 tabular-nums bg-amber-50/30 ${getCellStyle(value, cat.key)}`}
                      >
                        {value === 0 ? '–' : value}
                      </TableCell>
                    );
                  })}
                  {/* Combined total */}
                  <TableCell dir="ltr" className="text-center font-bold bg-slate-50 border-r tabular-nums">
                    {combinedTotal}
                  </TableCell>
                  {/* Percentage (without special class) */}
                  <TableCell dir="ltr" className="text-center font-semibold bg-slate-50 tabular-nums">
                    {pctWithoutSpecial}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            {/* Student count row */}
            <TableRow className="bg-slate-100 font-bold">
              <TableCell className="sticky right-0 z-10 bg-slate-100 text-right pr-3 border-l text-[11px]">
                סה״כ תלמידים
              </TableCell>
              {data.regularRows.map((row) => (
                <TableCell key={row.classId} className="text-center tabular-nums">
                  {row.stats.total}
                </TableCell>
              ))}
              <TableCell className="text-center border-r border-l tabular-nums bg-indigo-50">
                {data.regularGrandTotal}
              </TableCell>
              {data.specialRows.map((row) => (
                <TableCell key={row.classId} className="text-center tabular-nums bg-amber-50/50">
                  {row.stats.total}
                </TableCell>
              ))}
              <TableCell className="text-center border-r tabular-nums">
                {data.combinedGrandTotal}
              </TableCell>
              <TableCell className="text-center tabular-nums">100%</TableCell>
            </TableRow>
            {/* Percentage row - eligibility rate per class */}
            <TableRow className="bg-slate-50 font-semibold text-[10px]">
              <TableCell className="sticky right-0 z-10 bg-slate-50 text-right pr-3 border-l text-[11px]">
                % זכאות
              </TableCell>
              {data.regularRows.map((row) => {
                const eligible = isEligibility
                  ? row.stats.fullBagrut + row.stats.fullDespiteMissing
                  : row.failureStats.noFailures;
                const total = row.stats.total;
                const pct = total > 0 ? ((eligible / total) * 100).toFixed(0) : '–';
                const pctNum = total > 0 ? (eligible / total) * 100 : 0;
                return (
                  <TableCell
                    key={row.classId}
                    dir="ltr"
                    className={`text-center tabular-nums ${
                      pctNum >= 80
                        ? 'text-emerald-700'
                        : pctNum >= 60
                          ? 'text-amber-700'
                          : 'text-red-600'
                    }`}
                  >
                    {pct}%
                  </TableCell>
                );
              })}
              {/* Totals percentage without special */}
              {(() => {
                const eligible = isEligibility
                  ? data.regularTotals['fullBagrut'] + data.regularTotals['fullDespiteMissing']
                  : data.regularTotals['noFailures'];
                const pct =
                  data.regularGrandTotal > 0
                    ? ((eligible / data.regularGrandTotal) * 100).toFixed(1)
                    : '–';
                return (
                  <TableCell dir="ltr" className="text-center tabular-nums border-r border-l bg-indigo-50 text-indigo-700 font-bold">
                    {pct}%
                  </TableCell>
                );
              })()}
              {/* Special class percentage */}
              {data.specialRows.map((row) => {
                const eligible = isEligibility
                  ? row.stats.fullBagrut + row.stats.fullDespiteMissing
                  : row.failureStats.noFailures;
                const total = row.stats.total;
                const pct = total > 0 ? ((eligible / total) * 100).toFixed(0) : '–';
                return (
                  <TableCell
                    key={row.classId}
                    dir="ltr"
                    className="text-center tabular-nums bg-amber-50/50 text-amber-700"
                  >
                    {pct}%
                  </TableCell>
                );
              })}
              {/* Combined percentage */}
              {(() => {
                const eligible = isEligibility
                  ? data.combinedTotals['fullBagrut'] + data.combinedTotals['fullDespiteMissing']
                  : data.combinedTotals['noFailures'];
                const pct =
                  data.combinedGrandTotal > 0
                    ? ((eligible / data.combinedGrandTotal) * 100).toFixed(1)
                    : '–';
                return (
                  <TableCell dir="ltr" className="text-center tabular-nums border-r font-bold">
                    {pct}%
                  </TableCell>
                );
              })()}
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
