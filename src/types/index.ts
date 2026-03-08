// Bagrut Tracking System - TypeScript Types
// Using const objects instead of enums for erasableSyntaxOnly compatibility

export const RiskLevel = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const ExcellenceTier = {
  NONE: 'none',
  BORDER_GIMEL: 'border_gimel',  // 81-84: close to Gimel threshold
  GIMEL: 'gimel',                // 85-89: מצויינות 1-ג
  BORDER_BET: 'border_bet',      // 86-89 within Gimel: close to Bet threshold
  BET: 'bet',                    // 90-95: מצויינות 1-ב
  ALEPH: 'aleph',                // 96+: מצויינות 1-א
} as const;
export type ExcellenceTier = (typeof ExcellenceTier)[keyof typeof ExcellenceTier];

export const UnitLevel = {
  UNITS_3: 3,
  UNITS_4: 4,
  UNITS_5: 5,
} as const;
export type UnitLevel = (typeof UnitLevel)[keyof typeof UnitLevel];

export const EligibilityStatus = {
  FULL_BAGRUT: 'FULL_BAGRUT',
  FULL_DESPITE_MISSING: 'FULL_DESPITE_MISSING',
  PARTIAL: 'PARTIAL',
  MISSING_1: 'MISSING_1',
  MISSING_2: 'MISSING_2',
  MISSING_3: 'MISSING_3',
  MISSING_4_PLUS: 'MISSING_4_PLUS',
  NON_MATRICULATION: 'NON_MATRICULATION',
} as const;
export type EligibilityStatus =
  (typeof EligibilityStatus)[keyof typeof EligibilityStatus];

export const AccommodationType = {
  ADAPTED: 'adapted',
  DICTATION: 'dictation',
  ORAL: 'oral',
  SPECIAL: 'special',
} as const;
export type AccommodationType =
  (typeof AccommodationType)[keyof typeof AccommodationType];

export const ChallengeCategory = {
  ESPECIALLY_CHALLENGING: 'especially_challenging',
  WILL_PROBABLY_PASS: 'will_probably_pass',
  CLOSE_FOLLOWUP: 'close_followup',
} as const;
export type ChallengeCategory =
  (typeof ChallengeCategory)[keyof typeof ChallengeCategory];

export interface SubjectGrades {
  internal?: number;
  external?: number;
  final: number;
  /** Sub-scores: questionnaire results (math), module scores (english), etc. */
  components?: Record<string, number | undefined>;
}

export interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
}

export interface Student {
  id: string;
  studentNumber: number;
  firstName: string;
  lastName: string;
  classId: string;
  mathUnitLevel: UnitLevel;
  englishUnitLevel: UnitLevel;
  accommodations: AccommodationType[];
  riskLevel: RiskLevel;
  excellenceTier: ExcellenceTier;
  eligibilityStatus: EligibilityStatus;
  weightedAverage: number;
  grades: Record<string, SubjectGrades>;
  notes: Note[];
  challengeCategory?: ChallengeCategory;
  challengeAssignedTo?: string;
}

export interface SchoolClass {
  id: string;
  number: number;
  displayName: string;
  homeroomTeacher: string;
  studentCount: number;
  isSpecial: boolean;
  /** IDs of elective subjects available for students in this class. */
  electiveSubjectIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  questionnaireCode: string;
  unitLevel?: UnitLevel;
  /** Whether this subject counts toward the weighted average (core-weighted subjects). */
  isCore: boolean;
  /** Whether passing this subject is required for Bagrut eligibility (pass/fail gate). */
  isRequired: boolean;
  /** Whether this is a pass/fail subject (not scored on the 0-100 scale in the average). */
  isPassFail?: boolean;
  weights: {
    internal: number;
    external: number;
  };
}

export interface ExamPeriod {
  id: string;
  name: string;
  shortName: string;
}

export interface EligibilityStats {
  fullBagrut: number;
  fullDespiteMissing: number;
  partial: number;
  missing1: number;
  missing2: number;
  missing3: number;
  missing4Plus: number;
  nonMatriculation: number;
  total: number;
}

/** Failure-count categorization scheme stats */
export interface FailureStats {
  noFailures: number;
  failures1: number;
  failures2: number;
  failures3: number;
  failures4: number;
  failures5Plus: number;
  nonMatriculation: number;
  total: number;
}

/** The two categorization schemes for the rikuz matrix */
export const RikuzScheme = {
  EXAM_MISSING: 'exam_missing',
  FAILURE_COUNT: 'failure_count',
} as const;
export type RikuzScheme = (typeof RikuzScheme)[keyof typeof RikuzScheme];

export interface YearComparison {
  year: string;
  eligibilityRate: number;
  excellenceRate: number;
  math5Rate: number;
  english5Rate: number;
}

export interface RikuzRow {
  classId: string;
  className: string;
  studentCount: number;
  isSpecialClass: boolean;
  stats: EligibilityStats;
  failureStats: FailureStats;
}

/** KPI data for a specific period */
export interface PeriodKPIData {
  totalStudents: number;
  fullEligible: number;
  eligiblePct: string;
  atRisk: number;
  atRiskPct: string;
  excellence: number;
  excellencePct: string;
}
