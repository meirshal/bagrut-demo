import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type CellContext,
  type HeaderContext,
} from '@tanstack/react-table';
import type { Student, Subject } from '@/types';
import { AccommodationType } from '@/types';
import { getStudentsByClass } from '@/lib/utils';
import { getClasses, getSubjects } from '@/data/mock-data';
import { BG_COLORS, TEXT_COLORS, getScoreCellStyle } from '@/lib/colors';
import { ScoreCell } from './ScoreCell';
import { RiskBadge } from './RiskBadge';

// ─── Subject column configuration ─────────────────────────────────────────────

// Math component sub-columns (questionnaire scores by unit level)
const MATH_COMPONENTS = [
  { key: 'q182', label: '182', title: 'שאלון 182/183 (3 יח"ל)' },
  { key: 'q381', label: '381', title: 'שאלון 381 (3 יח"ל)' },
  { key: 'q382', label: '382', title: 'שאלון 382 (3 יח"ל)' },
  { key: 'q481', label: '481', title: 'שאלון 481 (4 יח"ל)' },
  { key: 'q482', label: '482', title: 'שאלון 482 (4 יח"ל)' },
  { key: 'q581', label: '581', title: 'שאלון 581 (5 יח"ל)' },
  { key: 'q582', label: '582', title: 'שאלון 582 (5 יח"ל)' },
] as const;

// English component sub-columns (module + oral scores)
const ENGLISH_COMPONENTS = [
  { key: 'modA', label: 'A', title: 'Module A (16381)' },
  { key: 'modB', label: 'B', title: 'Module B (16383)' },
  { key: 'modC', label: 'C', title: 'Module C (16382)' },
  { key: 'modD', label: 'D', title: 'Module D (16483)' },
  { key: 'modE', label: 'E', title: 'Module E (16471)' },
  { key: 'modF', label: 'F', title: 'Module F (16583)' },
  { key: 'modG', label: 'G', title: 'Module G (16582)' },
  { key: 'oral', label: 'בע"פ', title: 'בחינה בעל-פה' },
] as const;

// Standard subjects (internal / external / final)
const STANDARD_SUBJECTS = [
  { id: 'history', name: 'היסטוריה' },
  { id: 'civics', name: 'אזרחות' },
  { id: 'tanakh', name: 'תנ"ך' },
  { id: 'literature', name: 'ספרות' },
  { id: 'language', name: 'לשון' },
] as const;

// Sub-column types under standard subjects
const GRADE_TYPES = ['internal', 'external', 'final'] as const;
type GradeType = (typeof GRADE_TYPES)[number];

const GRADE_TYPE_LABELS: Record<GradeType, string> = {
  internal: 'פנימי',
  external: 'חיצוני',
  final: 'סופי',
};

// Pass/fail required subjects (non-weighted)
const PASS_FAIL_SUBJECTS = [
  { id: 'general-studies', name: 'השכלה כללית' },
  { id: 'intro-sciences', name: 'מבוא למדעים' },
  { id: 'pe', name: 'חנ"ג' },
  { id: 'community-service', name: 'מעורבות חברתית' },
] as const;

// Accommodation display config
const ACCOMMODATION_CONFIG: Record<string, { label: string; title: string }> = {
  [AccommodationType.ADAPTED]: { label: 'מות', title: 'מותאם' },
  [AccommodationType.DICTATION]: { label: 'הכת', title: 'הכתבה' },
  [AccommodationType.ORAL]: { label: 'בע"פ', title: 'בחינה בעל-פה' },
  [AccommodationType.SPECIAL]: { label: 'ע"ח', title: 'ע"ח - התאמות מיוחדות' },
};

// Weight label helper: produces "30/70" from weights object
function weightLabel(sub: Subject | undefined): string | null {
  if (!sub) return null;
  if (sub.isPassFail) return null;
  if (sub.id === 'math' || sub.id === 'english') return null; // complex weighting
  const i = Math.round(sub.weights.internal * 100);
  const e = Math.round(sub.weights.external * 100);
  if (i === 0 && e === 0) return null;
  return `${i}/${e}`;
}

