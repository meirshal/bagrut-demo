import { useMemo, useState } from 'react';
import { getClasses, getExamPeriods } from '@/data/mock-data';
import { getStudentsByClass } from '@/lib/utils';

interface ClassHeaderProps {
  classId: string;
}

export function ClassHeader({ classId }: ClassHeaderProps) {
  const classes = useMemo(() => getClasses(), []);
  const examPeriods = useMemo(() => getExamPeriods(), []);
  const cls = useMemo(() => classes.find((c) => c.id === classId), [classes, classId]);
  const studentCount = useMemo(() => getStudentsByClass(classId).length, [classId]);

  const [selectedPeriod, setSelectedPeriod] = useState(examPeriods[examPeriods.length - 1]?.id ?? '');

  if (!cls) {
    return (
      <div className="text-red-500 text-sm font-medium">
        כיתה לא נמצאה
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-900">
          כיתה {cls.displayName} — תשפ״ה
        </h2>
        <span className="text-sm text-slate-500">
          מחנכ/ת: <span className="font-medium text-slate-700">{cls.homeroomTeacher}</span>
        </span>
        <span className="text-sm text-slate-500">
          {studentCount} תלמידים
        </span>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="period-select" className="text-xs text-slate-500">
          מועד:
        </label>
        <select
          id="period-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {examPeriods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
