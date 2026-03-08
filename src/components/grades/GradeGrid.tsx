import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type CellContext,
  type HeaderContext,
} from '@tanstack/react-table';
import type { Student } from '@/types';
import { getStudentsByClass } from '@/lib/utils';
import { BG_COLORS, TEXT_COLORS, getScoreCellStyle } from '@/lib/colors';
import { ScoreCell } from './ScoreCell';
import { RiskBadge } from './RiskBadge';

// The 7 core subjects to display
const CORE_SUBJECTS = [
  { id: 'math', name: 'מתמטיקה' },
  { id: 'history', name: 'היסטוריה' },
  { id: 'civics', name: 'אזרחות' },
  { id: 'tanakh', name: 'תנ"ך' },
  { id: 'literature', name: 'ספרות' },
  { id: 'language', name: 'לשון' },
  { id: 'english', name: 'אנגלית' },
] as const;

// Sub-column types under each subject
const GRADE_TYPES = ['internal', 'external', 'final'] as const;
type GradeType = (typeof GRADE_TYPES)[number];

const GRADE_TYPE_LABELS: Record<GradeType, string> = {
  internal: 'פנימי',
  external: 'חיצוני',
  final: 'סופי',
};

interface GradeGridProps {
  classId: string;
}

// ─── Summary row type ────────────────────────────────────────────────────────

// ─── Helper: compute class averages ──────────────────────────────────────────

function computeClassAverages(students: Student[]) {
  const avgs: Record<string, Record<GradeType, { sum: number; count: number }>> = {};
  let waSum = 0;

  for (const subj of CORE_SUBJECTS) {
    avgs[subj.id] = {
      internal: { sum: 0, count: 0 },
      external: { sum: 0, count: 0 },
      final: { sum: 0, count: 0 },
    };
  }

  for (const student of students) {
    waSum += student.weightedAverage;
    for (const subj of CORE_SUBJECTS) {
      const grades = student.grades[subj.id];
      if (!grades) continue;
      if (grades.internal !== undefined) {
        avgs[subj.id].internal.sum += grades.internal;
        avgs[subj.id].internal.count++;
      }
      if (grades.external !== undefined) {
        avgs[subj.id].external.sum += grades.external;
        avgs[subj.id].external.count++;
      }
      avgs[subj.id].final.sum += grades.final;
      avgs[subj.id].final.count++;
    }
  }

  const result: Record<string, Record<GradeType, number | null>> = {};
  for (const subj of CORE_SUBJECTS) {
    result[subj.id] = {
      internal: avgs[subj.id].internal.count > 0
        ? Math.round((avgs[subj.id].internal.sum / avgs[subj.id].internal.count) * 10) / 10
        : null,
      external: avgs[subj.id].external.count > 0
        ? Math.round((avgs[subj.id].external.sum / avgs[subj.id].external.count) * 10) / 10
        : null,
      final: avgs[subj.id].final.count > 0
        ? Math.round((avgs[subj.id].final.sum / avgs[subj.id].final.count) * 10) / 10
        : null,
    };
  }

  return {
    subjectAverages: result,
    weightedAverage: students.length > 0 ? Math.round((waSum / students.length) * 10) / 10 : null,
  };
}

function computeExamCounts(students: Student[]) {
  const counts: Record<string, Record<GradeType, number>> = {};
  for (const subj of CORE_SUBJECTS) {
    counts[subj.id] = { internal: 0, external: 0, final: 0 };
  }
  for (const student of students) {
    for (const subj of CORE_SUBJECTS) {
      const grades = student.grades[subj.id];
      if (!grades) continue;
      if (grades.internal !== undefined) counts[subj.id].internal++;
      if (grades.external !== undefined) counts[subj.id].external++;
      counts[subj.id].final++;
    }
  }
  return counts;
}

// ─── Sticky column width constants ───────────────────────────────────────────

const COL_NUM_W = 40;
const COL_NAME_W = 140;
const COL_RISK_W = 45;
const COL_AVG_W = 55;
const STICKY_TOTAL = COL_NUM_W + COL_NAME_W + COL_RISK_W + COL_AVG_W; // 280px
const SUBJECT_COL_W = 45;

