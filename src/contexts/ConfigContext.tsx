import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ExcellenceTiersConfig {
  aleph: number;
  bet: number;
  borderBet: number;
  gimel: number;
  borderGimel: number;
}

export interface ScoreColorsConfig {
  failingBelow: number;
  borderlineLow: number;
  borderlineHigh: number;
  excellenceAbove: number;
}

export interface RiskRulesConfig {
  highRiskFailures: number;
  riskFailures: number;
  escalationAvgBelow: number;
}

export interface WeightedAvgSubject {
  subjectId: string;
  label: string;
  units: number;
  included: boolean;
}

export interface EligibilityRulesConfig {
  mandatorySubjects: string[];
  requireElective: boolean;
  fullDespiteMissing: boolean;
}

export interface WhatIfDefaultsConfig {
  offset: number;
  showProjectedExcellence: boolean;
}

export interface ClassExclusionConfig {
  excludeFromQuality: boolean;
  excludeFromRanking: boolean;
}

export interface ExamPeriodConfig {
  id: string;
  name: string;
  shortName: string;
}

export interface ChallengeCategoryConfig {
  id: string;
  label: string;
  color: string;
}

export interface ConfigState {
  passingThreshold: number;
  excellenceTiers: ExcellenceTiersConfig;
  scoreColors: ScoreColorsConfig;
  riskRules: RiskRulesConfig;
  weightedAvgSubjects: WeightedAvgSubject[];
  variableDenominator: boolean;
  eligibilityRules: EligibilityRulesConfig;
  whatIfDefaults: WhatIfDefaultsConfig;
  classExclusions: Record<string, ClassExclusionConfig>;
  examPeriods: ExamPeriodConfig[];
  challengeCategories: ChallengeCategoryConfig[];
  statsDenominator: 'quality' | 'all';
}

// ─── Defaults ───────────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: ConfigState = {
  passingThreshold: 55,

  excellenceTiers: {
    aleph: 96,
    bet: 90,
    borderBet: 86,
    gimel: 85,
    borderGimel: 81,
  },

  scoreColors: {
    failingBelow: 52,
    borderlineLow: 52,
    borderlineHigh: 53,
    excellenceAbove: 90,
  },

  riskRules: {
    highRiskFailures: 2,
    riskFailures: 1,
    escalationAvgBelow: 65,
  },

  weightedAvgSubjects: [
    { subjectId: 'math', label: 'מתמטיקה', units: 3, included: true },
    { subjectId: 'history', label: 'היסטוריה', units: 2, included: true },
    { subjectId: 'civics', label: 'אזרחות', units: 2, included: true },
    { subjectId: 'tanakh', label: 'תנ"ך', units: 2, included: true },
    { subjectId: 'literature', label: 'ספרות', units: 2, included: true },
    { subjectId: 'language', label: 'לשון', units: 2, included: true },
    { subjectId: 'english', label: 'אנגלית', units: 3, included: true },
  ],

  variableDenominator: true,

  eligibilityRules: {
    mandatorySubjects: [
      'math', 'history', 'civics', 'tanakh', 'literature', 'language', 'english',
      'general-studies', 'intro-sciences', 'pe', 'community-service',
    ],
    requireElective: true,
    fullDespiteMissing: true,
  },

  whatIfDefaults: {
    offset: -5,
    showProjectedExcellence: true,
  },

  classExclusions: {
    'class-12': { excludeFromQuality: true, excludeFromRanking: true },
  },

  examPeriods: [
    { id: 'summer-11', name: 'אחרי קיץ יא', shortName: 'קיץ יא' },
    { id: 'summer-12', name: 'אחרי קיץ יב', shortName: 'קיץ יב' },
    { id: 'winter-12', name: 'אחרי חורף יב', shortName: 'חורף יב' },
    { id: 'corrections', name: 'אחרי חורף+תיקונים', shortName: 'תיקונים' },
  ],

  challengeCategories: [
    { id: 'especially_challenging', label: 'מאתגרים במיוחד', color: '#D99594' },
    { id: 'will_probably_pass', label: 'צפויים לעבור', color: '#FFC000' },
    { id: 'close_followup', label: 'מעקב צמוד', color: '#8DB3E2' },
  ],

  statsDenominator: 'quality',
};

// ─── Context ────────────────────────────────────────────────────────────────────

interface ConfigContextValue {
  config: ConfigState;
  updateConfig: (patch: Partial<ConfigState>) => void;
  resetToDefaults: () => void;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

const STORAGE_KEY = 'bagrut-demo-config';

function loadFromStorage(): ConfigState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConfigState>;
      // Merge with defaults so new keys added in future are picked up
      const merged = { ...DEFAULT_CONFIG, ...parsed };

      // Deep-merge array items so new fields (e.g. shortName, included)
      // added in later versions are filled from defaults
      if (parsed.examPeriods) {
        merged.examPeriods = parsed.examPeriods.map((p) => {
          const defaultPeriod = DEFAULT_CONFIG.examPeriods.find(
            (d) => d.id === p.id
          );
          return defaultPeriod ? { ...defaultPeriod, ...p } : p;
        });
      }

      if (parsed.weightedAvgSubjects) {
        merged.weightedAvgSubjects = parsed.weightedAvgSubjects.map((s) => {
          const defaultSubject = DEFAULT_CONFIG.weightedAvgSubjects.find(
            (d) => d.subjectId === s.subjectId
          );
          return defaultSubject ? { ...defaultSubject, ...s } : s;
        });
      }

      return merged;
    }
  } catch {
    // Corrupted storage -- fall back to defaults
  }
  return DEFAULT_CONFIG;
}

function saveToStorage(config: ConfigState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage full or unavailable -- silently ignore
  }
}

// ─── Provider ───────────────────────────────────────────────────────────────────

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<ConfigState>(loadFromStorage);

  // Persist whenever config changes
  useEffect(() => {
    saveToStorage(config);
  }, [config]);

  const updateConfig = useCallback((patch: Partial<ConfigState>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetToDefaults }}>
      {children}
    </ConfigContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return ctx;
}
