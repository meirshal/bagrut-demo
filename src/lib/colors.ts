// Bagrut Tracking System - Color Design Tokens
// Mapped from 15 background colors + 4 font colors from the Excel specification

import { RiskLevel, ExcellenceTier } from '@/types';

// ─── Background Color Tokens ───────────────────────────────────────────────────

export const BG_COLORS = {
  /** FFC2D69B - Light green: On track / passing / eligible */
  statusPassing: '#C2D69B',
  /** FFFFFF00 - Yellow: At risk / needs attention */
  statusAtRisk: '#FFFF00',
  /** FFD99594 - Pink/salmon: High risk / many failures */
  statusHighRisk: '#D99594',
  /** FFFF0000 - Bright red: Non-matriculation student */
  statusNonMatric: '#FF0000',
  /** FF92D050 - Bright green: Internal exam marker */
  componentInternal: '#92D050',
  /** FFEF31CF - Magenta/hot pink: External exam marker */
  componentExternal: '#EF31CF',
  /** FF00B0F0 - Cyan: Score at threshold (54) */
  scoreThreshold54: '#00B0F0',
  /** FF8DB3E2 - Light blue: Score borderline (52-53) */
  scoreThreshold52: '#8DB3E2',
  /** FFFFC000 - Amber/gold: Risk level 3 background */
  riskLevel3: '#FFC000',
  /** FFFBD4B4 - Peach/light salmon: Risk level 5 background */
  riskLevel5: '#FBD4B4',
  /** FF548DD4 - Medium blue: Exam period header 1 */
  periodHeader1: '#548DD4',
  /** FFB2A1C7 - Purple/lavender: Exam period header 2 */
  periodHeader2: '#B2A1C7',
  /** FFC4BD97 - Tan/khaki: Exam period header 3 */
  periodHeader3: '#C4BD97',
  /** FFC6D9F0 - Pale blue/ice: Exam period header 4 */
  periodHeader4: '#C6D9F0',
  /** FFF2DBDB - Very light pink/blush: Below-average weighted avg cells */
  scoreBelowAverage: '#F2DBDB',
} as const;

// ─── Font Color Tokens ─────────────────────────────────────────────────────────

export const TEXT_COLORS = {
  /** FFFF0000 - Red: Failing grade (below 55) */
  failing: '#FF0000',
  /** FF548DD4 - Blue: Excellence (above 90) */
  excellence: '#548DD4',
  /** FF92D050 - Green: Class average values */
  average: '#92D050',
  /** FFE36C09 - Orange: Risk level 2 text / cumulative % */
  risk2: '#E36C09',
  /** FF993366 - Dark magenta: Contact info / meta text */
  meta: '#993366',
} as const;

// ─── Score Color Tokens ────────────────────────────────────────────────────────

export const SCORE_COLORS = {
  /** Failing score (below 55) - red font */
  failing: '#FF0000',
  /** Excellence score (90+) - blue font */
  excellence: '#548DD4',
  /** Borderline 52-53 - light blue background */
  borderline52: '#8DB3E2',
  /** Borderline 54 - cyan background */
  borderline54: '#00B0F0',
} as const;

// ─── Risk Level Colors ─────────────────────────────────────────────────────────

export const RISK_COLORS: Record<
  RiskLevel,
  { bg: string; text: string; border?: string }
> = {
  [RiskLevel.LEVEL_1]: { bg: '#C2D69B', text: '#000000' },
  [RiskLevel.LEVEL_2]: { bg: 'transparent', text: '#E36C09' },
  [RiskLevel.LEVEL_3]: { bg: '#FFC000', text: '#000000' },
};

// ─── Excellence Tier Colors ───────────────────────────────────────────────────

export const EXCELLENCE_COLORS: Record<
  ExcellenceTier,
  { bg: string; text: string; border?: string }
> = {
  [ExcellenceTier.NONE]: { bg: 'transparent', text: '#94a3b8' },
  [ExcellenceTier.BORDER_GIMEL]: { bg: '#ede9fe', text: '#7c3aed', border: '1px dashed #7c3aed' },
  [ExcellenceTier.GIMEL]: { bg: '#ddd6fe', text: '#6d28d9' },
  [ExcellenceTier.BORDER_BET]: { bg: '#c7d2fe', text: '#4338ca', border: '1px dashed #4338ca' },
  [ExcellenceTier.BET]: { bg: '#a5b4fc', text: '#3730a3' },
  [ExcellenceTier.ALEPH]: { bg: '#fbbf24', text: '#78350f' },
};

// ─── Period Header Colors ──────────────────────────────────────────────────────

export const PERIOD_COLORS = [
  BG_COLORS.periodHeader1,
  BG_COLORS.periodHeader2,
  BG_COLORS.periodHeader3,
  BG_COLORS.periodHeader4,
] as const;

// ─── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Returns inline style object for a score cell based on its value.
 * Applies background color for borderline scores and font color for
 * failing/excellence scores.
 */
export function getScoreCellStyle(score: number): {
  backgroundColor?: string;
  color?: string;
} {
  const style: { backgroundColor?: string; color?: string } = {};

  // Background colors for borderline scores
  if (score === 54) {
    style.backgroundColor = SCORE_COLORS.borderline54;
    style.color = SCORE_COLORS.failing;
  } else if (score >= 52 && score <= 53) {
    style.backgroundColor = SCORE_COLORS.borderline52;
    style.color = SCORE_COLORS.failing;
  } else if (score < 52 && score > 0) {
    // Failing - red font only
    style.color = SCORE_COLORS.failing;
  } else if (score >= 90) {
    // Excellence - blue font
    style.color = SCORE_COLORS.excellence;
  }

  return style;
}

/**
 * Returns inline style object for a risk level badge.
 */
export function getRiskBadgeStyle(level: RiskLevel): {
  backgroundColor: string;
  color: string;
  border?: string;
} {
  const colors = RISK_COLORS[level];
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    ...(colors.border ? { border: colors.border } : {}),
  };
}

/**
 * Returns inline style object for an excellence tier badge.
 */
export function getExcellenceBadgeStyle(tier: ExcellenceTier): {
  backgroundColor: string;
  color: string;
  border?: string;
} {
  const colors = EXCELLENCE_COLORS[tier];
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    ...(colors.border ? { border: colors.border } : {}),
  };
}

/**
 * Returns the background color for a weighted average cell.
 * Below-average cells get a light pink background.
 */
export function getWeightedAverageCellStyle(
  value: number,
  classAverage: number
): { backgroundColor?: string } {
  if (value < classAverage) {
    return { backgroundColor: BG_COLORS.scoreBelowAverage };
  }
  return {};
}

/**
 * Returns the CSS color string for the period header at the given index.
 */
export function getPeriodHeaderColor(periodIndex: number): string {
  return PERIOD_COLORS[periodIndex % PERIOD_COLORS.length];
}
