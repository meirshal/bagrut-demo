import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
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
const REQUIRED_NON_WEIGHTED_IDS = ['general-studies', 'intro-sciences', 'pe', 'community-service'];

/** Labels for Math questionnaire components */
const MATH_COMPONENT_LABELS: Record<string, string> = {
  q182: 'שאלון 182',
  q381: 'שאלון 381',
  q382: 'שאלון 382',
  q481: 'שאלון 481',
  q482: 'שאלון 482',
  q581: 'שאלון 581',
  q582: 'שאלון 582',
};

/** Labels for English module components */
const ENGLISH_COMPONENT_LABELS: Record<string, string> = {
  modA: 'מודול A',
  modB: 'מודול B',
  modC: 'מודול C',
  modD: 'מודול D',
  modE: 'מודול E',
  modF: 'מודול F',
  modG: 'מודול G',
  oral: 'בע"פ (Oral)',
};

function ComponentsExpandable({
  subjectId,
  components,
}: {
  subjectId: string;
  components: Record<string, number | undefined>;
}) {
  const [open, setOpen] = useState(false);
  const labels =
    subjectId === 'math' ? MATH_COMPONENT_LABELS : ENGLISH_COMPONENT_LABELS;
  const entries = Object.entries(components).filter(
    ([, v]) => v !== undefined
  );

  if (entries.length === 0) return null;

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 transition-colors"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {open ? 'הסתר פירוט' : 'הצג פירוט רכיבים'}
      </button>
      {open && (
        <div className="mt-1 mr-2 space-y-0.5">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 rounded px-2 py-0.5"
            >
              <span>{labels[key] ?? key}</span>
              <span className="tabular-nums font-medium">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  // Get ALL subjects this student has grades for, preserving a logical order:
  // core weighted first, then required non-weighted, then electives
  const coreWeightedSubjects = CORE_SUBJECT_IDS
    .map((id) => subjects.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s && !!student.grades[s.id]);

  const requiredNonWeightedSubjects = REQUIRED_NON_WEIGHTED_IDS
    .map((id) => subjects.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s && !!student.grades[s.id]);

  const electiveSubjects = subjects.filter(
    (s) =>
      student.grades[s.id] &&
      !CORE_SUBJECT_IDS.includes(s.id) &&
      !REQUIRED_NON_WEIGHTED_IDS.includes(s.id)
  );

  // Core + Required eligibility checklist
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

  const requiredChecklist = REQUIRED_NON_WEIGHTED_IDS.map((subId) => {
    const subject = subjects.find((s) => s.id === subId);
    const grade = student.grades[subId];
    return {
      subjectId: subId,
      name: subject?.name ?? subId,
      passed: grade ? grade.final >= 55 : false,
      score: grade?.final,
    };
  });

  // Check elective pass
  const hasPassingElective = electiveSubjects.some(
    (s) => student.grades[s.id] && student.grades[s.id].final >= 55
  );

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

              {/* Unit levels prominently */}
              <div className="flex items-center gap-4">
                <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-sm px-3 py-1">
                  מתמטיקה {student.mathUnitLevel} יח&quot;ל
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-sm px-3 py-1">
                  אנגלית {student.englishUnitLevel} יח&quot;ל
                </Badge>
              </div>

              {/* Accommodation flags */}
              {student.accommodations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">התאמות:</span>
                  {student.accommodations.map((acc) => (
                    <Badge key={acc} variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-800">
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

      {/* 2. Score Summary Table - ALL subjects */}
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
              {/* Core Weighted Subjects */}
              {coreWeightedSubjects.length > 0 && (
                <TableRow className="bg-slate-100/50">
                  <TableCell colSpan={4} className="text-xs font-bold text-slate-500 py-1.5">
                    מקצועות חובה משוקללים
                  </TableCell>
                </TableRow>
              )}
              {coreWeightedSubjects.map((subject) => {
                const grades = student.grades[subject.id];
                const showComponents =
                  (subject.id === 'math' || subject.id === 'english') &&
                  grades?.components &&
                  Object.keys(grades.components).length > 0;
                return (
                  <TableRow key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-right py-2.5">
                      <div>
                        {subject.name}
                        {subject.id === 'math' && (
                          <span className="text-[10px] text-indigo-600 mr-1">
                            ({student.mathUnitLevel} יח&quot;ל)
                          </span>
                        )}
                        {subject.id === 'english' && (
                          <span className="text-[10px] text-indigo-600 mr-1">
                            ({student.englishUnitLevel} יח&quot;ל)
                          </span>
                        )}
                        {subject.isCore && subject.id !== 'math' && subject.id !== 'english' && (
                          <span className="text-[10px] text-muted-foreground mr-1">(חובה)</span>
                        )}
                        {showComponents && (
                          <ComponentsExpandable
                            subjectId={subject.id}
                            components={grades!.components!}
                          />
                        )}
                      </div>
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

              {/* Required Non-Weighted Subjects */}
              {requiredNonWeightedSubjects.length > 0 && (
                <TableRow className="bg-slate-100/50">
                  <TableCell colSpan={4} className="text-xs font-bold text-slate-500 py-1.5">
                    מקצועות חובה (לא משוקללים)
                  </TableCell>
                </TableRow>
              )}
              {requiredNonWeightedSubjects.map((subject) => {
                const grades = student.grades[subject.id];
                return (
                  <TableRow key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-right py-2.5">
                      {subject.name}
                      <span className="text-[10px] text-muted-foreground mr-1">(עובר/נכשל)</span>
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

              {/* Elective Subjects */}
              {electiveSubjects.length > 0 && (
                <TableRow className="bg-slate-100/50">
                  <TableCell colSpan={4} className="text-xs font-bold text-slate-500 py-1.5">
                    מקצועות בחירה (מגמה)
                  </TableCell>
                </TableRow>
              )}
              {electiveSubjects.map((subject) => {
                const grades = student.grades[subject.id];
                return (
                  <TableRow key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-right py-2.5">
                      {subject.name}
                      <span className="text-[10px] text-muted-foreground mr-1">(בחירה)</span>
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
        {/* 3. Eligibility Checklist - includes non-weighted required subjects */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>רשימת זכאות</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Core weighted checklist */}
            <h3 className="text-xs font-bold text-slate-500 mb-2">מקצועות חובה משוקללים</h3>
            <ul className="space-y-2 mb-4">
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

            {/* Required non-weighted checklist */}
            <h3 className="text-xs font-bold text-slate-500 mb-2">מקצועות חובה (לא משוקללים)</h3>
            <ul className="space-y-2 mb-4">
              {requiredChecklist.map((item) => (
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

            {/* Elective pass check */}
            <h3 className="text-xs font-bold text-slate-500 mb-2">מקצוע בחירה (מגמה)</h3>
            <div
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                hasPassingElective
                  ? 'bg-emerald-50/50'
                  : 'bg-red-50/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {hasPassingElective ? (
                    <span className="text-emerald-600">&#10004;</span>
                  ) : (
                    <span className="text-red-600">&#10008;</span>
                  )}
                </span>
                <span className="text-sm font-medium">
                  {hasPassingElective ? 'עובר במקצוע בחירה' : 'אין ציון עובר במגמה'}
                </span>
              </div>
            </div>
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