interface GradeGridProps {
  classId: string;
}

// ─── Sub-column ID type for averages/counts ──────────────────────────────────
type SubColId = string;

// ─── Helper: compute class averages + failing counts ─────────────────────────

function computeAllStats(students: Student[], electiveSubjectIds: string[]) {
  const sums: Record<SubColId, { sum: number; count: number; failCount: number }> = {};
  let waSum = 0;

  const ensure = (key: SubColId) => {
    if (!sums[key]) sums[key] = { sum: 0, count: 0, failCount: 0 };
  };

  for (const student of students) {
    waSum += student.weightedAverage;

    // Math components + sofi
    const mathGrades = student.grades['math'];
    if (mathGrades) {
      ensure('math_sofi');
      sums['math_sofi'].sum += mathGrades.final;
      sums['math_sofi'].count++;
      if (mathGrades.final < 55) sums['math_sofi'].failCount++;
      if (mathGrades.components) {
        for (const comp of MATH_COMPONENTS) {
          const val = mathGrades.components[comp.key];
          if (val !== undefined) {
            ensure(`math_${comp.key}`);
            sums[`math_${comp.key}`].sum += val;
            sums[`math_${comp.key}`].count++;
            if (val < 55) sums[`math_${comp.key}`].failCount++;
          }
        }
      }
    }

    // Standard subjects
    for (const subj of STANDARD_SUBJECTS) {
      const grades = student.grades[subj.id];
      if (!grades) continue;
      if (grades.internal !== undefined) {
        ensure(`${subj.id}_internal`);
        sums[`${subj.id}_internal`].sum += grades.internal;
        sums[`${subj.id}_internal`].count++;
        if (grades.internal < 55) sums[`${subj.id}_internal`].failCount++;
      }
      if (grades.external !== undefined) {
        ensure(`${subj.id}_external`);
        sums[`${subj.id}_external`].sum += grades.external;
        sums[`${subj.id}_external`].count++;
        if (grades.external < 55) sums[`${subj.id}_external`].failCount++;
      }
      ensure(`${subj.id}_final`);
      sums[`${subj.id}_final`].sum += grades.final;
      sums[`${subj.id}_final`].count++;
      if (grades.final < 55) sums[`${subj.id}_final`].failCount++;
    }

    // English components + sofi
    const engGrades = student.grades['english'];
    if (engGrades) {
      ensure('english_sofi');
      sums['english_sofi'].sum += engGrades.final;
      sums['english_sofi'].count++;
      if (engGrades.final < 55) sums['english_sofi'].failCount++;
      if (engGrades.components) {
        for (const comp of ENGLISH_COMPONENTS) {
          const val = engGrades.components[comp.key];
          if (val !== undefined) {
            ensure(`english_${comp.key}`);
            sums[`english_${comp.key}`].sum += val;
            sums[`english_${comp.key}`].count++;
            if (val < 55) sums[`english_${comp.key}`].failCount++;
          }
        }
      }
    }

    // Pass/fail subjects
    for (const subj of PASS_FAIL_SUBJECTS) {
      const grades = student.grades[subj.id];
      if (!grades) continue;
      ensure(`${subj.id}_pf`);
      sums[`${subj.id}_pf`].sum += grades.final;
      sums[`${subj.id}_pf`].count++;
      if (grades.final < 55) sums[`${subj.id}_pf`].failCount++;
    }

    // Elective subjects
    for (const elId of electiveSubjectIds) {
      const grades = student.grades[elId];
      if (!grades) continue;
      if (grades.internal !== undefined) {
        ensure(`${elId}_internal`);
        sums[`${elId}_internal`].sum += grades.internal;
        sums[`${elId}_internal`].count++;
        if (grades.internal < 55) sums[`${elId}_internal`].failCount++;
      }
      if (grades.external !== undefined) {
        ensure(`${elId}_external`);
        sums[`${elId}_external`].sum += grades.external;
        sums[`${elId}_external`].count++;
        if (grades.external < 55) sums[`${elId}_external`].failCount++;
      }
      ensure(`${elId}_final`);
      sums[`${elId}_final`].sum += grades.final;
      sums[`${elId}_final`].count++;
      if (grades.final < 55) sums[`${elId}_final`].failCount++;
    }
  }

  const avgs: Record<SubColId, number | null> = {};
  const counts: Record<SubColId, number> = {};
  const failCounts: Record<SubColId, number> = {};
  for (const [key, { sum, count, failCount }] of Object.entries(sums)) {
    avgs[key] = count > 0 ? Math.round((sum / count) * 10) / 10 : null;
    counts[key] = count;
    failCounts[key] = failCount;
  }

  return {
    columnAverages: avgs,
    columnCounts: counts,
    columnFailCounts: failCounts,
    weightedAverage: students.length > 0 ? Math.round((waSum / students.length) * 10) / 10 : null,
  };
}

