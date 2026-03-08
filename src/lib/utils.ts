import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Student, SubjectGrades, EligibilityStats } from '@/types';
import { RiskLevel, UnitLevel, EligibilityStatus } from '@/types';
import { getAllStudents } from '@/data/mock-data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns all students belonging to a given class.
 */
export function getStudentsByClass(classId: string): Student[] {
  return getAllStudents().filter((s) => s.classId === classId);
}

/**
 * Returns all students with the given risk level.
 */
export function getStudentsByRiskLevel(level: RiskLevel): Student[] {
  return getAllStudents().filter((s) => s.riskLevel === level);
}

/**
 * Computes eligibility statistics for a list of students.
 */
export function getEligibilityStats(students: Student[]): EligibilityStats {
  const stats: EligibilityStats = {
    fullBagrut: 0,
    fullDespiteMissing: 0,
    partial: 0,
    missing1: 0,
    missing2: 0,
    missing3: 0,
    missing4Plus: 0,
    nonMatriculation: 0,
    total: students.length,
  };

  for (const s of students) {
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

  return stats;
}

/**
 * Calculates the weighted average from a student's core grades
 * using the formula:
 *   WeightedAverage = (MathFinal * MathUnits + HistoryFinal * 2 +
 *     CivicsFinal * 2 + TanakhFinal * 2 + LiteratureFinal * 2 +
 *     LanguageFinal * 2 + EnglishFinal * EnglishUnits) / TotalUnits
 */
export function calculateWeightedAverage(
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

/**
 * Formats a number as a percentage string (e.g., 78.5 -> "78.5%").
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
