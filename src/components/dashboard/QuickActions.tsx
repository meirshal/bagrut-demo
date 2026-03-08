import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getChallengeStudents, getAllStudents, getClasses } from '@/data/mock-data';
import { ChallengeCategory } from '@/types';

const CHALLENGE_LABELS: Record<string, { label: string; className: string }> = {
  [ChallengeCategory.ESPECIALLY_CHALLENGING]: {
    label: 'מאתגר במיוחד',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
  [ChallengeCategory.WILL_PROBABLY_PASS]: {
    label: 'צפוי לעבור',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  },
  [ChallengeCategory.CLOSE_FOLLOWUP]: {
    label: 'מעקב צמוד',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
};

const RISK_LEVEL_CONFIG: {
  level: number;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  { level: 1, label: 'רמה 1 - במסלול', color: '#16a34a', bgColor: '#dcfce7' },
  { level: 2, label: 'רמה 2 - סיכון נמוך', color: '#d97706', bgColor: '#fef3c7' },
  { level: 3, label: 'רמה 3 - סיכון גבוה', color: '#dc2626', bgColor: '#fee2e2' },
  { level: 4, label: 'רמה 4 - גבול הצטיינות א', color: '#7c3aed', bgColor: '#ede9fe' },
  { level: 5, label: 'רמה 5 - גבול הצטיינות ב', color: '#be185d', bgColor: '#fce7f3' },
];

export function QuickActions() {
  const data = useMemo(() => {
    const challengeStudents = getChallengeStudents().slice(0, 5);
    const allStudents = getAllStudents();
    const classes = getClasses();

    // Build class lookup
    const classMap = new Map(classes.map((c) => [c.id, c.displayName]));

    // Risk distribution
    const riskDist = RISK_LEVEL_CONFIG.map((rc) => {
      const count = allStudents.filter((s) => s.riskLevel === rc.level).length;
      return { ...rc, count, pct: ((count / allStudents.length) * 100).toFixed(1) };
    });

    const maxRiskCount = Math.max(...riskDist.map((r) => r.count));

    return { challengeStudents, classMap, riskDist, maxRiskCount };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Challenging Students */}
      <Card className="rounded-xl shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="inline-block w-1.5 h-5 bg-red-400 rounded-full" />
            תלמידים מאתגרים אחרונים
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ul className="space-y-2.5">
            {data.challengeStudents.map((student) => {
              const challengeConfig = student.challengeCategory
                ? CHALLENGE_LABELS[student.challengeCategory]
                : null;
              return (
                <li
                  key={student.id}
                  className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {data.classMap.get(student.classId) || student.classId}
                    </p>
                  </div>
                  {challengeConfig && (
                    <Badge variant="secondary" className={`text-[9px] px-1.5 py-0.5 shrink-0 ${challengeConfig.className}`}>
                      {challengeConfig.label}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className="rounded-xl shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span className="inline-block w-1.5 h-5 bg-amber-400 rounded-full" />
            התפלגות רמות סיכון
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2.5">
          {data.riskDist.map((rd) => (
            <div key={rd.level} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-medium text-slate-600">{rd.label}</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {rd.count} ({rd.pct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(rd.count / data.maxRiskCount) * 100}%`,
                    backgroundColor: rd.color,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