// ─── Sticky column width constants ───────────────────────────────────────────

const COL_MATH_UNIT_W = 32;
const COL_ENG_UNIT_W = 32;
const COL_NUM_W = 40;
const COL_NAME_W = 140;
const COL_ACCOM_W = 38;
const COL_RISK_W = 45;
const COL_AVG_W = 55;

const FROZEN_COUNT = 7; // mathUnit, engUnit, studentNum, name, accommodations, risk, weightedAvg
const STICKY_TOTAL = COL_MATH_UNIT_W + COL_ENG_UNIT_W + COL_NUM_W + COL_NAME_W + COL_ACCOM_W + COL_RISK_W + COL_AVG_W;
const SUBJECT_COL_W = 45;
const COMPONENT_COL_W = 40;

export function GradeGrid({ classId }: GradeGridProps) {
  const students = useMemo(() => {
    const s = getStudentsByClass(classId);
    return [...s].sort((a, b) =>
      a.lastName.localeCompare(b.lastName, 'he') ||
      a.firstName.localeCompare(b.firstName, 'he')
    );
  }, [classId]);

  // Determine elective subjects for this class
  const classElectives = useMemo(() => {
    const allClasses = getClasses();
    const cls = allClasses.find((c) => c.id === classId);
    const electiveIds = cls?.electiveSubjectIds ?? [];
    const allSubjects = getSubjects();
    return electiveIds
      .map((id) => allSubjects.find((s) => s.id === id))
      .filter((s): s is Subject => s !== undefined);
  }, [classId]);

  const electiveSubjectIds = useMemo(
    () => classElectives.map((s) => s.id),
    [classElectives]
  );

  // Subject lookup for weight labels
  const subjectMap = useMemo(() => {
    const allSubjects = getSubjects();
    const map: Record<string, Subject> = {};
    for (const s of allSubjects) map[s.id] = s;
    return map;
  }, []);

  const { columnAverages, columnCounts, columnFailCounts, weightedAverage } = useMemo(
    () => computeAllStats(students, electiveSubjectIds),
    [students, electiveSubjectIds]
  );

  // ─── Collect all leaf column IDs for summary rows ────────────────────────

  const allLeafColIds = useMemo<SubColId[]>(() => {
    const ids: SubColId[] = [];
    // Math columns
    for (const comp of MATH_COMPONENTS) ids.push(`math_${comp.key}`);
    ids.push('math_sofi');
    // Standard subjects
    for (const subj of STANDARD_SUBJECTS) {
      for (const gt of GRADE_TYPES) ids.push(`${subj.id}_${gt}`);
    }
    // English columns
    for (const comp of ENGLISH_COMPONENTS) ids.push(`english_${comp.key}`);
    ids.push('english_sofi');
    // Pass/fail subjects
    for (const subj of PASS_FAIL_SUBJECTS) ids.push(`${subj.id}_pf`);
    // Elective subjects
    for (const el of classElectives) {
      for (const gt of GRADE_TYPES) ids.push(`${el.id}_${gt}`);
    }
    return ids;
  }, [classElectives]);

  // ─── Column definitions ──────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<Student>[]>(() => {
    const frozen: ColumnDef<Student>[] = [
      {
        id: 'mathUnit',
        header: () => <span className="text-[9px] font-medium" title="רמת יחידות מתמטיקה">מת</span>,
        size: COL_MATH_UNIT_W,
        cell: (info: CellContext<Student, unknown>) => (
          <span className="text-[10px] font-bold text-slate-700 tabular-nums">
            {info.row.original.mathUnitLevel}
          </span>
        ),
      },
      {
        id: 'engUnit',
        header: () => <span className="text-[9px] font-medium" title="רמת יחידות אנגלית">אנ</span>,
        size: COL_ENG_UNIT_W,
        cell: (info: CellContext<Student, unknown>) => (
          <span className="text-[10px] font-bold text-slate-700 tabular-nums">
            {info.row.original.englishUnitLevel}
          </span>
        ),
      },
      {
        id: 'studentNum',
        header: () => <span className="text-[9px]">מס</span>,
        size: COL_NUM_W,
        cell: (info: CellContext<Student, unknown>) => (
          <span className="text-[10px] text-slate-500 tabular-nums">
            {info.row.original.studentNumber}
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
        id: 'accommodations',
        header: () => <span className="text-[9px]" title="התאמות">הת</span>,
        size: COL_ACCOM_W,
        cell: (info: CellContext<Student, unknown>) => {
          const accs = info.row.original.accommodations;
          if (!accs || accs.length === 0) return null;
          return (
            <span className="text-[8px] text-purple-700 font-medium" title={accs.map(a => ACCOMMODATION_CONFIG[a]?.title ?? a).join(', ')}>
              {accs.map(a => ACCOMMODATION_CONFIG[a]?.label ?? a).join(' ')}
            </span>
          );
        },
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

    // ── Math group: questionnaire components + Sofi ──────────────────────
    const mathGroup: ColumnDef<Student> = {
      id: 'subject_math',
      header: () => (
        <span className="text-[10px] font-bold">מתמטיקה</span>
      ),
      columns: [
        ...MATH_COMPONENTS.map((comp) => ({
          id: `math_${comp.key}`,
          header: (_info: HeaderContext<Student, unknown>) => (
            <span className="text-[10px]" title={comp.title}>{comp.label}</span>
          ),
          size: COMPONENT_COL_W,
          accessorFn: (row: Student) => {
            const grades = row.grades['math'];
            return grades?.components?.[comp.key];
          },
          cell: (info: CellContext<Student, unknown>) => {
            const val = info.getValue() as number | undefined;
            return <ScoreCell score={val} />;
          },
        })),
        {
          id: 'math_sofi',
          header: (_info: HeaderContext<Student, unknown>) => (
            <span className="text-[10px] font-bold">סופי</span>
          ),
          size: SUBJECT_COL_W,
          accessorFn: (row: Student) => row.grades['math']?.final,
          cell: (info: CellContext<Student, unknown>) => {
            const val = info.getValue() as number | undefined;
            return <ScoreCell score={val} />;
          },
        },
      ],
    };

    // ── Standard subject groups ──────────────────────────────────────────
    const standardGroups: ColumnDef<Student>[] = STANDARD_SUBJECTS.map((subj) => {
      const wl = weightLabel(subjectMap[subj.id]);
      return {
        id: `subject_${subj.id}`,
        header: () => (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[10px] font-bold">{subj.name}</span>
            {wl && <span className="text-[8px] text-slate-400">{wl}</span>}
          </div>
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
      };
    });

    // ── English group: module components + oral + Sofi ────────────────────
    const englishGroup: ColumnDef<Student> = {
      id: 'subject_english',
      header: () => (
        <span className="text-[10px] font-bold">אנגלית</span>
      ),
      columns: [
        ...ENGLISH_COMPONENTS.map((comp) => ({
          id: `english_${comp.key}`,
          header: (_info: HeaderContext<Student, unknown>) => (
            <span className="text-[10px]" title={comp.title}>{comp.label}</span>
          ),
          size: COMPONENT_COL_W,
          accessorFn: (row: Student) => {
            const grades = row.grades['english'];
            return grades?.components?.[comp.key];
          },
          cell: (info: CellContext<Student, unknown>) => {
            const val = info.getValue() as number | undefined;
            return <ScoreCell score={val} />;
          },
        })),
        {
          id: 'english_sofi',
          header: (_info: HeaderContext<Student, unknown>) => (
            <span className="text-[10px] font-bold">סופי</span>
          ),
          size: SUBJECT_COL_W,
          accessorFn: (row: Student) => row.grades['english']?.final,
          cell: (info: CellContext<Student, unknown>) => {
            const val = info.getValue() as number | undefined;
            return <ScoreCell score={val} />;
          },
        },
      ],
    };

    // ── Pass/fail subjects ───────────────────────────────────────────────
    const passFailGroups: ColumnDef<Student>[] = PASS_FAIL_SUBJECTS.map((subj) => ({
      id: `subject_${subj.id}`,
      header: () => (
        <div className="flex flex-col items-center leading-tight">
          <span className="text-[10px] font-bold">{subj.name}</span>
          <span className="text-[8px] text-slate-400">עובר/נכשל</span>
        </div>
      ),
      columns: [
        {
          id: `${subj.id}_pf`,
          header: (_info: HeaderContext<Student, unknown>) => (
            <span className="text-[10px]">ציון</span>
          ),
          size: SUBJECT_COL_W,
          accessorFn: (row: Student) => row.grades[subj.id]?.final,
          cell: (info: CellContext<Student, unknown>) => {
            const val = info.getValue() as number | undefined;
            if (val === undefined || val === null) {
              return <span className="text-slate-400 text-xs">—</span>;
            }
            const pass = val >= 55;
            return (
              <span
                className={`text-[10px] font-bold ${pass ? 'text-green-700' : 'text-red-600'}`}
                title={String(val)}
              >
                {pass ? 'V' : 'X'}
              </span>
            );
          },
        },
      ],
    }));

    // ── Elective subject groups ──────────────────────────────────────────
    const electiveGroups: ColumnDef<Student>[] = classElectives.map((subj) => {
      const wl = weightLabel(subj);
      return {
        id: `subject_${subj.id}`,
        header: () => (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-[10px] font-bold">{subj.name}</span>
            {wl && <span className="text-[8px] text-slate-400">{wl}</span>}
          </div>
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
      };
    });

    return [
      ...frozen,
      mathGroup,
      ...standardGroups,
      englishGroup,
      ...passFailGroups,
      ...electiveGroups,
    ];
  }, [classElectives, subjectMap]);

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

  const stickyRightOffsets = [
    0,                                                          // mathUnit
    COL_MATH_UNIT_W,                                            // engUnit
    COL_MATH_UNIT_W + COL_ENG_UNIT_W,                           // studentNum
    COL_MATH_UNIT_W + COL_ENG_UNIT_W + COL_NUM_W,               // name
    COL_MATH_UNIT_W + COL_ENG_UNIT_W + COL_NUM_W + COL_NAME_W,  // accommodations
    COL_MATH_UNIT_W + COL_ENG_UNIT_W + COL_NUM_W + COL_NAME_W + COL_ACCOM_W, // risk
    COL_MATH_UNIT_W + COL_ENG_UNIT_W + COL_NUM_W + COL_NAME_W + COL_ACCOM_W + COL_RISK_W, // weightedAvg
  ];

  function getStickyStyle(colIndex: number): React.CSSProperties | undefined {
    if (colIndex < FROZEN_COUNT) {
      return {
        position: 'sticky',
        right: stickyRightOffsets[colIndex],
        zIndex: 20,
      };
    }
    return undefined;
  }

  function getHeaderBgForGradeCol(colId: string): string | undefined {
    if (colId.endsWith('_internal')) return BG_COLORS.componentInternal + '33';
    if (colId.endsWith('_external')) return BG_COLORS.componentExternal + '22';
    return undefined;
  }

  function isSofiCol(colId: string): boolean {
    return colId === 'math_sofi' || colId === 'english_sofi' || colId.endsWith('_final');
  }

  function isComponentCol(colId: string): boolean {
    return (
      (colId.startsWith('math_q') || colId.startsWith('english_mod') || colId === 'english_oral') &&
      !colId.endsWith('_sofi') && !colId.endsWith('_final')
    );
  }

  function isPassFailCol(colId: string): boolean {
    return colId.endsWith('_pf');
  }

  // Total scrollable width estimate
  const totalLeafCols = allLeafColIds.length;
  const scrollableWidth = totalLeafCols * COMPONENT_COL_W;

  // ─── Frozen column widths for summary rows ─────────────────────────────

  const frozenWidths = [
    COL_MATH_UNIT_W,
    COL_ENG_UNIT_W,
    COL_NUM_W,
    COL_NAME_W,
    COL_ACCOM_W,
    COL_RISK_W,
    COL_AVG_W,
  ];

  // ─── Summary row renderer helper ──────────────────────────────────────

  function renderSummaryFrozenCells(
    label: string,
    avgValue: string | null,
    bgClass: string,
    labelColor?: string
  ) {
    return (
      <>
        {/* mathUnit */}
        <td
          className={`border border-slate-200 px-1 py-1 text-center ${bgClass}`}
          style={{ ...getStickyStyle(0), width: frozenWidths[0], minWidth: frozenWidths[0] }}
        />
        {/* engUnit */}
        <td
          className={`border border-slate-200 px-1 py-1 text-center ${bgClass}`}
          style={{ ...getStickyStyle(1), width: frozenWidths[1], minWidth: frozenWidths[1] }}
        />
        {/* studentNum */}
        <td
          className={`border border-slate-200 px-1 py-1 text-center ${bgClass}`}
          style={{ ...getStickyStyle(2), width: frozenWidths[2], minWidth: frozenWidths[2] }}
        />
        {/* name */}
        <td
          className={`border border-slate-200 px-1 py-1 text-right ${bgClass} font-bold`}
          style={{
            ...getStickyStyle(3),
            width: frozenWidths[3],
            minWidth: frozenWidths[3],
            color: labelColor ?? TEXT_COLORS.average,
          }}
        >
          <span className="text-[11px]">{label}</span>
        </td>
        {/* accommodations */}
        <td
          className={`border border-slate-200 px-1 py-1 text-center ${bgClass}`}
          style={{ ...getStickyStyle(4), width: frozenWidths[4], minWidth: frozenWidths[4] }}
        />
        {/* risk */}
        <td
          className={`border border-slate-200 px-1 py-1 text-center ${bgClass}`}
          style={{ ...getStickyStyle(5), width: frozenWidths[5], minWidth: frozenWidths[5] }}
        />
        {/* weightedAvg */}
        <td
          className={`border border-slate-200 px-1 py-1 text-center ${bgClass} font-bold text-xs tabular-nums`}
          style={{
            ...getStickyStyle(6),
            width: frozenWidths[6],
            minWidth: frozenWidths[6],
            color: labelColor ?? TEXT_COLORS.average,
          }}
        >
          {avgValue ?? ''}
        </td>
      </>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5">
      <div className="overflow-x-auto scrollbar-thin">
        <table
          className="border-collapse text-xs"
          style={{ minWidth: STICKY_TOTAL + scrollableWidth }}
        >
          {/* ── Header rows ─────────────────────────────────────────── */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-100">
                {headerGroup.headers.map((header) => {
                  const colIndex = header.index;
                  const isFrozen = colIndex < FROZEN_COUNT && headerGroup.depth === 1;
                  const isTopFrozen = colIndex < FROZEN_COUNT && headerGroup.depth === 0;
                  const stickyStyle = (isFrozen || isTopFrozen) ? getStickyStyle(
                    isTopFrozen ? colIndex : colIndex
                  ) : undefined;

                  const bgTint = getHeaderBgForGradeCol(header.column.id);
                  const isFinal = isSofiCol(header.column.id);
                  const isComp = isComponentCol(header.column.id);
                  const isPF = isPassFailCol(header.column.id);

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`
                        border border-slate-200 px-1 py-1.5 text-center align-middle
                        whitespace-nowrap select-none
                        ${(isFrozen || isTopFrozen) ? 'bg-slate-100' : ''}
                        ${isFinal ? 'font-bold' : 'font-medium'}
                        ${header.colSpan > 1 ? 'border-b-2 border-b-indigo-200' : ''}
                      `}
                      style={{
                        ...(stickyStyle || {}),
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        ...(bgTint ? { backgroundColor: bgTint } : {}),
                        ...(isComp ? { backgroundColor: '#f0f4ff' } : {}),
                        ...(isFinal && !bgTint ? { backgroundColor: '#e8f5e9' } : {}),
                        ...(isPF ? { backgroundColor: '#f5f0ff' } : {}),
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
                  const isFrozen = colIndex < FROZEN_COUNT;
                  const stickyStyle = isFrozen ? getStickyStyle(colIndex) : undefined;
                  const bgTint = getHeaderBgForGradeCol(cell.column.id);
                  const isFinal = isSofiCol(cell.column.id);

                  return (
                    <td
                      key={cell.id}
                      className={`
                        border border-slate-200 px-1 py-0.5 text-center align-middle
                        ${isFrozen
                          ? (rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50')
                          : ''
                        }
                        ${isFinal && !isFrozen ? 'border-l-2 border-l-green-200' : ''}
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
              {renderSummaryFrozenCells(
                'ממוצע כיתתי',
                weightedAverage?.toFixed(1) ?? '—',
                'bg-slate-100'
              )}
              {allLeafColIds.map((colId) => (
                <td
                  key={`avg_${colId}`}
                  className="border border-slate-200 px-1 py-1 text-center text-xs tabular-nums font-semibold"
                  style={{
                    width: isComponentCol(colId) ? COMPONENT_COL_W : SUBJECT_COL_W,
                    minWidth: isComponentCol(colId) ? COMPONENT_COL_W : SUBJECT_COL_W,
                    color: TEXT_COLORS.average,
                  }}
                >
                  {columnAverages[colId]?.toFixed(1) ?? '—'}
                </td>
              ))}
            </tr>

            {/* ── Summary: exam count ───────────────────────────── */}
            <tr className="bg-slate-50">
              {renderSummaryFrozenCells(
                'מספר נבחנים',
                String(students.length),
                'bg-slate-50',
                '#64748b'
              )}
              {allLeafColIds.map((colId) => (
                <td
                  key={`cnt_${colId}`}
                  className="border border-slate-200 px-1 py-1 text-center text-xs tabular-nums text-slate-500"
                  style={{
                    width: isComponentCol(colId) ? COMPONENT_COL_W : SUBJECT_COL_W,
                    minWidth: isComponentCol(colId) ? COMPONENT_COL_W : SUBJECT_COL_W,
                  }}
                >
                  {columnCounts[colId] ?? 0}
                </td>
              ))}
            </tr>

            {/* ── Summary: failing count (< 55) ────────────────── */}
            <tr className="bg-red-50/50">
              {renderSummaryFrozenCells(
                'נכשלים (< 55)',
                null,
                'bg-red-50/50',
                '#ef4444'
              )}
              {allLeafColIds.map((colId) => {
                const failCount = columnFailCounts[colId] ?? 0;
                return (
                  <td
                    key={`fail_${colId}`}
                    className="border border-slate-200 px-1 py-1 text-center text-xs tabular-nums"
                    style={{
                      width: isComponentCol(colId) ? COMPONENT_COL_W : SUBJECT_COL_W,
                      minWidth: isComponentCol(colId) ? COMPONENT_COL_W : SUBJECT_COL_W,
                      color: failCount > 0 ? '#ef4444' : '#94a3b8',
                      fontWeight: failCount > 0 ? 700 : 400,
                    }}
                  >
                    {failCount}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
