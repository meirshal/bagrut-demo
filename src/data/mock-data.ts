// Bagrut Tracking System - Comprehensive Mock Data
// All names are Hebrew. Data is self-consistent: weighted averages match scores,
// risk levels match score patterns.

import type {
  Student,
  SchoolClass,
  Subject,
  ExamPeriod,
  SubjectGrades,
  Note,
  YearComparison,
  RikuzRow,
  EligibilityStats,
  FailureStats,
  PeriodKPIData,
} from '@/types';
import {
  RiskLevel,
  UnitLevel,
  EligibilityStatus,
  AccommodationType,
  ChallengeCategory,
} from '@/types';

// ─── Seeded Random Number Generator ────────────────────────────────────────────
// Deterministic so mock data is consistent across runs.

function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rng = createRng(42);

function randInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ─── Name Pools ────────────────────────────────────────────────────────────────

const FIRST_NAMES_MALE = [
  'רם', 'יובל', 'עידן', 'אורי', 'נועם', 'איתי', 'רועי', 'אלון',
  'עומר', 'דניאל', 'גיל', 'ליאם', 'שי', 'ארי', 'יונתן', 'אביב',
  'עילי', 'טל', 'בן', 'אייל', 'אדם', 'ניר', 'דביר', 'לביא',
  'שחר', 'אמיר', 'עדו', 'מתן', 'אריאל', 'תומר',
] as const;

const FIRST_NAMES_FEMALE = [
  'נועה', 'שירה', 'מיכל', 'תמר', 'רוני', 'ליאן', 'יעל', 'הילה',
  'מאיה', 'שקד', 'אגם', 'עדן', 'נעמה', 'רות', 'חן', 'ליהי',
  'אביגיל', 'שירן', 'ענבל', 'מורן', 'סהר', 'דנה', 'אורלי', 'הדר',
  'דקלה', 'ליאור', 'רינת', 'גפן', 'עלמה', 'נוגה',
] as const;

const LAST_NAMES = [
  'כהן', 'לוי', 'מזרחי', 'אברהם', 'דוד', 'שלום', 'פרץ', 'ביטון',
  'אזולאי', 'דהן', 'אבוטבול', 'גבאי', 'שמעון', 'חזן', 'אשכנזי',
  'יוסף', 'מלכה', 'עמר', 'סבן', 'אלימלך', 'בן דוד', 'חיים',
  'מור', 'נחום', 'סויסה', 'אוחנה', 'גולדברג', 'זהבי', 'שפירא', 'רוזנברג',
] as const;

// ─── Teacher Name Pools ────────────────────────────────────────────────────────

const TEACHER_NAMES = [
  'שרית כהן', 'יעקב לוי', 'מירי אברהם', 'דוד מזרחי', 'רחל שלום',
  'אבי ביטון', 'סיגלית פרץ', 'חיים דהן', 'אורנה אזולאי', 'משה גבאי',
  'עינת שמעון', 'יוסי חזן', 'נורית אשכנזי', 'רון יוסף', 'שולמית מלכה',
  'אברהם עמר',
] as const;

// ─── Subjects ──────────────────────────────────────────────────────────────────

const subjects: Subject[] = [
  // ── Core weighted subjects (included in weighted average) ──────────────────
  { id: 'math', name: 'מתמטיקה', questionnaireCode: '382', isCore: true, isRequired: true, weights: { internal: 0, external: 1 } },
  { id: 'history', name: 'היסטוריה', questionnaireCode: '16381', isCore: true, isRequired: true, unitLevel: UnitLevel.UNITS_3, weights: { internal: 0.3, external: 0.7 } },
  { id: 'civics', name: 'אזרחות', questionnaireCode: '34381', isCore: true, isRequired: true, unitLevel: UnitLevel.UNITS_3, weights: { internal: 0.2, external: 0.8 } },
  { id: 'tanakh', name: 'תנ"ך', questionnaireCode: '2381', isCore: true, isRequired: true, unitLevel: UnitLevel.UNITS_3, weights: { internal: 0.3, external: 0.7 } },
  { id: 'literature', name: 'ספרות', questionnaireCode: '44382', isCore: true, isRequired: true, unitLevel: UnitLevel.UNITS_3, weights: { internal: 0.3, external: 0.7 } },
  { id: 'language', name: 'לשון', questionnaireCode: '55381', isCore: true, isRequired: true, unitLevel: UnitLevel.UNITS_3, weights: { internal: 0.3, external: 0.7 } },
  { id: 'english', name: 'אנגלית', questionnaireCode: '16382', isCore: true, isRequired: true, weights: { internal: 0, external: 1 } },

  // ── Core non-weighted subjects (required for eligibility, not in weighted average) ──
  { id: 'general-studies', name: 'השכלה כללית', questionnaireCode: '', isCore: false, isRequired: true, isPassFail: true, weights: { internal: 0, external: 1 } },
  { id: 'intro-sciences', name: 'מבוא למדעים', questionnaireCode: '', isCore: false, isRequired: true, isPassFail: true, weights: { internal: 0, external: 1 } },
  { id: 'pe', name: 'חנ"ג', questionnaireCode: '', isCore: false, isRequired: true, isPassFail: true, weights: { internal: 0, external: 1 } },
  { id: 'community-service', name: 'מעורבות חברתית', questionnaireCode: '', isCore: false, isRequired: true, isPassFail: true, weights: { internal: 0, external: 1 } },

  // ── Elective / Major subjects (מגמות) ─────────────────────────────────────
  { id: 'cs', name: 'מדעי המחשב', questionnaireCode: '899381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.76, external: 0.24 } },
  { id: 'physics', name: 'פיזיקה', questionnaireCode: '361', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'biology', name: 'ביולוגיה', questionnaireCode: '43381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'chemistry', name: 'כימיה', questionnaireCode: '37381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'geography', name: 'גיאוגרפיה', questionnaireCode: '57381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.6, external: 0.4 } },
  { id: 'management', name: 'מנהל וכלכלה', questionnaireCode: '839283', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'social-sciences', name: 'מדעי החברה', questionnaireCode: '281', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'jewish-law', name: 'חוק"ש תושב"ע', questionnaireCode: '7383', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.5, external: 0.5 } },
  { id: 'spanish', name: 'ספרדית', questionnaireCode: '579385', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.6, external: 0.4 } },
  { id: 'arabic', name: 'ערבית', questionnaireCode: '671381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'french', name: 'צרפתית', questionnaireCode: '652381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'film', name: 'קולנוע', questionnaireCode: '61387', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'medical-sciences', name: 'מדעי הרפואה', questionnaireCode: '802381', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.3, external: 0.7 } },
  { id: 'communications', name: 'תקשורת', questionnaireCode: '56387', isCore: false, isRequired: false, unitLevel: UnitLevel.UNITS_5, weights: { internal: 0.5, external: 0.5 } },
];