export function GradeGrid({ classId }: GradeGridProps) {
  const students = useMemo(() => {
    const s = getStudentsByClass(classId);
    // Sort by last name then first name
    return [...s].sort((a, b) =>
      a.lastName.localeCompare(b.lastName, 'he') ||
      a.firstName.localeCompare(b.firstName, 'he')
    );
  }, [classId]);

  const averages = useMemo(() => computeClassAverages(students), [students]);
  const examCounts = useMemo(() => computeExamCounts(students), [students]);

  // ─── Column definitions ──────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<Student>[]>(() => {
    const frozen: ColumnDef<Student>[] = [
      {
        id: 'rowNum',
        header: '#',
        size: COL_NUM_W,
        cell: (info: CellContext<Student, unknown>) => (
          <span className="text-[10px] text-slate-400 tabular-nums">
            {info.row.index + 1}
          </span>
        ),
      },
      {
        id: 'name',
        header: 'שם',
        size: COL_NAME_W,
        accessorFn: (row: Student) => `${row.lastName} ${row.firstName}`,
        cell: (info: CellContext<Student, unknown>) => (
          <span className="text-xs font-medium text-slate-800 truncate block max-w-[130px]">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: 'risk',
        header: 'צפי',
        size: COL_RISK_W,
        accessorFn: (row: Student) => row.riskLevel,
        cell: (info: CellContext<Student, unknown>) => (
          <RiskBadge level={info.row.original.riskLevel} />
        ),
      },
      {
        id: 'weightedAvg',
        header: 'ממ"ש',
        size: COL_AVG_W,
        accessorFn: (row: Student) => row.weightedAverage,
        cell: (info: CellContext<Student, unknown>) => {
          const score = info.row.original.weightedAverage;
          const cellStyle = getScoreCellStyle(Math.round(score));
          return (
            <span
              className="text-xs font-bold tabular-nums"
              style={cellStyle}
            >
              {score.toFixed(1)}
            </span>
          );
        },
      },
    ];

    // Subject group columns
    const subjectGroups: ColumnDef<Student>[] = CORE_SUBJECTS.map((subj) => ({
      id: `subject_${subj.id}`,
      header: () => (
        <span className="text-[10px] font-bold">{subj.name}</span>
      ),
      columns: GRADE_TYPES.map((gradeType) => ({
        id: `${subj.id}_${gradeType}`,
        header: (_info: HeaderContext<Student, unknown>) => (
          <span className="text-[10px]">{GRADE_TYPE_LABELS[gradeType]}</span>
        ),
        size: SUBJECT_COL_W,
        accessorFn: (row: Student) => {
          const grades = row.grades[subj.id];
          if (!grades) return undefined;
          if (gradeType === 'internal') return grades.internal;
          if (gradeType === 'external') return grades.external;
          return grades.final;
        },
        cell: (info: CellContext<Student, unknown>) => {
          const val = info.getValue() as number | undefined;
          return <ScoreCell score={val} />;
        },
      })),
    }));

    return [...frozen, ...subjectGroups];
  }, []);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        לא נמצאו תלמידים בכיתה זו
      </div>
    );
  }

  // ─── Sticky position helpers (RTL: sticky from right) ────────────────────

  // For RTL, the first column is on the right.
  // We need cumulative right offsets for each frozen column.
  const stickyRightOffsets = [
    0,                               // rowNum: right-0
    COL_NUM_W,                       // name: right-40px
    COL_NUM_W + COL_NAME_W,          // risk: right-180px
    COL_NUM_W + COL_NAME_W + COL_RISK_W, // weightedAvg: right-225px
  ];

  function getStickyStyle(colIndex: number): React.CSSProperties | undefined {
    if (colIndex < 4) {
      return {
        position: 'sticky',
        right: stickyRightOffsets[colIndex],
        zIndex: 20,
      };
    }
    return undefined;
  }

  function getHeaderBgForGradeCol(colId: string): string | undefined {
    if (colId.endsWith('_internal')) return BG_COLORS.componentInternal + '33'; // ~20% opacity
    if (colId.endsWith('_external')) return BG_COLORS.componentExternal + '22'; // ~13% opacity
    return undefined;
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5">
      <div className="overflow-x-auto scrollbar-thin">
        <table
          className="border-collapse text-xs"
          style={{ minWidth: STICKY_TOTAL + CORE_SUBJECTS.length * 3 * SUBJECT_COL_W }}
        >
          {/* ── Header rows ─────────────────────────────────────────── */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-100">
                {headerGroup.headers.map((header) => {
                  const colIndex = header.index;
                  const isFrozen = colIndex < 4 && headerGroup.depth === 1;
                  const isTopFrozen = colIndex < 4 && headerGroup.depth === 0;
                  const stickyStyle = (isFrozen || isTopFrozen) ? getStickyStyle(
                    // For top-level headers on frozen columns, compute offset
                    // The top header group spans cols 0-3 as individual columns
                    isTopFrozen ? colIndex : colIndex
                  ) : undefined;

                  // Background tint for grade type columns
                  const bgTint = getHeaderBgForGradeCol(header.column.id);
                  const isFinalCol = header.column.id.endsWith('_final');

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`
                        border border-slate-200 px-1 py-1.5 text-center align-middle
                        whitespace-nowrap select-none
                        ${(isFrozen || isTopFrozen) ? 'bg-slate-100' : ''}
                        ${isFinalCol ? 'font-bold' : 'font-medium'}
                        ${header.colSpan > 1 ? 'border-b-2 border-b-indigo-200' : ''}
                      `}
                      style={{
                        ...(stickyStyle || {}),
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        ...(bgTint ? { backgroundColor: bgTint } : {}),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* ── Body rows ───────────────────────────────────────────── */}
          <tbody>
            {table.getRowModel().rows.map((row, rowIdx) => (
              <tr
                key={row.id}
                className={`
                  ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                  hover:bg-blue-50/40 transition-colors
                `}
              >
                {row.getVisibleCells().map((cell) => {
                  const colIndex = cell.column.getIndex();
                  const isFrozen = colIndex < 4;
                  const stickyStyle = isFrozen ? getStickyStyle(colIndex) : undefined;
                  const bgTint = getHeaderBgForGradeCol(cell.column.id);

                  return (
                    <td
                      key={cell.id}
                      className={`
                        border border-slate-200 px-1 py-0.5 text-center align-middle
                        ${isFrozen
                          ? (rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50')
                          : ''
                        }
                      `}
                      style={{
                        ...(stickyStyle || {}),
                        width: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        ...(bgTint && !isFrozen ? { backgroundColor: bgTint } : {}),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* ── Summary: class average ────────────────────────── */}
            <tr className="bg-slate-100 border-t-2 border-slate-300">
              {/* Frozen cells */}
              <td
                className="border border-slate-200 px-1 py-1 text-center bg-slate-100"
                style={{ ...getStickyStyle(0), width: COL_NUM_W, minWidth: COL_NUM_W }}
              />
              <td
                className="border border-slate-200 px-1 py-1 text-right bg-slate-100 font-bold"
                style={{
                  ...getStickyStyle(1),
                  width: COL_NAME_W,
                  minWidth: COL_NAME_W,
                  color: TEXT_COLORS.average,
                }}
              >
                <span className="text-[11px]">ממוצע כיתתי</span>
              </td>
              <td
                className="border border-slate-200 px-1 py-1 text-center bg-slate-100"
                style={{ ...getStickyStyle(2), width: COL_RISK_W, minWidth: COL_RISK_W }}
              />
              <td
                className="border border-slate-200 px-1 py-1 text-center bg-slate-100 font-bold text-xs tabular-nums"
                style={{
                  ...getStickyStyle(3),
                  width: COL_AVG_W,
                  minWidth: COL_AVG_W,
                  color: TEXT_COLORS.average,
                }}
              >
                {averages.weightedAverage?.toFixed(1) ?? '—'}
              </td>
              {/* Subject columns */}
              {CORE_SUBJECTS.map((subj) =>
                GRADE_TYPES.map((gt) => (
                  <td
                    key={`avg_${subj.id}_${gt}`}
                    className="border border-slate-200 px-1 py-1 text-center text-xs tabular-nums font-semibold"
                    style={{
                      width: SUBJECT_COL_W,
                      minWidth: SUBJECT_COL_W,
                      color: TEXT_COLORS.average,
                    }}
                  >
                    {averages.subjectAverages[subj.id]?.[gt]?.toFixed(1) ?? '—'}
                  </td>
                ))
              )}
            </tr>

            {/* ── Summary: exam count ───────────────────────────── */}
            <tr className="bg-slate-50">
              <td
                className="border border-slate-200 px-1 py-1 text-center bg-slate-50"
                style={{ ...getStickyStyle(0), width: COL_NUM_W, minWidth: COL_NUM_W }}
              />
              <td
                className="border border-slate-200 px-1 py-1 text-right bg-slate-50 font-medium text-[11px] text-slate-500"
                style={{ ...getStickyStyle(1), width: COL_NAME_W, minWidth: COL_NAME_W }}
              >
                מספר נבחנים
              </td>
              <td
                className="border border-slate-200 px-1 py-1 text-center bg-slate-50"
                style={{ ...getStickyStyle(2), width: COL_RISK_W, minWidth: COL_RISK_W }}
              />
              <td
                className="border border-slate-200 px-1 py-1 text-center bg-slate-50 text-xs tabular-nums text-slate-500"
                style={{ ...getStickyStyle(3), width: COL_AVG_W, minWidth: COL_AVG_W }}
              >
                {students.length}
              </td>
              {CORE_SUBJECTS.map((subj) =>
                GRADE_TYPES.map((gt) => (
                  <td
                    key={`cnt_${subj.id}_${gt}`}
                    className="border border-slate-200 px-1 py-1 text-center text-xs tabular-nums text-slate-500"
                    style={{ width: SUBJECT_COL_W, minWidth: SUBJECT_COL_W }}
                  >
                    {examCounts[subj.id]?.[gt] ?? 0}
                  </td>
                ))
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
