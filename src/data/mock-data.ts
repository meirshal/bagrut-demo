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
  { id: 'math', name: 'מתמטיקה', questionnaireCode: '382', isCore: true, weights: { internal: 0, external: 1 } },
  { id: 'history', name: 'היסטוריה', questionnaireCode: '16381', isCore: true, weights: { internal: 0.3, external: 0.7 } },
  { id: 'civics', name: 'אזרחות', questionnaireCode: '34381', isCore: true, weights: { internal: 0.2, external: 0.8 } },
  { id: 'tanakh', name: 'תנ"ך', questionnaireCode: '899373', isCore: true, weights: { internal: 0.3, external: 0.7 } },
  { id: 'literature', name: 'ספרות', questionnaireCode: '44382', isCore: true, weights: { internal: 0.3, external: 0.7 } },
  { id: 'language', name: 'לשון', questionnaireCode: '55381', isCore: true, weights: { internal: 0.3, external: 0.7 } },
  { id: 'english', name: 'אנגלית', questionnaireCode: '16382', isCore: true, weights: { internal: 0, external: 1 } },
  { id: 'cs', name: 'מדעי המחשב', questionnaireCode: '883589', isCore: false, weights: { internal: 0.3, external: 0.7 } },
  { id: 'physics', name: 'פיזיקה', questionnaireCode: 'PH371', isCore: false, weights: { internal: 0.3, external: 0.7 } },
  { id: 'biology', name: 'ביולוגיה', questionnaireCode: 'BI381', isCore: false, weights: { internal: 0.3, external: 0.7 } },
  { id: 'chemistry', name: 'כימיה', questionnaireCode: 'CH381', isCore: false, weights: { internal: 0.3, external: 0.7 } },
  { id: 'geography', name: 'גיאוגרפיה', questionnaireCode: '57238', isCore: false, weights: { internal: 0.4, external: 0.6 } },
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

const classes: SchoolClass[] = Array.from({ length: 16 }, (_, i) => {
  const num = i + 1;
  return {
    id: `class-${num}`,
    number: num,
    displayName: `יב ${num}`,
    homeroomTeacher: TEACHER_NAMES[i],
    studentCount: CLASS_SIZES[num],
    isSpecial: num === 12,
  };
});

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

function generateSubjectGrades(
  subjectId: string,
  isSpecialClass: boolean
): SubjectGrades {
  const sub = subjects.find((s) => s.id === subjectId);
  if (!sub) return { final: 0 };

  // Math and English have special formulas -- generate a final directly
  if (subjectId === 'math' || subjectId === 'english') {
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
  // L4: borderline for Aleph/Bet honors tier (~3%)
  if (weightedAvg >= 86 && weightedAvg <= 89) return RiskLevel.LEVEL_4;
  // L5: borderline for Gimel honors tier (~2%)
  if (weightedAvg >= 81 && weightedAvg <= 84) return RiskLevel.LEVEL_5;
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
  const electiveIds = ['cs', 'physics', 'biology', 'chemistry', 'geography'];
  const hasElective = electiveIds.some(
    (id) => grades[id] && grades[id].final >= 55
  );

  if (failCount === 0 && hasElective) return EligibilityStatus.FULL_BAGRUT;
  if (failCount === 0 && !hasElective) return EligibilityStatus.FULL_DESPITE_MISSING;
  if (failCount === 1) return EligibilityStatus.MISSING_1;
  if (failCount === 2) return EligibilityStatus.MISSING_2;
  if (failCount === 3) return EligibilityStatus.MISSING_3;
  if (failCount >= 4) return EligibilityStatus.MISSING_4_PLUS;
  return EligibilityStatus.PARTIAL;
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

  // Elective subjects available (each student gets 1-2 electives)
  const electivePool = ['cs', 'physics', 'biology', 'chemistry', 'geography'];

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

    // Generate core grades
    const grades: Record<string, SubjectGrades> = {};
    const coreIds = ['math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english'];
    for (const subId of coreIds) {
      grades[subId] = generateSubjectGrades(subId, isSpecial);
    }

    // Assign 1-2 electives
    const numElectives = isSpecial ? 1 : (rng() < 0.6 ? 1 : 2);
    const shuffled = [...electivePool].sort(() => rng() - 0.5);
    for (let e = 0; e < numElectives; e++) {
      grades[shuffled[e]] = generateSubjectGrades(shuffled[e], isSpecial);
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
        date: '2025-12-15',
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
      date: '2025-11-20',
    });
  }
});

// Mark a few special-class students as non-matriculation
const specialClassStudents = allStudents.filter(
  (s) => s.classId === 'class-12'
);
for (let i = 0; i < Math.min(3, specialClassStudents.length); i++) {
  specialClassStudents[i].eligibilityStatus =
    EligibilityStatus.NON_MATRICULATION;
}

// ─── Year Comparisons ──────────────────────────────────────────────────────────

const yearComparisons: YearComparison[] = [
  { year: 'תשפ"ב', eligibilityRate: 78.5, excellenceRate: 22.1, math5Rate: 38.2, english5Rate: 42.5 },
  { year: 'תשפ"ג', eligibilityRate: 76.2, excellenceRate: 20.8, math5Rate: 36.7, english5Rate: 40.1 },
  { year: 'תשפ"ד', eligibilityRate: 74.8, excellenceRate: 19.5, math5Rate: 35.1, english5Rate: 38.9 },
  { year: 'תשפ"ה', eligibilityRate: 73.1, excellenceRate: 18.2, math5Rate: 33.8, english5Rate: 37.2 },
];

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
      stats,
    };
  });
}
