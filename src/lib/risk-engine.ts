// NL Risk Rules — Pure Engine Functions
// Evaluates students against a RiskRuleSet to assign risk levels.

import type { Student } from '@/types';
import type { RiskLevel } from '@/types';
import type {
  RuleCondition,
  RiskRuleSet,
  ComparisonOperator,
} from '@/types/risk-rules';
import type { RiskRulesConfig } from '@/contexts/ConfigContext';

// ─── Core Subject IDs (for failure counting) ────────────────────────────────

const CORE_SUBJECT_IDS = [
  'math',
  'history',
  'civics',
  'tanakh',
  'literature',
  'language',
  'english',
] as const;

// ─── Field Value Resolution ─────────────────────────────────────────────────

/**
 * Resolves the value of a field for a given student and condition.
 * - `weightedAverage`: student.weightedAverage
 * - `failureCount`: count of core subjects with final < 55
 * - `eligibilityStatus`: student.eligibilityStatus (string)
 * - `mathUnitLevel`: student.mathUnitLevel
 * - `englishUnitLevel`: student.englishUnitLevel
 * - `subjectGrade`: student.grades[condition.subjectId]?.final
 */
export function getFieldValue(
  student: Student,
  condition: RuleCondition,
): number | string | undefined {
  switch (condition.field) {
    case 'weightedAverage':
      return student.weightedAverage;

    case 'failureCount': {
      let count = 0;
      for (const id of CORE_SUBJECT_IDS) {
        if (student.grades[id] && student.grades[id].final < 55) {
          count++;
        }
      }
      return count;
    }

    case 'eligibilityStatus':
      return student.eligibilityStatus;

    case 'mathUnitLevel':
      return student.mathUnitLevel;

    case 'englishUnitLevel':
      return student.englishUnitLevel;

    case 'subjectGrade': {
      if (!condition.subjectId) return undefined;
      return student.grades[condition.subjectId]?.final;
    }

    default:
      return undefined;
  }
}

// ─── Comparison ──────────────────────────────────────────────────────────────

function compare(
  actual: number | string,
  operator: ComparisonOperator,
  expected: number | string,
): boolean {
  switch (operator) {
    case 'eq':
      return actual === expected;
    case 'neq':
      return actual !== expected;
    case 'gt':
      return actual > expected;
    case 'gte':
      return actual >= expected;
    case 'lt':
      return actual < expected;
    case 'lte':
      return actual <= expected;
    default:
      return false;
  }
}

// ─── Condition Evaluation ────────────────────────────────────────────────────

/**
 * Evaluates a single condition against a student.
 * Returns false if the field value cannot be resolved.
 */
export function evaluateCondition(
  student: Student,
  condition: RuleCondition,
): boolean {
  const fieldValue = getFieldValue(student, condition);
  if (fieldValue === undefined) return false;
  return compare(fieldValue, condition.operator, condition.value);
}

// ─── Student Evaluation ─────────────────────────────────────────────────────

/**
 * Evaluates a student against a rule set.
 * Iterates rules top-to-bottom; returns the riskLevel of the first rule
 * where ALL conditions match (AND logic). Falls back to defaultRiskLevel.
 */
export function evaluateStudent(
  student: Student,
  ruleSet: RiskRuleSet,
): RiskLevel {
  for (const rule of ruleSet.rules) {
    const allMatch = rule.conditions.every((cond) =>
      evaluateCondition(student, cond),
    );
    if (allMatch) {
      return rule.riskLevel as RiskLevel;
    }
  }
  return ruleSet.defaultRiskLevel as RiskLevel;
}

// ─── Batch Application ──────────────────────────────────────────────────────

/**
 * Applies a rule set to all students, mutating each student's riskLevel.
 */
export function applyRiskRules(
  students: Student[],
  ruleSet: RiskRuleSet,
): void {
  for (const student of students) {
    student.riskLevel = evaluateStudent(student, ruleSet);
  }
}

// ─── Manual Config Conversion ───────────────────────────────────────────────

/**
 * Converts the existing numeric config (highRiskFailures, riskFailures,
 * escalationAvgBelow) into a RiskRuleSet that reproduces the same behaviour
 * as the original determineRiskLevel function.
 *
 * Logic (from mock-data.ts):
 *   failCount >= highRiskFailures  -> LEVEL_3
 *   failCount >= riskFailures && avg < escalationAvgBelow -> LEVEL_3
 *   failCount >= riskFailures -> LEVEL_2
 *   else -> LEVEL_1
 */
export function manualConfigToRuleSet(riskRules: RiskRulesConfig): RiskRuleSet {
  return {
    rules: [
      // Rule 1: failCount >= highRiskFailures -> high risk (level 3)
      {
        riskLevel: 3,
        label: `${riskRules.highRiskFailures}+ core failures`,
        conditions: [
          {
            field: 'failureCount',
            operator: 'gte',
            value: riskRules.highRiskFailures,
          },
        ],
      },
      // Rule 2: failCount >= riskFailures AND avg < escalationAvgBelow -> high risk (level 3)
      {
        riskLevel: 3,
        label: `${riskRules.riskFailures}+ failures with avg below ${riskRules.escalationAvgBelow}`,
        conditions: [
          {
            field: 'failureCount',
            operator: 'gte',
            value: riskRules.riskFailures,
          },
          {
            field: 'weightedAverage',
            operator: 'lt',
            value: riskRules.escalationAvgBelow,
          },
        ],
      },
      // Rule 3: failCount >= riskFailures -> moderate risk (level 2)
      {
        riskLevel: 2,
        label: `${riskRules.riskFailures}+ core failures`,
        conditions: [
          {
            field: 'failureCount',
            operator: 'gte',
            value: riskRules.riskFailures,
          },
        ],
      },
    ],
    defaultRiskLevel: 1,
  };
}
