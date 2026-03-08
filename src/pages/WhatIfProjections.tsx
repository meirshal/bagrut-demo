import { useState, useMemo } from 'react';
import { TrendingUp, Award, Users } from 'lucide-react';
import { getAllStudents, getSubjects, getClasses } from '@/data/mock-data';
import type { Student, SubjectGrades } from '@/types';
import { EligibilityStatus } from '@/types';
import { ScoreCell } from '@/components/grades/ScoreCell';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const CORE_IDS = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];

function isEligible(status: string): boolean {
  return (
    status === EligibilityStatus.FULL_BAGRUT ||
    status === EligibilityStatus.FULL_DESPITE_MISSING
  );
}

function isExcellent(avg: number): boolean {
  return avg >= 90;
}

interface ProjectedStudent {
  student: Student;
  projectedAverage: number;
  delta: number;
  projectedEligibility: string;
  crossedThreshold: boolean;
  className: string;
}

function computeProjection(
  student: Student,
  offset: number
): { projectedGrades: Record<string, SubjectGrades>; projectedAvg: number } {
  // Find the student's highest actual final score
  const actualScores = Object.values(student.grades)
    .map((g) => g.final)
    .filter((f) => f > 0);
  const highestScore = actualScores.length > 0 ? Math.max(...actualScores) : 70;

  const projected = highestScore + offset; // offset is negative, so this subtracts

  // Clone grades and fill in missing subjects
  const projectedGrades: Record<string, SubjectGrades> = {};
  const subjects = getSubjects();

  for (const subId of CORE_IDS) {
    const existing = student.grades[subId];
    if (existing && existing.final > 0) {
      projectedGrades[subId] = { ...existing };
    } else {
      // Project this missing subject
      const sub = subjects.find((s) => s.id === subId);
      const projectedScore = Math.max(0, Math.min(100, Math.round(projected)));
      if (sub && (sub.weights.internal === 0)) {
        // Math or English - only final
        projectedGrades[subId] = { final: projectedScore };
      } else {
        projectedGrades[subId] = {
          internal: projectedScore,
          external: projectedScore,
          final: projectedScore,
        };
      }
    }
  }

  // Also copy elective grades
  for (const [subId, grades] of Object.entries(student.grades)) {
    if (!CORE_IDS.includes(subId)) {
      projectedGrades[subId] = { ...grades };
    }
  }

  // Recalculate weighted average
  const mathFinal = projectedGrades['math']?.final ?? 0;
  const historyFinal = projectedGrades['history']?.final ?? 0;
  const civicsFinal = projectedGrades['civics']?.final ?? 0;
  const tanakhFinal = projectedGrades['tanakh']?.final ?? 0;
  const literatureFinal = projectedGrades['literature']?.final ?? 0;
  const languageFinal = projectedGrades['language']?.final ?? 0;
  const englishFinal = projectedGrades['english']?.final ?? 0;

  const totalUnits =
    student.mathUnitLevel + 2 + 2 + 2 + 2 + 2 + student.englishUnitLevel;
  const weightedSum =
    mathFinal * student.mathUnitLevel +
    historyFinal * 2 +
    civicsFinal * 2 +
    tanakhFinal * 2 +
    literatureFinal * 2 +
    languageFinal * 2 +
    englishFinal * student.englishUnitLevel;

  const projectedAvg = Math.round((weightedSum / totalUnits) * 100) / 100;

  return { projectedGrades, projectedAvg };
}

function determineProjectedEligibility(
  grades: Record<string, SubjectGrades>
): string {
  let failCount = 0;
  for (const id of CORE_IDS) {
    if (grades[id] && grades[id].final < 55) failCount++;
  }

  const electiveIds = ['cs', 'physics', 'biology', 'chemistry', 'geography'];
  const hasElective = electiveIds.some(
    (id) => grades[id] && grades[id].final >= 55
  );

  if (failCount === 0 && hasElective) return EligibilityStatus.FULL_BAGRUT;
  if (failCount === 0 && !hasElective)
    return EligibilityStatus.FULL_DESPITE_MISSING;
  if (failCount === 1) return EligibilityStatus.MISSING_1;
  if (failCount === 2) return EligibilityStatus.MISSING_2;
  if (failCount === 3) return EligibilityStatus.MISSING_3;
  if (failCount >= 4) return EligibilityStatus.MISSING_4_PLUS;
  return EligibilityStatus.PARTIAL;
}

function getStatusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case EligibilityStatus.FULL_BAGRUT:
      return { text: 'זכאי', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case EligibilityStatus.FULL_DESPITE_MISSING:
      return { text: 'זכאי*', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case EligibilityStatus.MISSING_1:
      return { text: 'חסר 1', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    case EligibilityStatus.MISSING_2:
      return { text: 'חסר 2', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    case EligibilityStatus.MISSING_3:
      return { text: 'חסר 3', color: 'bg-red-100 text-red-800 border-red-300' };
    case EligibilityStatus.MISSING_4_PLUS:
      return { text: 'חסר 4+', color: 'bg-red-200 text-red-900 border-red-400' };
    case EligibilityStatus.NON_MATRICULATION:
      return { text: 'לא זכאי', color: 'bg-red-200 text-red-900 border-red-400' };
    default:
      return { text: 'חלקי', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  }
}

export function WhatIfProjections() {
  const [offset, setOffset] = useState<number>(-5);
  const allStudents = getAllStudents();

  const { projectedStudents, summary } = useMemo(() => {
    const classes = getClasses();
    const classMap = new Map(classes.map((c) => [c.id, c.displayName]));

    const results: ProjectedStudent[] = [];

    let currentEligible = 0;
    let projectedEligible = 0;
    let improvementCount = 0;
    let currentExcellent = 0;
    let projectedExcellent = 0;

    for (const student of allStudents) {
      const wasEligible = isEligible(student.eligibilityStatus);
      const wasExcellent = isExcellent(student.weightedAverage);

      if (wasEligible) currentEligible++;
      if (wasExcellent) currentExcellent++;

      const { projectedGrades, projectedAvg } = computeProjection(
        student,
        offset
      );
      const projectedElig = determineProjectedEligibility(projectedGrades);
      const nowEligible = isEligible(projectedElig);
      const nowExcellent = isExcellent(projectedAvg);

      if (nowEligible) projectedEligible++;
      if (nowExcellent) projectedExcellent++;

      const delta = projectedAvg - student.weightedAverage;
      const crossedThreshold =
        (!wasEligible && nowEligible) || (!wasExcellent && nowExcellent);

      if (Math.abs(delta) > 0.01) {
        improvementCount++;
      }

      results.push({
        student,
        projectedAverage: projectedAvg,
        delta,
        projectedEligibility: projectedElig,
        crossedThreshold,
        className: classMap.get(student.classId) ?? student.classId,
      });
    }

    // Sort by delta descending, take top 50 with room for improvement
    const withImprovement = results
      .filter((r) => r.delta > 0.01)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 50);

    return {
      projectedStudents: withImprovement,
      summary: {
        currentEligibilityRate: (currentEligible / allStudents.length) * 100,
        projectedEligibilityRate: (projectedEligible / allStudents.length) * 100,
        improvementCount,
        currentExcellent,
        projectedExcellent,
      },
    };
  }, [allStudents, offset]);

  return (
    <div dir="rtl" className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">תחזיות ומישחוק</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ניתוח תרחישים וחיזוי תוצאות בגרות &middot; סימולטור &quot;מה אם&quot;
        </p>
      </div>

      {/* Config Panel */}
      <Card className="border-2 border-indigo-100 bg-indigo-50/30 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-5 bg-indigo-500 rounded-full" />
            הגדרות תחזית
          </CardTitle>
          <CardDescription>
            המערכת מחשבת ציון צפוי לכל מקצוע חסר: הציון הגבוה ביותר של התלמיד
            פחות הניכוי
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">
              ניכוי מהציון הגבוה ביותר:
            </label>
            <Input
              type="number"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-[100px] text-center"
              min={-50}
              max={0}
            />
            <span className="text-xs text-muted-foreground">
              (ערך שלילי, למשל -5 פירושו ניכוי של 5 נקודות)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <Users className="size-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ציון זכאות צפוי</p>
                <p className="text-xl font-bold text-slate-900">
                  {summary.projectedEligibilityRate.toFixed(1)}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  נוכחי: {summary.currentEligibilityRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="size-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">שיפור צפוי</p>
                <p className="text-xl font-bold text-slate-900">
                  {summary.improvementCount}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  תלמידים עם שיפור בממוצע
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Award className="size-5 text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">מצטיינים צפויים</p>
                <p className="text-xl font-bold text-slate-900">
                  {summary.projectedExcellent}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  נוכחי: {summary.currentExcellent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            תלמידים עם פוטנציאל לשיפור ({projectedStudents.length})
          </CardTitle>
          <CardDescription>
            תלמידים שצפויים לשפר ממוצע כתוצאה מהשלמת מקצועות חסרים
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projectedStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              אין תלמידים עם פוטנציאל לשיפור בהגדרות הנוכחיות
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">כיתה</TableHead>
                  <TableHead className="text-center">ממוצע נוכחי</TableHead>
                  <TableHead className="text-center">ממוצע צפוי</TableHead>
                  <TableHead className="text-center">שינוי</TableHead>
                  <TableHead className="text-center">מצב צפוי</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectedStudents.map((row) => {
                  const statusInfo = getStatusLabel(row.projectedEligibility);
                  return (
                    <TableRow
                      key={row.student.id}
                      className={`transition-colors ${
                        row.crossedThreshold
                          ? 'bg-emerald-50/60 hover:bg-emerald-100/50 border-r-2 border-r-emerald-400'
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <TableCell className="font-medium text-sm">
                        {row.student.firstName} {row.student.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {row.className}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <ScoreCell
                          score={Math.round(row.student.weightedAverage)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-sm tabular-nums">
                          {row.projectedAverage.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-emerald-600 text-sm font-medium tabular-nums">
                          +{row.delta.toFixed(1)} &#8593;
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`text-[10px] border ${statusInfo.color}`}
                          variant="outline"
                        >
                          {statusInfo.text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
