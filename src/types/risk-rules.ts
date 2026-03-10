// NL Risk Rules — Type Definitions
// Using const objects instead of enums for erasableSyntaxOnly compatibility

export const ComparisonOperator = {
  EQ: 'eq',
  NEQ: 'neq',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
} as const;
export type ComparisonOperator =
  (typeof ComparisonOperator)[keyof typeof ComparisonOperator];

export const FieldType = {
  WEIGHTED_AVERAGE: 'weightedAverage',
  FAILURE_COUNT: 'failureCount',
  ELIGIBILITY_STATUS: 'eligibilityStatus',
  MATH_UNIT_LEVEL: 'mathUnitLevel',
  ENGLISH_UNIT_LEVEL: 'englishUnitLevel',
  SUBJECT_GRADE: 'subjectGrade',
} as const;
export type FieldType = (typeof FieldType)[keyof typeof FieldType];

export interface RuleCondition {
  field: FieldType;
  operator: ComparisonOperator;
  value: number | string;
  subjectId?: string;
}

export interface RiskRule {
  riskLevel: 1 | 2 | 3;
  label: string;
  conditions: RuleCondition[];
}

export interface RiskRuleSet {
  rules: RiskRule[];
  defaultRiskLevel: 1 | 2 | 3;
}
