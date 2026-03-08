// Bagrut Tracking System - TypeScript Types
// Using const objects instead of enums for erasableSyntaxOnly compatibility

export const RiskLevel = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5,
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

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
  components?: Record<string, number>;
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
}

export interface Subject {
  id: string;
  name: string;
  questionnaireCode: string;
  unitLevel?: UnitLevel;
  isCore: boolean;
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
  stats: EligibilityStats;
}