// ─── Exam Periods ──────────────────────────────────────────────────────────────

const examPeriods: ExamPeriod[] = [
  { id: 'summer-11', name: 'אחרי קיץ יא', shortName: 'קיץ יא' },
  { id: 'summer-12', name: 'אחרי קיץ יב', shortName: 'קיץ יב' },
  { id: 'winter-12', name: 'אחרי חורף יב', shortName: 'חורף יב' },
  { id: 'corrections', name: 'אחרי חורף+תיקונים', shortName: 'תיקונים' },
];

// ─── Classes ───────────────────────────────────────────────────────────────────

const CLASS_SIZES: Record<number, number> = {
  1: 33, 2: 35, 3: 31, 4: 34, 5: 32, 6: 36, 7: 30, 8: 36,
  9: 29, 10: 34, 11: 32, 12: 13, 13: 35, 14: 31, 15: 33, 16: 30,
};

// ─── Class-specific elective pools ───────────────────────────────────────────
// Based on the real spreadsheet: which elective subjects appear in which classes.
// Key from FILE-ANALYSIS.md:
//   CS: multiple classes | Physics: multiple | Chemistry: 2,5,7,8,9,10,11,13,15
//   Biology: 2,5,6,7,8,9,13,14,15 | Geography: 1,others | Management: multiple
//   Social Sciences: 4,7,8,13,14 | Jewish Law: multiple | Spanish: 1,others
//   Arabic: 5,6,7,8,9,13,14,15,16 | French: 5,6,13 | Film: 2,others
//   Medical Sciences: 2,others | Communications: class 12 only

const CLASS_ELECTIVES: Record<number, string[]> = {
  1:  ['cs', 'geography', 'spanish', 'jewish-law'],
  2:  ['cs', 'biology', 'chemistry', 'film', 'medical-sciences'],
  3:  ['cs', 'physics', 'jewish-law'],
  4:  ['cs', 'physics', 'social-sciences', 'management'],
  5:  ['biology', 'chemistry', 'arabic', 'french'],
  6:  ['biology', 'arabic', 'french', 'geography'],
  7:  ['physics', 'biology', 'chemistry', 'social-sciences', 'arabic'],
  8:  ['physics', 'chemistry', 'social-sciences', 'arabic'],
  9:  ['cs', 'chemistry', 'biology', 'arabic'],
  10: ['cs', 'physics', 'chemistry', 'management'],
  11: ['cs', 'physics', 'chemistry', 'jewish-law'],
  12: ['communications'],  // Special class – Communications only
  13: ['biology', 'chemistry', 'social-sciences', 'arabic', 'french'],
  14: ['cs', 'biology', 'social-sciences', 'arabic'],
  15: ['biology', 'chemistry', 'arabic', 'management'],
  16: ['cs', 'physics', 'arabic', 'management'],
};

const classes: SchoolClass[] = Array.from({ length: 16 }, (_, i) => {
  const num = i + 1;
  return {
    id: `class-${num}`,
    number: num,
    displayName: `יב ${num}`,
    homeroomTeacher: TEACHER_NAMES[i],
    studentCount: CLASS_SIZES[num],
    isSpecial: num === 12,
    electiveSubjectIds: CLASS_ELECTIVES[num],
  };
});

// ─── Note Date Generation ────────────────────────────────────────────────────
// Spread notes across the academic year: September 2025 through March 2026.

const NOTE_DATES = [
  '2025-09-08', '2025-09-15', '2025-09-22', '2025-09-29',
  '2025-10-06', '2025-10-14', '2025-10-20', '2025-10-27',
  '2025-11-03', '2025-11-10', '2025-11-17', '2025-11-24',
  '2025-12-01', '2025-12-08', '2025-12-15', '2025-12-22',
  '2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26',
  '2026-02-02', '2026-02-09', '2026-02-16', '2026-02-23',
  '2026-03-02',
] as const;

