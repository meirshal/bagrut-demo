// Hook: useRiskEvaluation
// Builds a RiskRuleSet from config and applies it to all students on change.

import { useState, useEffect } from 'react';
import { useConfig } from '@/contexts/ConfigContext';
import { getAllStudents } from '@/data/mock-data';
import { manualConfigToRuleSet, applyRiskRules } from '@/lib/risk-engine';

interface RiskEvaluationResult {
  riskVersion: number;
}

/**
 * Reads config.riskRules and applies risk rules to all students.
 * Returns a `riskVersion` counter that increments on each re-evaluation,
 * allowing consumers to trigger re-renders when risk levels change.
 */
export function useRiskEvaluation(): RiskEvaluationResult {
  const { config } = useConfig();
  const [riskVersion, setRiskVersion] = useState(0);

  useEffect(() => {
    const { riskRules } = config;

    // Determine which RiskRuleSet to use based on mode
    const ruleSet =
      riskRules.mode === 'natural' && riskRules.generatedRuleSet
        ? riskRules.generatedRuleSet
        : manualConfigToRuleSet(riskRules);

    // Apply to all students (mutates student.riskLevel in place)
    applyRiskRules(getAllStudents(), ruleSet);

    // Increment version so consumers know to re-render
    setRiskVersion((v) => v + 1);
  }, [config.riskRules]);

  return { riskVersion };
}
