import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllStudents, getClasses, getSubjects } from '@/data/mock-data';
import { EligibilityStatus, AccommodationType } from '@/types';
import { RiskBadge } from '@/components/grades/RiskBadge';
import { ScoreCell } from '@/components/grades/ScoreCell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const ACCOMMODATION_LABELS: Record<string, string> = {
  [AccommodationType.ADAPTED]: 'מותאם',
  [AccommodationType.DICTATION]: 'הכתבה',
  [AccommodationType.ORAL]: 'בע"פ',
  [AccommodationType.SPECIAL]: 'מיוחד',
};

function getEligibilityLabel(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case EligibilityStatus.FULL_BAGRUT:
      return { label: 'זכאי', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case EligibilityStatus.FULL_DESPITE_MISSING:
      return { label: 'זכאי (חסר בחירה)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case EligibilityStatus.PARTIAL:
      return { label: 'חלקי', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case EligibilityStatus.MISSING_1:
      return { label: 'חסר 1', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case EligibilityStatus.MISSING_2:
      return { label: 'חסר 2', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    case EligibilityStatus.MISSING_3:
      return { label: 'חסר 3', color: 'bg-red-100 text-red-800 border-red-300' };
    case EligibilityStatus.MISSING_4_PLUS:
      return { label: 'חסר 4+', color: 'bg-red-200 text-red-900 border-red-400' };
    case EligibilityStatus.NON_MATRICULATION:
      return { label: 'לא זכאי', color: 'bg-red-200 text-red-900 border-red-400' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
}

const CORE_SUBJECT_IDS = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];

export function StudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();

  const allStudents = getAllStudents();
  const student = allStudents.find((s) => s.id === studentId);
  const classes = getClasses();
  const subjects = getSubjects();

  if (!student) {
    return (
      <div dir="rtl" className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה ללוח הבקרה
        </Link>
        <div className="rounded-lg border border-dashed border-red-300 bg-red-50 p-12 text-center">
          <p className="text-sm text-red-600">תלמיד לא נמצא (מזהה: {studentId})</p>
        </div>
      </div>
    );
  }

  const studentClass = classes.find((c) => c.id === student.classId);
  const eligibility = getEligibilityLabel(student.eligibilityStatus);

  // Get all subjects this student has grades for
  const studentSubjects = subjects.filter((s) => student.grades[s.id]);

  // Core subject check results for eligibility checklist
  const coreChecklist = CORE_SUBJECT_IDS.map((subId) => {
    const subject = subjects.find((s) => s.id === subId);
    const grade = student.grades[subId];
    return {
      subjectId: subId,
      name: subject?.name ?? subId,
      passed: grade ? grade.final >= 55 : false,
      score: grade?.final,
    };
  });

  return (
    <div dir="rtl" className="space-y-6 pb-8">
      {/* Back link */}
      <div className="flex items-center gap-2">
        <Link
          to="/ranking"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לדירוג
        </Link>
      </div>

      {/* 1. Header Card */}
      <Card className="shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge variant="secondary" className="text-xs">
                  {studentClass?.displayName ?? student.classId}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  מס&apos; {student.studentNumber}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>מתמטיקה: {student.mathUnitLevel} יח&quot;ל</span>
                <span className="text-slate-300">|</span>
                <span>אנגלית: {student.englishUnitLevel} יח&quot;ל</span>
              </div>

              {student.accommodations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">התאמות:</span>
                  {student.accommodations.map((acc) => (
                    <Badge key={acc} variant="outline" className="text-xs">
                      {ACCOMMODATION_LABELS[acc] || acc}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">צפי</span>
                <RiskBadge level={student.riskLevel} />
              </div>
              <Badge
                className={`text-sm px-3 py-1 border ${eligibility.color}`}
                variant="outline"
              >
                {eligibility.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Score Summary Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>טבלת ציונים</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">מקצוע</TableHead>
                <TableHead className="text-center">פנימי</TableHead>
                <TableHead className="text-center">חיצוני</TableHead>
                <TableHead className="text-center">סופי</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentSubjects.map((subject) => {
                const grades = student.grades[subject.id];
                return (
                  <TableRow key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-right py-2.5">
                      {subject.name}
                      {subject.isCore && (
                        <span className="text-[10px] text-muted-foreground mr-1">(חובה)</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreCell score={grades?.internal} />
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreCell score={grades?.external} />
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreCell score={grades?.final} />
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Weighted Average Row */}
              <TableRow className="bg-slate-50 font-bold">
                <TableCell className="font-bold text-right">ממוצע משוקלל</TableCell>
                <TableCell className="text-center">—</TableCell>
                <TableCell className="text-center">—</TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-bold tabular-nums">
                    {student.weightedAverage.toFixed(1)}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Eligibility Checklist */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>רשימת זכאות</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {coreChecklist.map((item) => (
                <li
                  key={item.subjectId}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                    item.passed
                      ? 'bg-emerald-50/50 hover:bg-emerald-50'
                      : 'bg-red-50/30 hover:bg-red-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {item.passed ? (
                        <span className="text-emerald-600">&#10004;</span>
                      ) : (
                        <span className="text-red-600">&#10008;</span>
                      )}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {item.score !== undefined ? item.score : '—'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 4. Notes Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>הערות</CardTitle>
          </CardHeader>
          <CardContent>
            {student.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                אין הערות לתלמיד זה
              </p>
            ) : (
              <ul className="space-y-3">
                {student.notes.map((note) => (
                  <li
                    key={note.id}
                    className="border-r-2 border-blue-300 pr-3 py-1"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-700">
                        {note.author}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {note.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{note.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