function pickNoteDate(): string {
  return NOTE_DATES[Math.floor(rng() * NOTE_DATES.length)];
}

// ─── Score Generation Helpers ──────────────────────────────────────────────────

function generateScore(isSpecialClass: boolean): number {
  const r = rng();
  if (isSpecialClass) {
    // Special ed class: more failing, lower average
    if (r < 0.20) return randInt(30, 51);
    if (r < 0.35) return randInt(52, 54);
    if (r < 0.90) return randInt(55, 75);
    return randInt(76, 90);
  }
  // Regular distribution: ~3% failing (<52), ~2% borderline (52-54), ~80% passing (55-89), ~15% excellence (90+)
  // Per-subject failure rate is low so that across 7 core subjects,
  // ~70% of students pass all and land at risk level 1.
  if (r < 0.03) return randInt(30, 51);
  if (r < 0.05) return randInt(52, 54);
  if (r < 0.85) return randInt(55, 89);
  return randInt(90, 100);
}

/** Generate a pass/fail score for non-weighted required subjects. */
function generatePassFailScore(isSpecialClass: boolean): number {
  if (isSpecialClass) {
    // Special class: lower pass rate
    return rng() < 0.75 ? randInt(55, 90) : randInt(30, 54);
  }
  // Regular: very high pass rate (~95%)
  return rng() < 0.95 ? randInt(55, 100) : randInt(35, 54);
}

// ─── Math Component Generation ────────────────────────────────────────────────
// Generates questionnaire scores per unit level and computes Sofi.
// Math 3-unit: q182_183 * 0.25 + q381 * 0.35 + q382 * 0.40
// Math 4-unit: q481 * 0.65 + q482 * 0.35
// Math 5-unit: q581 * 0.60 + q582 * 0.40

function generateMathGrades(
  unitLevel: UnitLevel,
  isSpecialClass: boolean
): SubjectGrades {
  const components: Record<string, number | undefined> = {};
  let sofi: number;

  if (unitLevel === UnitLevel.UNITS_3) {
    const q182 = generateScore(isSpecialClass);
    const q381 = generateScore(isSpecialClass);
    const q382 = generateScore(isSpecialClass);
    components['q182'] = q182;
    components['q381'] = q381;
    components['q382'] = q382;
    sofi = Math.round(q182 * 0.25 + q381 * 0.35 + q382 * 0.40);
  } else if (unitLevel === UnitLevel.UNITS_4) {
    const q481 = generateScore(isSpecialClass);
    const q482 = generateScore(isSpecialClass);
    components['q481'] = q481;
    components['q482'] = q482;
    sofi = Math.round(q481 * 0.65 + q482 * 0.35);
  } else {
    // 5-unit
    const q581 = generateScore(isSpecialClass);
    const q582 = generateScore(isSpecialClass);
    components['q581'] = q581;
    components['q582'] = q582;
    sofi = Math.round(q581 * 0.60 + q582 * 0.40);
  }

  return { final: sofi, components };
}

// ─── English Component Generation ─────────────────────────────────────────────
// Generates module and oral scores per unit level and computes Sofi.
// English 3-unit: oral*0.20 + moduleC*0.27 + moduleB*0.26 + moduleA*0.27
// English 4-unit: oral*0.20 + moduleD*0.27 + moduleB*0.26 + moduleA*0.27
// English 5-unit: oral*0.20 + moduleG*0.27 + moduleF*0.26 + moduleE*0.27

function generateEnglishGrades(
  unitLevel: UnitLevel,
  isSpecialClass: boolean
): SubjectGrades {
  const components: Record<string, number | undefined> = {};
  let sofi: number;

  if (unitLevel === UnitLevel.UNITS_3) {
    const modA = generateScore(isSpecialClass);
    const modB = generateScore(isSpecialClass);
    const modC = generateScore(isSpecialClass);
    const oral = generateScore(isSpecialClass);
    components['modA'] = modA;
    components['modB'] = modB;
    components['modC'] = modC;
    components['oral'] = oral;
    sofi = Math.round(modA * 0.27 + modB * 0.26 + modC * 0.27 + oral * 0.20);
  } else if (unitLevel === UnitLevel.UNITS_4) {
    const modA = generateScore(isSpecialClass);
    const modB = generateScore(isSpecialClass);
    const modD = generateScore(isSpecialClass);
    const oral = generateScore(isSpecialClass);
    components['modA'] = modA;
    components['modB'] = modB;
    components['modD'] = modD;
    components['oral'] = oral;
    sofi = Math.round(modA * 0.27 + modB * 0.26 + modD * 0.27 + oral * 0.20);
  } else {
    // 5-unit
    const modE = generateScore(isSpecialClass);
    const modF = generateScore(isSpecialClass);
    const modG = generateScore(isSpecialClass);
    const oral = generateScore(isSpecialClass);
    components['modE'] = modE;
    components['modF'] = modF;
    components['modG'] = modG;
    components['oral'] = oral;
    sofi = Math.round(modE * 0.27 + modF * 0.26 + modG * 0.27 + oral * 0.20);
  }

  return { final: sofi, components };
}

