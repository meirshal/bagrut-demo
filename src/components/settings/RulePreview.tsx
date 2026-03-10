import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RiskRuleSet, RiskRule, RuleCondition } from '@/types/risk-rules';
import { evaluateStudent } from '@/lib/risk-engine';
import { getAllStudents } from '@/data/mock-data';
import { RISK_COLORS } from '@/lib/colors';
import type { RiskLevel } from '@/types';

// ─── Hebrew translations ─────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  weightedAverage: 'ממוצע משוקלל',
  failureCount: 'כישלונות',
  eligibilityStatus: 'סטטוס זכאות',
  mathUnitLevel: 'יחידות מתמטיקה',
  englishUnitLevel: 'יחידות אנגלית',
  subjectGrade: 'ציון מקצוע',
};

const OPERATOR_LABELS: Record<string, string> = {
  eq: '=',
  neq: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
};

const RISK_LEVEL_LABELS: Record<number, string> = {
  1: 'תקין',
  2: 'סיכון',
  3: 'סיכון גבוה',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCondition(condition: RuleCondition): string {
  const field = FIELD_LABELS[condition.field] ?? condition.field;
  const op = OPERATOR_LABELS[condition.operator] ?? condition.operator;
  return `${field} ${op} ${condition.value}`;
}

function getRiskStyle(level: 1 | 2 | 3) {
  const colors = RISK_COLORS[level as RiskLevel];
  return {
    backgroundColor: colors.bg === 'transparent' ? '#fef3c7' : colors.bg,
    color: colors.text,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RulePreviewProps {
  ruleSet: RiskRuleSet;
  onApprove: (ruleSet: RiskRuleSet) => void;
  onCancel: () => void;
}

export function RulePreview({ ruleSet, onApprove, onCancel }: RulePreviewProps) {
  const distribution = useMemo(() => {
    const students = getAllStudents();
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (const student of students) {
      const level = evaluateStudent(student, ruleSet);
      counts[level] = (counts[level] ?? 0) + 1;
    }
    return counts;
  }, [ruleSet]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>תצוגה מקדימה של כללים</CardTitle>
        <CardDescription>
          בדקו את הכללים שנוצרו לפני אישור והחלה
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rules list */}
        <div className="space-y-3" dir="rtl">
          {ruleSet.rules.map((rule: RiskRule, index: number) => (
            <div
              key={index}
              className="rounded-lg border p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold"
                  style={getRiskStyle(rule.riskLevel)}
                >
                  רמה {rule.riskLevel} — {RISK_LEVEL_LABELS[rule.riskLevel]}
                </span>
                <span className="text-sm text-muted-foreground">
                  {rule.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {rule.conditions.map((cond: RuleCondition, ci: number) => (
                  <span
                    key={ci}
                    className="inline-flex items-center rounded-md border bg-muted px-2 py-1 text-xs"
                  >
                    {formatCondition(cond)}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Default level */}
          <div className="rounded-lg border border-dashed p-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold"
                style={getRiskStyle(ruleSet.defaultRiskLevel)}
              >
                ברירת מחדל — רמה {ruleSet.defaultRiskLevel} — {RISK_LEVEL_LABELS[ruleSet.defaultRiskLevel]}
              </span>
              <span className="text-sm text-muted-foreground">
                כל מי שלא תואם לכללים לעיל
              </span>
            </div>
          </div>
        </div>

        {/* Distribution preview */}
        <div dir="rtl" className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-medium">התפלגות צפויה:</p>
          <div className="flex flex-wrap gap-3">
            {([1, 2, 3] as const).map((level) => (
              <span
                key={level}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium"
                style={getRiskStyle(level)}
              >
                {distribution[level]} תלמידים ברמה {level}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2" dir="rtl">
          <Button onClick={() => onApprove(ruleSet)}>
            <Check className="size-4" />
            אישור והחלה
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="size-4" />
            ביטול
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
