import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getChallengeStudents, getClasses } from '@/data/mock-data';
import { ChallengeCategory } from '@/types';
import type { Student } from '@/types';
import { RiskBadge } from '@/components/grades/RiskBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ColumnConfig {
  category: string;
  title: string;
  headerColor: string;
  borderColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    category: ChallengeCategory.ESPECIALLY_CHALLENGING,
    title: 'מאתגרים במיוחד',
    headerColor: 'bg-rose-100 text-rose-800',
    borderColor: 'border-t-rose-500',
  },
  {
    category: ChallengeCategory.WILL_PROBABLY_PASS,
    title: 'יעברו כנראה',
    headerColor: 'bg-amber-100 text-amber-800',
    borderColor: 'border-t-amber-500',
  },
  {
    category: ChallengeCategory.CLOSE_FOLLOWUP,
    title: 'לטיפול צמוד',
    headerColor: 'bg-blue-100 text-blue-800',
    borderColor: 'border-t-blue-500',
  },
];

const CORE_IDS = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];

function countFailingSubjects(student: Student): number {
  return CORE_IDS.filter(
    (id) => student.grades[id] && student.grades[id].final < 55
  ).length;
}

function StudentCard({ student }: { student: Student }) {
  const classes = getClasses();
  const studentClass = classes.find((c) => c.id === student.classId);
  const failCount = countFailingSubjects(student);
  const notesPreview =
    student.notes.length > 0
      ? student.notes[0].text.length > 50
        ? student.notes[0].text.substring(0, 50) + '...'
        : student.notes[0].text
      : null;

  return (
    <Link to={`/student/${student.id}`} className="block">
      <Card className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-slate-200">
        <CardContent className="pt-3 pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">
              {student.firstName} {student.lastName}
            </span>
            <RiskBadge level={student.riskLevel} />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {studentClass?.displayName ?? student.classId}
            </Badge>
            {failCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {failCount} נכשלים
              </Badge>
            )}
          </div>

          {student.challengeAssignedTo && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">אחראי:</span>{' '}
              {student.challengeAssignedTo}
            </div>
          )}

          {notesPreview && (
            <p className="text-xs text-slate-500 border-r-2 border-slate-200 pr-2">
              {notesPreview}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function ChallengingStudents() {
  const [classFilter, setClassFilter] = useState<string>('all');
  const classes = getClasses();
  const challengeStudents = getChallengeStudents();

  const filteredStudents = useMemo(() => {
    if (classFilter === 'all') return challengeStudents;
    return challengeStudents.filter((s) => s.classId === classFilter);
  }, [challengeStudents, classFilter]);

  const getStudentsForColumn = (category: string) =>
    filteredStudents.filter((s) => s.challengeCategory === category);

  return (
    <div dir="rtl" className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">תלמידים מאתגרים</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ניהול ומעקב אחר תלמידים הדורשים התערבות מיוחדת &middot;{' '}
            {filteredStudents.length} תלמידים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">סינון לפי כיתה:</span>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="כל הכיתות" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">כל הכיתות</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const students = getStudentsForColumn(col.category);
          return (
            <div
              key={col.category}
              className={`rounded-xl border border-slate-200 bg-slate-50/30 border-t-4 ${col.borderColor} shadow-sm`}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between px-4 py-3 ${col.headerColor}`}
              >
                <h2 className="text-sm font-bold">{col.title}</h2>
                <Badge variant="secondary" className="text-[10px]">
                  {students.length}
                </Badge>
              </div>

              {/* Student Cards */}
              <div className="p-3 space-y-3 min-h-[200px]">
                {students.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    אין תלמידים בקטגוריה זו
                  </p>
                ) : (
                  students.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