function generateSubjectGrades(
  subjectId: string,
  isSpecialClass: boolean
): SubjectGrades {
  const sub = subjects.find((s) => s.id === subjectId);
  if (!sub) return { final: 0 };

  // Pass/fail subjects: single score only
  if (sub.isPassFail) {
    const score = generatePassFailScore(isSpecialClass);
    return { final: score };
  }

  // Math and English are handled separately with their multi-component generators
  // (see generateMathGrades / generateEnglishGrades called from student generation)
  if (subjectId === 'math' || subjectId === 'english') {
    // Fallback: should not reach here in normal flow
    const score = generateScore(isSpecialClass);
    return { final: score };
  }

  // Standard subjects with internal/external weights
  const internalScore = generateScore(isSpecialClass);
  const externalScore = generateScore(isSpecialClass);
  const final = Math.round(
    internalScore * sub.weights.internal + externalScore * sub.weights.external
  );
  return { internal: internalScore, external: externalScore, final };
}

// ─── Weighted Average Calculation ──────────────────────────────────────────────

function computeWeightedAverage(
  grades: Record<string, SubjectGrades>,
  mathLevel: UnitLevel,
  englishLevel: UnitLevel
): number {
  const mathFinal = grades['math']?.final ?? 0;
  const historyFinal = grades['history']?.final ?? 0;
  const civicsFinal = grades['civics']?.final ?? 0;
  const tanakhFinal = grades['tanakh']?.final ?? 0;
  const literatureFinal = grades['literature']?.final ?? 0;
  const languageFinal = grades['language']?.final ?? 0;
  const englishFinal = grades['english']?.final ?? 0;

  const totalUnits = mathLevel + 2 + 2 + 2 + 2 + 2 + englishLevel;
  const weightedSum =
    mathFinal * mathLevel +
    historyFinal * 2 +
    civicsFinal * 2 +
    tanakhFinal * 2 +
    literatureFinal * 2 +
    languageFinal * 2 +
    englishFinal * englishLevel;

  return Math.round((weightedSum / totalUnits) * 100) / 100;
}

// ─── Risk Level Determination ──────────────────────────────────────────────────

function determineRiskLevel(
  grades: Record<string, SubjectGrades>,
  weightedAvg: number
): RiskLevel {
  const coreIds = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];
  let failCount = 0;
  for (const id of coreIds) {
    if (grades[id] && grades[id].final < 55) failCount++;
  }

  // 3+ failures -> high risk
  if (failCount >= 3) return RiskLevel.LEVEL_3;
  // 2 failures -> high risk
  if (failCount === 2) return RiskLevel.LEVEL_3;
  // 1 failure with low average -> risk
  if (failCount === 1 && weightedAvg < 65) return RiskLevel.LEVEL_3;
  if (failCount === 1) return RiskLevel.LEVEL_2;
  // 0 failures: check excellence risk tiers (risk to losing excellence honors)
  // L4: borderline for Aleph/Bet honors tier (close to 90 threshold)
  if (weightedAvg >= 86 && weightedAvg <= 90) return RiskLevel.LEVEL_4;
  // L5: borderline for Gimel honors tier (close to 85 threshold)
  if (weightedAvg >= 81 && weightedAvg <= 85) return RiskLevel.LEVEL_5;
  // 0 failures, other average -> on track
  return RiskLevel.LEVEL_1;
}

// ─── Eligibility Status Determination ──────────────────────────────────────────

function determineEligibility(
  grades: Record<string, SubjectGrades>
): EligibilityStatus {
  const coreIds = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];
  let failCount = 0;
  for (const id of coreIds) {
    if (grades[id] && grades[id].final < 55) failCount++;
  }

  // Check for elective pass
  const electiveIds = [
    'cs', 'physics', 'biology', 'chemistry', 'geography',
    'management', 'social-sciences', 'jewish-law', 'spanish',
    'arabic', 'french', 'film', 'medical-sciences', 'communications',
  ];
  const hasPassingElective = electiveIds.some(
    (id) => grades[id] && grades[id].final >= 55
  );
  // Check if the student has an elective assigned but is missing/failing it
  const hasAnyElective = electiveIds.some((id) => grades[id] !== undefined);
  const hasFailingElective = electiveIds.some(
    (id) => grades[id] && grades[id].final < 55
  );

  if (failCount === 0 && hasPassingElective) return EligibilityStatus.FULL_BAGRUT;
  // FULL_DESPITE_MISSING: passed all core subjects but missing one non-core exam
  // (Ministry policy -- student qualifies even though one elective exam is incomplete)
  if (failCount === 0 && hasAnyElective && !hasPassingElective && hasFailingElective) {
    return EligibilityStatus.FULL_DESPITE_MISSING;
  }
  if (failCount === 0 && !hasAnyElective) return EligibilityStatus.FULL_DESPITE_MISSING;
  if (failCount === 1) return EligibilityStatus.MISSING_1;
  if (failCount === 2) return EligibilityStatus.MISSING_2;
  if (failCount === 3) return EligibilityStatus.MISSING_3;
  if (failCount >= 4) return EligibilityStatus.MISSING_4_PLUS;
  return EligibilityStatus.MISSING_4_PLUS;
}

// ─── Student Generation ────────────────────────────────────────────────────────

let studentCounter = 0;
const allStudents: Student[] = [];
const usedNames = new Set<string>();

function generateUniqueFullName(): { firstName: string; lastName: string } {
  let attempts = 0;
  while (attempts < 200) {
    const isMale = rng() < 0.5;
    const firstName = isMale ? pick(FIRST_NAMES_MALE) : pick(FIRST_NAMES_FEMALE);
    const lastName = pick(LAST_NAMES);
    const key = `${firstName}-${lastName}`;
    if (!usedNames.has(key)) {
      usedNames.add(key);
      return { firstName, lastName };
    }
    attempts++;
  }
  // Fallback: add counter to make unique
  const firstName = pick(FIRST_NAMES_MALE);
  const lastName = pick(LAST_NAMES);
  return { firstName: `${firstName}`, lastName: `${lastName} ${++studentCounter}` };
}

function generateStudentsForClass(schoolClass: SchoolClass): Student[] {
  const isSpecial = schoolClass.isSpecial;
  const students: Student[] = [];

  // Class-specific elective pool
  const electivePool = schoolClass.electiveSubjectIds;

  for (let i = 0; i < schoolClass.studentCount; i++) {
    studentCounter++;
    const { firstName, lastName } = generateUniqueFullName();

    // Determine unit levels
    let mathLevel: UnitLevel;
    let englishLevel: UnitLevel;
    if (isSpecial) {
      mathLevel = UnitLevel.UNITS_3;
      englishLevel = UnitLevel.UNITS_3;
    } else {
      const mr = rng();
      mathLevel = mr < 0.35 ? UnitLevel.UNITS_5 : mr < 0.70 ? UnitLevel.UNITS_4 : UnitLevel.UNITS_3;
      const er = rng();
      englishLevel = er < 0.40 ? UnitLevel.UNITS_5 : er < 0.75 ? UnitLevel.UNITS_4 : UnitLevel.UNITS_3;
    }

    // Generate core weighted grades
    const grades: Record<string, SubjectGrades> = {};

    // Math and English use multi-component scoring based on unit level
    grades['math'] = generateMathGrades(mathLevel, isSpecial);
    grades['english'] = generateEnglishGrades(englishLevel, isSpecial);

    // Other core subjects use standard internal/external weighting
    const otherCoreIds = ['history', 'civics', 'tanakh', 'literature', 'language'];
    for (const subId of otherCoreIds) {
      grades[subId] = generateSubjectGrades(subId, isSpecial);
    }

    // Generate core non-weighted (required for eligibility) grades
    const requiredNonWeightedIds = ['general-studies', 'intro-sciences', 'pe', 'community-service'];
    for (const subId of requiredNonWeightedIds) {
      grades[subId] = generateSubjectGrades(subId, isSpecial);
    }

    // Assign electives from class-specific pool
    if (isSpecial) {
      // Special class (class 12): Communications + 0-1 other elective
      // Class 12's pool is just ['communications'], so assign it
      for (const elId of electivePool) {
        grades[elId] = generateSubjectGrades(elId, isSpecial);
      }
    } else {
      // Regular student: 1-3 electives from their class's available pool
      const maxElectives = Math.min(electivePool.length, 3);
      const r = rng();
      const numElectives = maxElectives <= 1 ? 1 : (r < 0.4 ? 1 : r < 0.8 ? 2 : Math.min(3, maxElectives));
      const shuffled = [...electivePool].sort(() => rng() - 0.5);
      for (let e = 0; e < numElectives; e++) {
        grades[shuffled[e]] = generateSubjectGrades(shuffled[e], isSpecial);
      }
    }

    // Compute weighted average from core grades
    const weightedAverage = computeWeightedAverage(grades, mathLevel, englishLevel);

    // Determine risk and eligibility based on actual grades
    const riskLevel = determineRiskLevel(grades, weightedAverage);
    const eligibilityStatus = determineEligibility(grades);

    // Accommodations (more likely for special class)
    const accommodations: AccommodationType[] = [];
    if (isSpecial) {
      accommodations.push(AccommodationType.ADAPTED);
      if (rng() < 0.5) accommodations.push(AccommodationType.ORAL);
    } else if (rng() < 0.08) {
      accommodations.push(pick([
        AccommodationType.ADAPTED,
        AccommodationType.DICTATION,
        AccommodationType.ORAL,
        AccommodationType.SPECIAL,
      ]));
    }

    // Notes
    const notes: Note[] = [];
    if (riskLevel >= RiskLevel.LEVEL_3 && rng() < 0.7) {
      notes.push({
        id: `note-${studentCounter}-1`,
        text: pick([
          'דורש מעקב צמוד לקראת מועד ב',
          'נפגשתי עם ההורים, הוחלט על תגבור במתמטיקה',
          'התלמיד נעדר רבות, צריך לבדוק סיבה',
          'הועבר לשיעורי עזר באנגלית',
          'יש שיפור קל בציוני אזרחות, להמשיך מעקב',
          'ישיבת צוות הוחלטה לתאריך הבא',
        ]),
        author: schoolClass.homeroomTeacher,
        date: pickNoteDate(),
      });
    }

    students.push({
      id: `student-${studentCounter}`,
      studentNumber: studentCounter,
      firstName,
      lastName,
      classId: schoolClass.id,
      mathUnitLevel: mathLevel,
      englishUnitLevel: englishLevel,
      accommodations,
      riskLevel,
      eligibilityStatus,
      weightedAverage,
      grades,
      notes,
    });
  }

  return students;
}

// Generate all students
for (const cls of classes) {
  allStudents.push(...generateStudentsForClass(cls));
}

// ─── Challenging Students ──────────────────────────────────────────────────────
// Assign ~15 students as challenging across 3 categories

const challengingCandidates = allStudents
  .filter((s) => s.riskLevel >= RiskLevel.LEVEL_2)
  .sort(() => rng() - 0.5)
  .slice(0, 15);

const challengeStaff = ['שרית כהן', 'יעקב לוי', 'מירי אברהם', 'דוד מזרחי', 'רחל שלום'];

challengingCandidates.forEach((student, idx) => {
  let category: ChallengeCategory;
  if (idx < 5) {
    category = ChallengeCategory.ESPECIALLY_CHALLENGING;
  } else if (idx < 10) {
    category = ChallengeCategory.WILL_PROBABLY_PASS;
  } else {
    category = ChallengeCategory.CLOSE_FOLLOWUP;
  }
  student.challengeCategory = category;
  student.challengeAssignedTo = challengeStaff[idx % challengeStaff.length];

  // Add challenge-specific notes
  const challengeNotes: string[] = [];
  switch (category) {
    case ChallengeCategory.ESPECIALLY_CHALLENGING:
      challengeNotes.push(
        'תלמיד מאתגר במיוחד - נדרשת התערבות מערכתית',
        'מצב רגשי לא יציב, פנייה ליועצת',
      );
      break;
    case ChallengeCategory.WILL_PROBABLY_PASS:
      challengeNotes.push(
        'צפוי לעבור אם ישלים את עבודת הגמר באזרחות',
        'נדרש תגבור ממוקד במקצוע אחד',
      );
      break;
    case ChallengeCategory.CLOSE_FOLLOWUP:
      challengeNotes.push(
        'מעקב צמוד - יש פוטנציאל אבל חסר מוטיבציה',
        'בפגישה עם ההורים הוסכם על לו"ז יומי',
      );
      break;
  }

  for (const text of challengeNotes) {
    student.notes.push({
      id: `note-challenge-${student.id}-${student.notes.length}`,
      text,
      author: student.challengeAssignedTo,
      date: pickNoteDate(),
    });
  }
});

// Mark non-matriculation students across multiple classes (matching real data).
// Real spreadsheet has non-matric students in classes 1, 2, 4, 5, 6, 8, 10, 11, 13, 15.
const nonMatricDistribution: Record<string, number> = {
  'class-1': 1,
  'class-2': 2,
  'class-4': 1,
  'class-5': 2,
  'class-6': 1,
  'class-8': 1,
  'class-10': 1,
  'class-11': 1,
  'class-13': 2,
  'class-15': 1,
};
for (const [classId, count] of Object.entries(nonMatricDistribution)) {
  const classStudents = allStudents.filter((s) => s.classId === classId);
  for (let i = 0; i < Math.min(count, classStudents.length); i++) {
    classStudents[i].eligibilityStatus = EligibilityStatus.NON_MATRICULATION;
  }
}

// ─── Year Comparisons ──────────────────────────────────────────────────────────

const yearComparisons: YearComparison[] = [
  { year: 'תשפ"ב', eligibilityRate: 96.6, excellenceRate: 43.8, math5Rate: 41.6, english5Rate: 85.7 },
  { year: 'תשפ"ג', eligibilityRate: 96.8, excellenceRate: 37.0, math5Rate: 35.9, english5Rate: 85.7 },
  { year: 'תשפ"ד', eligibilityRate: 96.8, excellenceRate: 36.8, math5Rate: 37.0, english5Rate: 84.6 },
  { year: 'תשפ"ה', eligibilityRate: 92.4, excellenceRate: 34.6, math5Rate: 33.8, english5Rate: 82.3 },
];

// ─── Failure Count Determination ─────────────────────────────────────────────

function countFailures(grades: Record<string, SubjectGrades>): number {
  const coreIds = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];
  let failCount = 0;
  for (const id of coreIds) {
    if (grades[id] && grades[id].final < 55) failCount++;
  }
  // Also count failing electives
  const electiveIds = [
    'cs', 'physics', 'biology', 'chemistry', 'geography',
    'management', 'social-sciences', 'jewish-law', 'spanish',
    'arabic', 'french', 'film', 'medical-sciences', 'communications',
  ];
  for (const id of electiveIds) {
    if (grades[id] && grades[id].final < 55) failCount++;
  }
  return failCount;
}

function computeFailureStats(students: Student[]): FailureStats {
  const stats: FailureStats = {
    noFailures: 0,
    failures1: 0,
    failures2: 0,
    failures3: 0,
    failures4: 0,
    failures5Plus: 0,
    nonMatriculation: 0,
    total: students.length,
  };

  for (const s of students) {
    if (s.eligibilityStatus === EligibilityStatus.NON_MATRICULATION) {
      stats.nonMatriculation++;
      continue;
    }
    const fc = countFailures(s.grades);
    if (fc === 0) stats.noFailures++;
    else if (fc === 1) stats.failures1++;
    else if (fc === 2) stats.failures2++;
    else if (fc === 3) stats.failures3++;
    else if (fc === 4) stats.failures4++;
    else stats.failures5Plus++;
  }
  return stats;
}

// ─── Multi-Period Data Generation ────────────────────────────────────────────
// For each earlier period, we simulate worse eligibility by randomly degrading
// some students' statuses. Each period stores per-class RikuzRow arrays.

/** A separate seeded RNG so we don't disturb the main student data generation */
function createPeriodRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * Degrade eligibility for earlier periods.
 * degradeFactor: 0 = no degradation (current), higher = more students missing exams.
 */
function degradeEligibility(
  status: EligibilityStatus,
  prng: () => number,
  degradeFactor: number,
): EligibilityStatus {
  // Non-matriculation students stay the same
  if (status === EligibilityStatus.NON_MATRICULATION) return status;

  const r = prng();
  // Probability of degradation scales with factor
  if (r > degradeFactor) return status;

  // Degrade by 1-2 steps
  const step = prng() < 0.6 ? 1 : 2;
  const order: EligibilityStatus[] = [
    EligibilityStatus.FULL_BAGRUT,
    EligibilityStatus.FULL_DESPITE_MISSING,
    EligibilityStatus.MISSING_1,
    EligibilityStatus.MISSING_2,
    EligibilityStatus.MISSING_3,
    EligibilityStatus.MISSING_4_PLUS,
  ];
  const currentIdx = order.indexOf(status);
  if (currentIdx === -1) return status;
  const newIdx = Math.min(currentIdx + step, order.length - 1);
  return order[newIdx];
}

function degradeFailureCount(
  failCount: number,
  prng: () => number,
  degradeFactor: number,
): number {
  const r = prng();
  if (r > degradeFactor) return failCount;
  const step = prng() < 0.6 ? 1 : 2;
  return failCount + step;
}

interface PeriodConfig {
  id: string;
  degradeFactor: number;
}

const PERIOD_CONFIGS: PeriodConfig[] = [
  { id: 'summer-11', degradeFactor: 0.55 },   // worst - early stage
  { id: 'summer-12', degradeFactor: 0.35 },   // improving
  { id: 'winter-12', degradeFactor: 0.15 },   // better
  { id: 'corrections', degradeFactor: 0 },     // current (best) - no degradation
];

/** Cache of rikuz data per period */
const rikuzByPeriodCache: Record<string, RikuzRow[]> = {};

function buildRikuzForPeriod(periodId: string): RikuzRow[] {
  const config = PERIOD_CONFIGS.find((p) => p.id === periodId);
  if (!config) return getRikuzData();

  if (config.degradeFactor === 0) {
    // Current period - use actual data
    return getRikuzData();
  }

  const prng = createPeriodRng(
    periodId === 'summer-11' ? 1111 : periodId === 'summer-12' ? 2222 : 3333
  );

  return classes.map((cls) => {
    const classStudents = allStudents.filter((s) => s.classId === cls.id);

    const stats: EligibilityStats = {
      fullBagrut: 0,
      fullDespiteMissing: 0,
      partial: 0,
      missing1: 0,
      missing2: 0,
      missing3: 0,
      missing4Plus: 0,
      nonMatriculation: 0,
      total: classStudents.length,
    };

    const failureStatsObj: FailureStats = {
      noFailures: 0,
      failures1: 0,
      failures2: 0,
      failures3: 0,
      failures4: 0,
      failures5Plus: 0,
      nonMatriculation: 0,
      total: classStudents.length,
    };

    for (const s of classStudents) {
      // Degrade eligibility
      const degraded = degradeEligibility(s.eligibilityStatus, prng, config.degradeFactor);
      switch (degraded) {
        case EligibilityStatus.FULL_BAGRUT: stats.fullBagrut++; break;
        case EligibilityStatus.FULL_DESPITE_MISSING: stats.fullDespiteMissing++; break;
        case EligibilityStatus.PARTIAL: stats.partial++; break;
        case EligibilityStatus.MISSING_1: stats.missing1++; break;
        case EligibilityStatus.MISSING_2: stats.missing2++; break;
        case EligibilityStatus.MISSING_3: stats.missing3++; break;
        case EligibilityStatus.MISSING_4_PLUS: stats.missing4Plus++; break;
        case EligibilityStatus.NON_MATRICULATION: stats.nonMatriculation++; break;
      }

      // Degrade failure counts
      if (s.eligibilityStatus === EligibilityStatus.NON_MATRICULATION) {
        failureStatsObj.nonMatriculation++;
      } else {
        const baseFailures = countFailures(s.grades);
        const degradedFailures = degradeFailureCount(baseFailures, prng, config.degradeFactor);
        if (degradedFailures === 0) failureStatsObj.noFailures++;
        else if (degradedFailures === 1) failureStatsObj.failures1++;
        else if (degradedFailures === 2) failureStatsObj.failures2++;
        else if (degradedFailures === 3) failureStatsObj.failures3++;
        else if (degradedFailures === 4) failureStatsObj.failures4++;
        else failureStatsObj.failures5Plus++;
      }
    }

    return {
      classId: cls.id,
      className: cls.displayName,
      studentCount: cls.studentCount,
      isSpecialClass: cls.isSpecial,
      stats,
      failureStats: failureStatsObj,
    };
  });
}

/** KPI data cache per period */
const kpiByPeriodCache: Record<string, PeriodKPIData> = {};

function buildKPIForPeriod(periodId: string): PeriodKPIData {
  const rikuz = getRikuzByPeriod(periodId);
  let totalStudents = 0;
  let fullEligible = 0;

  for (const row of rikuz) {
    totalStudents += row.stats.total;
    fullEligible += row.stats.fullBagrut + row.stats.fullDespiteMissing;
  }

  const eligiblePct = totalStudents > 0 ? ((fullEligible / totalStudents) * 100).toFixed(1) : '0';

  // Compute at-risk and excellence from rikuz data
  // For degraded periods, we estimate at-risk from missing counts
  let atRisk = 0;
  let excellence = 0;

  if (periodId === 'corrections') {
    // Use actual student data
    atRisk = allStudents.filter((s) => s.riskLevel >= RiskLevel.LEVEL_2).length;
    excellence = allStudents.filter((s) => s.weightedAverage >= 90).length;
  } else {
    // Estimate from rikuz: students with missing exams or worse are at-risk
    for (const row of rikuz) {
      atRisk += row.stats.missing1 + row.stats.missing2 + row.stats.missing3 + row.stats.missing4Plus;
      // Excellence estimate: scale down from current based on period
      const config = PERIOD_CONFIGS.find((p) => p.id === periodId);
      const factor = config ? 1 - config.degradeFactor * 0.3 : 1;
      const classStudents = allStudents.filter((s) => s.classId === row.classId);
      excellence += Math.round(classStudents.filter((s) => s.weightedAverage >= 90).length * factor);
    }
    // Deduplicate excellence count (it's accumulated per-class, which is correct)
    // Actually we need to reset and recount
    excellence = 0;
    const config = PERIOD_CONFIGS.find((p) => p.id === periodId);
    const factor = config ? 1 - config.degradeFactor * 0.3 : 1;
    excellence = Math.round(allStudents.filter((s) => s.weightedAverage >= 90).length * factor);
  }

  const atRiskPct = totalStudents > 0 ? ((atRisk / totalStudents) * 100).toFixed(1) : '0';
  const excellencePct = totalStudents > 0 ? ((excellence / totalStudents) * 100).toFixed(1) : '0';

  return {
    totalStudents,
    fullEligible,
    eligiblePct,
    atRisk,
    atRiskPct,
    excellence,
    excellencePct,
  };
}

// ─── Export Functions ──────────────────────────────────────────────────────────

export function getAllStudents(): Student[] {
  return allStudents;
}

export function getClasses(): SchoolClass[] {
  return classes;
}

export function getSubjects(): Subject[] {
  return subjects;
}

export function getExamPeriods(): ExamPeriod[] {
  return examPeriods;
}

export function getChallengeStudents(): Student[] {
  return allStudents.filter((s) => s.challengeCategory !== undefined);
}

export function getYearComparisons(): YearComparison[] {
  return yearComparisons;
}

/**
 * Returns the rikuz (summary) data: eligibility breakdown per class.
 * This returns the current period (corrections) data.
 */
export function getRikuzData(): RikuzRow[] {
  return classes.map((cls) => {
    const classStudents = allStudents.filter((s) => s.classId === cls.id);
    const stats: EligibilityStats = {
      fullBagrut: 0,
      fullDespiteMissing: 0,
      partial: 0,
      missing1: 0,
      missing2: 0,
      missing3: 0,
      missing4Plus: 0,
      nonMatriculation: 0,
      total: classStudents.length,
    };

    for (const s of classStudents) {
      switch (s.eligibilityStatus) {
        case EligibilityStatus.FULL_BAGRUT:
          stats.fullBagrut++;
          break;
        case EligibilityStatus.FULL_DESPITE_MISSING:
          stats.fullDespiteMissing++;
          break;
        case EligibilityStatus.PARTIAL:
          stats.partial++;
          break;
        case EligibilityStatus.MISSING_1:
          stats.missing1++;
          break;
        case EligibilityStatus.MISSING_2:
          stats.missing2++;
          break;
        case EligibilityStatus.MISSING_3:
          stats.missing3++;
          break;
        case EligibilityStatus.MISSING_4_PLUS:
          stats.missing4Plus++;
          break;
        case EligibilityStatus.NON_MATRICULATION:
          stats.nonMatriculation++;
          break;
      }
    }

    return {
      classId: cls.id,
      className: cls.displayName,
      studentCount: cls.studentCount,
      isSpecialClass: cls.isSpecial,
      stats,
      failureStats: computeFailureStats(classStudents),
    };
  });
}

/**
 * Returns rikuz data for a specific exam period.
 * Uses cached data to avoid regenerating on every call.
 */
export function getRikuzByPeriod(periodId: string): RikuzRow[] {
  if (!rikuzByPeriodCache[periodId]) {
    rikuzByPeriodCache[periodId] = buildRikuzForPeriod(periodId);
  }
  return rikuzByPeriodCache[periodId];
}

/**
 * Returns KPI summary data for a specific exam period.
 */
export function getKPIByPeriod(periodId: string): PeriodKPIData {
  if (!kpiByPeriodCache[periodId]) {
    kpiByPeriodCache[periodId] = buildKPIForPeriod(periodId);
  }
  return kpiByPeriodCache[periodId];
}
