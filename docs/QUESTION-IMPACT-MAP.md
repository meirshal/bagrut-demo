# Question Impact Map — Dual Analysis (Spec + Code)

Comprehensive dual-impact mapping of 62 open questions and 14 assumptions to their spec sections and code files for the Bagrut (matriculation exam) tracking system.

**Generated:** 2026-03-09
**Source:** Analysis of 4 task outputs covering spec structure, critical questions (Q1-Q15), data model questions (Q16-Q38), operational + assumptions (Q39-Q62, A1-A14).

---

## Table of Contents

- [Summary](#summary)
- [Spec Section Heatmap](#spec-section-heatmap)
- [Cluster: Student Count & Demographics (Q1-Q3)](#cluster-student-count--demographics-q1-q3)
- [Cluster: Excellence Tiers (Q4-Q6)](#cluster-excellence-tiers-q4-q6)
- [Cluster: Risk Level Assignment (Q7-Q9)](#cluster-risk-level-assignment-q7-q9)
- [Cluster: Eligibility Rules (Q10-Q15)](#cluster-eligibility-rules-q10-q15)
- [Cluster: Class 12 Handling (Q16-Q19)](#cluster-class-12-handling-q16-q19)
- [Cluster: Weighted Average Formula (Q20-Q22)](#cluster-weighted-average-formula-q20-q22)
- [Cluster: Data Sources (Q23-Q25)](#cluster-data-sources-q23-q25)
- [Cluster: Accommodations (Q26-Q27)](#cluster-accommodations-q26-q27)
- [Cluster: Gamification/What-If (Q28-Q31)](#cluster-gamificationwhat-if-q28-q31)
- [Cluster: Mugbarim/Enhanced (Q32-Q33)](#cluster-mugbarimenhanced-q32-q33)
- [Cluster: Special Score Values (Q34-Q38)](#cluster-special-score-values-q34-q38)
- [Cluster: Abbreviations (Q39-Q43)](#cluster-abbreviations-q39-q43)
- [Cluster: Corrections Process (Q44-Q46)](#cluster-corrections-process-q44-q46)
- [Cluster: Columns B-C (Q47-Q48)](#cluster-columns-b-c-q47-q48)
- [Cluster: Student Transfers (Q49-Q51)](#cluster-student-transfers-q49-q51)
- [Cluster: Community Service & PE (Q52-Q53)](#cluster-community-service--pe-q52-q53)
- [Cluster: Arabic Columns (Q54)](#cluster-arabic-columns-q54)
- [Cluster: Future/Architecture (Q55-Q62)](#cluster-futurearchitecture-q55-q62)
- [Assumptions (A1-A14)](#assumptions-a1-a14)

---

## Summary

### Spec sections with highest question exposure

| Rank | Spec Section | Questions Touching It | Count |
|------|-------------|----------------------|-------|
| 1 | §4.2 (Data Model — Entities) | Q1, Q2, Q16, Q26, Q39, Q40, Q42, Q47, Q49, Q50, Q51 | 11 |
| 2 | §3.2.5 (Non-Matric / Exclusion Rules) | Q13, Q14, Q15, Q49, Q50, Q51, A8 | 7 |
| 3 | §3.2 (Student Overview) | Q1, Q2, Q3, Q16, Q49, A8 | 6 |
| 4 | §3.3.3 (Hashvaa / Comparison) | Q3, Q43, Q59, Q60, A10, A14 | 6 |
| 5 | §3.2.3 (Excellence & Risk) | Q4, Q5, Q6, Q7, Q8, Q9 | 6 |

### Questions with highest combined (spec+code) impact

1. **Q43** — ch"m broader than Class 12: up to 4 spec sections + 4 code files (high effort)
2. **Q16** — Class 12 type (special ed vs integration vs alternative): up to 3 spec + 5 code files (high effort)
3. **Q39** — shiluv 07 classification: up to 3 spec + 4 code files (high effort)
4. **Q8** — Risk decision matrix: up to 2 spec + 2 code files (high effort if granular)
5. **Q58** — Alert/notification engine: up to 5 spec sections + multi-file (high effort)

### Questions that are purely config changes (settings page)

- **Q4** — Excellence tier thresholds (ConfigContext.tsx defaults)
- **Q7** — Risk assignment mode toggle
- **Q9** — Risk update frequency
- **Q12** — Elective requirement toggle
- **Q15** — Full-despite-missing in headline rate toggle
- **Q45** — Correction limit setting
- **Q46** — Score retention rule

### Questions that require new spec sections

- **Q19** — Needs §X.4 (new section for Moed Bet handling)
- **Q55** — Needs §1.2, §2.1, §2.2 updates (scope & audience)
- **Q58** — Needs §3.4.2, §3.4.5, §5.7.11 (alert engine)

### Questions that only affect mock data

- **Q34-Q38** — Special score values (only §3.1.5 + mock-data.ts)
- **Q52** — Community service values (mock-data.ts scoring scale)
- **Q53** — PE grading (no change if confirmed)

### Questions already handled by ConfigContext.tsx

Q2 (statsDenominator), Q4 (excellenceTiers), Q5 (requireNoFailures), Q7 (riskAssignmentMode), Q8 (RiskRulesConfig), Q10 (minTotalUnits), Q11 (mandatorySubjects), Q12 (requireElective), Q15 (includeFullDespiteMissingInRate), Q45 (correctionLimit).

---

## Spec Section Heatmap

Spec sections sorted by number of questions/assumptions touching them:

| Spec Section | Description | Count | Questions |
|-------------|-------------|-------|-----------|
| §4.2 | Data Model — Entities | 11 | Q1, Q2, Q16, Q26, Q39, Q40, Q42, Q47, Q49, Q50, Q51 |
| §3.2.5 | Non-Matric / Exclusion Rules | 7 | Q13, Q14, Q15, Q49, Q50, Q51, A8 |
| §3.2 | Student Overview | 6 | Q1, Q2, Q3, Q16, Q49, A8 |
| §3.3.3 | Hashvaa / Comparison Sheet | 6 | Q3, Q43, Q59, Q60, A10, A14 |
| §3.2.3 | Excellence & Risk Tiers | 6 | Q4, Q5, Q6, Q7, Q8, Q9 |
| §5.2 | Eligibility Rules | 6 | Q10, Q11, Q12, Q13, Q14, Q15 |
| §5.7.6 | Eligibility Config Params | 6 | Q10, Q11, Q12, Q13, Q14, Q15 |
| §3.2.1 | Eligibility Statuses | 5 | Q10, Q11, Q12, Q13, Q15 |
| §3.1.4 | Weighted Average | 5 | Q20, Q21, Q22, A9, A11 |
| §3.1 | Subject & Score Model | 5 | Q23, Q24, A1, A9, A11 |
| §3.1.2 | Subject Definitions | 5 | Q25, Q32, Q33, A3, A13 |
| §5.1 | Score Formulas | 5 | Q25, A3, A9, A11, A13 |
| §3.1.5 | Special Score Values | 5 | Q34, Q35, Q36, Q37, Q38 |
| §3.3.1 | Rikuz / Summary Sheet | 4 | Q1, Q2, Q3, A8 |
| §3.4 | Risk / Challenging Students | 4 | Q7, Q8, Q9, Q58 |
| §9.2 | Import / Parsing | 4 | Q16, Q17, A1, A10 |
| §5.1.6 | Weighted Avg Formula | 4 | Q20, Q21, Q22, A9 |
| §5.1.5 | Mugbarim Formula | 4 | Q32, Q33, A3, A13 |
| §5.7.12 | Stats Denominator | 3 | Q1, Q2, Q3 |
| §5.7.9 | Class Exclusion Config | 3 | Q3, Q16, Q18 |
| §3.3.5 | Excellence Display | 3 | Q4, Q5, Q6 |
| §5.7.2 | Excellence Config | 3 | Q4, Q5, Q6 |
| §6.4 | Export/Reports | 3 | Q4, Q6, A5 |
| §5.4 | Auto Risk Rules | 3 | Q7, Q8, Q9 |
| §5.7.5 | WA Config | 3 | Q20, Q31, A9 |
| §5.7.3 | Subject Config | 3 | Q25, Q33, A3 |
| §3.5.1 | What-If Projections | 3 | Q28, Q29, Q30 |
| §7.2.6 | What-If UI | 3 | Q28, Q29, Q30 |
| §5.6 | Corrections | 3 | Q44, Q45, Q46 |
| §3.1.3 | Column B-C (Units) | 3 | Q47, Q48, A12 |

*(Sections with count <= 2 omitted for readability)*

---

## Cluster: Student Count & Demographics (Q1-Q3)

### Q1 — Why is comparison sheet total (503) different from rikuz total (509)?

**Current assumption:** The 6-student discrepancy is due to non-matriculation students being excluded from the quality comparison. The system will use configurable exclusion rules.

**Possible answers:**

**Answer A: The 6 missing students are non-matriculation (lo begrutim) students excluded from quality metrics**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Confirm non-matric exclusion wording; no change needed | src/data/mock-data.ts | Verify nonMatricDistribution sums to 6 (currently sums to 13); adjust | low |
| §5.7.12 | Confirm denominator = 509 - 6 = 503; document explicitly | src/lib/utils.ts | No change; getEligibilityStats already excludes NON_MATRICULATION | |

**Answer B: The 6 are mid-year departures (abroad, Project Hila, etc.)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Add WITHDRAWN to comparison exclusion rule | src/types/index.ts | Add WITHDRAWN to EligibilityStatus or new StudentStatus type | medium |
| §4.2 | Add Student.status=WITHDRAWN to denominator exclusion | src/data/mock-data.ts | Add ~6 withdrawn students; update eligibility stats | |
| §5.7.12 | Denominator = total - special class - withdrawn | src/lib/utils.ts | Update getEligibilityStats to exclude withdrawn | |
| | | src/contexts/ConfigContext.tsx | Add withdrawnExcluded boolean | |

**Answer C: Mix of non-matric + withdrawn**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Document combined exclusion: non-matric AND withdrawn | src/types/index.ts | Ensure both statuses exist | medium |
| §5.7.12 | List all exclusion categories | src/data/mock-data.ts | Correct mix totaling 6 | |
| | | src/lib/utils.ts | Exclude both categories from denominator | |

---

### Q2 — Which denominator is 'official' for school-wide eligibility rates?

**Current assumption:** 503 is 'quality Bagrut' denominator (excluding Ch"M/special ed). 509 is full enrollment. System supports both.

**Possible answers:**

**Answer A: 503 (quality denominator) is official Ministry number**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.1 | Confirm 503 as primary | src/contexts/ConfigContext.tsx | No change; default already 'quality' | trivial |
| §5.7.12 | Mark 'quality' as Ministry-official | src/data/mock-data.ts | No change | |

**Answer B: 509 (full enrollment) is official**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.1 | Change primary total to 509 | src/contexts/ConfigContext.tsx | Change statsDenominator default to 'all' | low |
| §5.7.12 | Change default denominator to 'all' | src/data/mock-data.ts | Update yearComparisons rates | |

**Answer C: Both used — different Ministry forms**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.1 | Dual-denominator display with labels | src/contexts/ConfigContext.tsx | No change; already supports toggle | trivial |
| §5.7.12 | Document both as official with different purposes | src/data/mock-data.ts | No change | |

---

### Q3 — What does Ch"M stand for? Is it Chinuch Meyuchad = Class 12?

**Current assumption:** Chinuch Meyuchad (special education), referring to Class 12.

**Possible answers:**

**Answer A: Yes, Ch"M = Chinuch Meyuchad = Class 12**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | No change | — | — | trivial |

**Answer B: Ch"M means something else, may not be Class 12**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Rewrite special education references | src/types/index.ts | Add isChM boolean to Student | high |
| §4.2 | Add Ch"M as student-level flag | src/data/mock-data.ts | Assign Ch"M flag to individual students | |
| §5.7.9 | Change from class-based to student-flag-based exclusion | src/contexts/ConfigContext.tsx | Change classExclusions to student-flag | |

---

## Cluster: Excellence Tiers (Q4-Q6)

### Q4 — Exact score thresholds for excellence tiers?

**Current assumption:** Aleph >= 96, Bet >= 90, Gimel >= 85. Configurable.

**Possible answers:**

**Answer A: Matches assumption (96/90/85)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q4 | Mark as RESOLVED | — | — | trivial |

**Answer B: Different thresholds**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.3 | Update tier table | src/data/mock-data.ts | Update determineExcellenceTier thresholds | low |
| §5.7.2 | Update defaults | src/contexts/ConfigContext.tsx | Update DEFAULT_CONFIG.excellenceTiers | |

---

### Q5 — Is excellence based solely on weighted average?

**Current assumption:** Yes, solely on weighted average.

**Possible answers:**

**Answer A: Yes, solely weighted average**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q5 | Mark as RESOLVED | — | — | trivial |

**Answer B: Weighted average PLUS minimum unit levels**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.3 | Add unit-level requirements per tier | src/data/mock-data.ts | Update determineExcellenceTier to check unit levels | medium |
| §5.7.2 | Add min unit level config | src/contexts/ConfigContext.tsx | Add minMathUnits/minEnglishUnits to config | |

**Answer C: Weighted average PLUS no failing subjects**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.3 | Add no-failure prerequisite | src/data/mock-data.ts | Update determineExcellenceTier to check grades | low |
| §5.7.2 | Add requireNoFailures toggle | src/contexts/ConfigContext.tsx | Add requireNoFailures boolean | |

---

### Q6 — Risk level 4 = risk to Bet, level 5 = risk to Gimel?

**Current assumption:** Level 4 = risk of missing Bet, Level 5 = risk of missing Gimel.

**Possible answers:**

**Answer A: Correct mapping**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q6 | Mark as RESOLVED | — | — | trivial |

**Answer B: Reversed mapping**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.3 | Swap BORDER_BET and BORDER_GIMEL descriptions | src/lib/colors.ts | Swap color assignments | low |

---

## Cluster: Risk Level Assignment (Q7-Q9)

### Q7 — Are risk levels manual or rule-based?

**Current assumption:** Primarily manual with auto-suggestions.

**Possible answers:**

**Answer A: Fully manual**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.3 | Change to manual entry | src/contexts/ConfigContext.tsx | Add riskAssignmentMode config | low |
| §5.4 | Downgrade auto-suggestion to advisory | | | |

**Answer B: Fully rule-based**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.4 | Make auto-calculation only mode | — | — | low |

**Answer C: Hybrid (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q7 | Mark as RESOLVED | — | — | trivial |

---

### Q8 — What is the complete risk decision matrix?

**Current assumption:** 0 failures=L1, 1 failure=L2 (or L3 if avg<65), 2+=L3.

**Possible answers:**

**Answer A: Matches assumption**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q8 | Mark as RESOLVED | — | — | trivial |

**Answer B: More granular multi-factor rules**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.4 | Replace with detailed matrix | src/data/mock-data.ts | Rewrite determineRiskLevel | high |
| §5.7.4 | Add new configurable parameters | src/contexts/ConfigContext.tsx | Expand RiskRulesConfig | |

---

### Q9 — How often are risk levels updated?

**Current assumption:** After each exam period, with ability to update anytime.

**Possible answers:**

**Answer A: After each exam period (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q9 | Mark as RESOLVED | — | — | trivial |

**Answer B: Continuously**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.4 | Add continuous update mode | — | — | low |

---

## Cluster: Eligibility Rules (Q10-Q15)

### Q10 — Exact rules for full Bagrut eligibility?

**Current assumption:** Pass (55+) all 7 core + PE, community service, etc.

**Possible answers:**

**Answer A: Matches assumption**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q10 | Mark as RESOLVED | — | — | trivial |

**Answer B: Additional unit count requirements**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.2 | Add minimum unit count rule | src/data/mock-data.ts | Add unit count check to determineEligibility | medium |
| §5.7.6 | Add minTotalUnits param | src/contexts/ConfigContext.tsx | Add minTotalUnits config | |

---

### Q11 — What subjects are mandatory?

**Current assumption:** 7 core weighted + 4 non-weighted.

**Possible answers:**

**Answer A: All 11 mandatory (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q11 | Mark as RESOLVED | — | — | trivial |

**Answer B: Only 7 core weighted mandatory**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.2 | Change rule 2 | src/data/mock-data.ts | Update determineEligibility to check only 7 | low |
| §5.7.6 | Move non-weighted to recommended list | src/contexts/ConfigContext.tsx | Split mandatorySubjects | |

---

### Q12 — Must student pass elective for Bagrut?

**Current assumption:** At least one 5-unit elective required.

**Possible answers:**

**Answer A: Yes (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q12 | Mark as RESOLVED | — | — | trivial |

**Answer B: No, only for enhanced certificate**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.2 | Remove elective from basic eligibility | src/data/mock-data.ts | Remove hasPassingElective check | low |
| §5.7.6 | Change requireElective to false | src/contexts/ConfigContext.tsx | Change requireElective default | |

---

### Q13 — Conditions for 'full Bagrut despite missing exam'?

**Current assumption:** Ministry policy allows full Bagrut when non-core subject is incomplete.

**Possible answers:**

**Answer A: All core passed + 1 elective missing = still full Bagrut**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Add specificity | — | — | trivial |

**Answer B: School-level case-by-case decision**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Change to school decision | src/types/index.ts | Add approvedBy field | medium |
| §5.2 | Add manual approval workflow | src/data/mock-data.ts | Add manual approval simulation | |

---

### Q14 — Does 'full despite missing' apply only to electives or also core?

**Current assumption:** Only elective/non-core subjects.

**Possible answers:**

**Answer A: Only electives (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q14 | Mark as RESOLVED | — | — | trivial |

**Answer B: Can also apply to one core subject with Ministry exemption**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Expand to include core exemptions | src/data/mock-data.ts | Allow failCount===1 with exemption | medium |
| §5.2 | Add Ministry exemption rule | src/types/index.ts | Add exemptedSubjects to Student | |

---

### Q15 — How to count 'full despite missing' students in statistics?

**Current assumption:** Treated as fully eligible but displayed as distinct sub-category.

**Possible answers:**

**Answer A: Fully eligible in all statistics (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q15 | Mark as RESOLVED | — | — | trivial |

**Answer B: Separate sub-category, NOT in headline percentage**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Do not include in cumulative eligible | src/data/mock-data.ts | Update buildKPIForPeriod to exclude from fullEligible | low |
| §3.3.1 | Show below eligibility rate line | src/contexts/ConfigContext.tsx | Add includeFullDespiteMissingInRate boolean | |

---

## Cluster: Class 12 Handling (Q16-Q19)

### Q16 — What type of class is Yud-Bet 12? (Special ed, integration, alternative track?)

**Current assumption:** Special education (Chinuch Meyuchad) or alternative educational track. Marked isSpecial=true, excluded from quality metrics.

**Possible answers:**

**Answer A: Special education (chinuch meyuchad) — confirmed**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | Confirm exclusion from hashvaa quality metrics is correct | src/data/mock-data.ts | No change needed — isSpecial:true already correct | trivial |

**Answer B: Integration/shiluv class — students with learning disabilities in supported setting**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §4.2 | Add class_type INTEGRATION distinct from SPECIAL | src/types/index.ts | Add INTEGRATION to class type | medium |
| §3.3.3 | May need partial inclusion in quality metrics | src/data/mock-data.ts | Adjust score distribution (higher than special ed) | |
| §9.2 | Update Class 12 parsing logic | src/pages/RankingView.tsx | Update filter logic for class exclusion | |

**Answer C: Alternative educational track — modified Bagrut path**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §4.2 | Add class_type ALTERNATIVE with different eligibility rules | src/types/index.ts | Add ALTERNATIVE class type + alternative subject lists | high |
| §5.2 | Define alternative track eligibility rules | src/data/mock-data.ts | Generate alternative-track students with different subjects | |
| §3.2.1 | Add alternative-track eligibility statuses | src/contexts/ConfigContext.tsx | Per-track eligibility rules | |
| | | src/pages/WhatIfProjections.tsx | Handle different subject requirements | |

---

### Q17 — How is Class 12 data structured differently in the spreadsheet?

**Current assumption:** Same column structure but different subjects and lower score ranges.

**Possible answers:**

**Answer A: Same structure, different subjects — confirmed**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §9.2 | No change needed | src/data/mock-data.ts | No change | trivial |

**Answer B: Completely different column layout**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §9.2 | Add alternate parser for Class 12 sheet | src/data/mock-data.ts | Generate Class 12 with different column structure | medium |

---

### Q18 — Does Class 12 have its own sorting/rikuz sheet?

**Current assumption:** No separate sorting sheet; Class 12 students may appear in master rikuz with a flag.

**Possible answers:**

**Answer A: No separate sheet — included in master rikuz with flag**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3 | Confirm no separate rikuz | — | — | trivial |

**Answer B: Separate sorting sheet for Class 12**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.6.1 | Add separate Class 12 ranking view | src/pages/RankingView.tsx | Add class-type filter or separate ranking | medium |
| §5.7.9 | Document separate ranking rules | src/data/mock-data.ts | Generate separate ranking data for Class 12 | |
| §7.2.5 | Add UI for Class 12 sorting view | | | |

---

### Q19 — Is there a Moed Bet (second exam opportunity) for Class 12?

**Current assumption:** Not documented; needs new spec section.

**Possible answers:**

**Answer A: Yes, same Moed Bet rules as regular classes**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §X.4 (new) | Document Moed Bet for Class 12 using standard rules | — | — | low |

**Answer B: Different Moed Bet rules for Class 12**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §X.4 (new) | Document Class 12-specific Moed Bet rules | src/data/mock-data.ts | Generate Moed Bet scores for Class 12 with different rules | medium |
| §5.6 | Add class-type-aware correction logic | src/contexts/ConfigContext.tsx | Per-class-type correction settings | |

---

## Cluster: Weighted Average Formula (Q20-Q22)

### Q20 — Exact formula for weighted average?

**Current assumption:** Sum(score_i * units_i) / Sum(units_i) for subjects with actual grades only.

**Possible answers:**

**Answer A: Matches assumption (variable-denominator weighted average)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q20 | Mark as RESOLVED | — | — | trivial |

**Answer B: Fixed denominator including missing subjects as 0**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.4 | Change to fixed denominator | src/data/mock-data.ts | Rewrite computeWeightedAverage to include zeros | medium |
| §5.1.6 | Document fixed denominator | src/contexts/ConfigContext.tsx | Add waDenominatorMode config | |
| §5.7.5 | Add denominator mode param | | | |

---

### Q21 — Are bonus points added to the weighted average?

**Current assumption:** No bonus points; straight formula.

**Possible answers:**

**Answer A: No bonus (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q21 | Mark as RESOLVED | — | — | trivial |

**Answer B: Bonus points for 5-unit subjects**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.4 | Add bonus formula | src/data/mock-data.ts | Add bonus calculation to computeWeightedAverage | medium |
| §5.1.6 | Document bonus rules | src/contexts/ConfigContext.tsx | Add bonusPointsEnabled and bonus table | |

---

### Q22 — Which subjects are included in the weighted average?

**Current assumption:** 7 core weighted subjects only; General Studies and Intro to Sciences excluded.

**Possible answers:**

**Answer A: 7 core only (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q22 | Mark as RESOLVED | — | — | trivial |

**Answer B: Core + electives (mugbarim) included**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.4 | Add electives to WA | src/data/mock-data.ts | Include mugbarim in computeWeightedAverage | medium |
| §5.1.6 | List all included subjects | src/contexts/ConfigContext.tsx | Add waIncludeElectives toggle | |
| §5.1.1 | Update subject classification | | | |
| §5.1.2 | Update subject weights | | | |

---

## Cluster: Data Sources (Q23-Q25)

### Q23 — Where does the data originate?

**Current assumption:** Data manually entered from Ministry mashov/sheilton system.

**Possible answers:**

**Answer A: Manual entry from mashov (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1 | No change | — | — | trivial |
| §9 | Confirm manual entry flow | | | |

**Answer B: Automated export/import from mashov**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §8.3 | Add mashov integration spec | src/data/mock-data.ts | Add import format simulation | medium |
| §9 | Define import file format and parser | | | |

---

### Q24 — How often is data updated?

**Current assumption:** After each exam period.

**Possible answers:**

**Answer A: After each exam period (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §8.3 | No change | — | — | trivial |

**Answer B: Continuous updates as results arrive**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1 | Add incremental update model | — | No immediate code change (future backend) | low |
| §8.3 | Document real-time update flow | | | |

---

### Q25 — Are internal (school) and external (Bagrut) scores always separate?

**Current assumption:** Yes, stored separately with configurable weights per subject.

**Possible answers:**

**Answer A: Always separate (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §10.1 Q25 | Mark as RESOLVED | — | — | trivial |

**Answer B: Some subjects have only external score**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Mark which subjects are external-only | src/data/mock-data.ts | Generate external-only subjects with null internal | low |
| §5.1 | Handle null internal in formula | src/types/index.ts | Make internalScore optional | |
| §5.7.3 | Add per-subject hasInternal flag | | | |

---

## Cluster: Accommodations (Q26-Q27)

### Q26 — What accommodations exist beyond adapted/dictation/oral/special?

**Current assumption:** Four types: adapted exam, dictation, oral exam, special conditions.

**Possible answers:**

**Answer A: Four types only (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.6 | No change | — | — | trivial |

**Answer B: Additional types (e.g., extra time, separate room, shiluv)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.6 | Add new accommodation types | src/types/index.ts | Extend AccommodationType const object | low |
| §4.2 | Update Student accommodation fields | src/data/mock-data.ts | Generate students with new accommodation types | |
| | | src/components/grades/GradeGrid.tsx | Add icons/badges for new types | |

---

### Q27 — Are accommodations per-student or per-subject?

**Current assumption:** Per-student (same accommodation applies to all exams).

**Possible answers:**

**Answer A: Per-student (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.6 | No change | — | — | trivial |

**Answer B: Per-subject (different accommodations for different exams)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.6 | Move accommodations to subject-grade level | src/types/index.ts | Move accommodations from Student to SubjectGrades | high |
| | | src/data/mock-data.ts | Generate per-subject accommodations | |
| | | src/components/grades/GradeGrid.tsx | Show accommodation per cell instead of frozen column | |

---

## Cluster: Gamification/What-If (Q28-Q31)

### Q28 — What is the gamification concept?

**Current assumption:** What-If projections showing "if student X improves subject Y by Z points, they reach excellence tier W."

**Possible answers:**

**Answer A: What-If projections (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5 | No change | — | — | trivial |
| §3.5.1 | Confirm projection model | | | |

**Answer B: Interactive goal-setting with progress tracking**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5 | Add goal persistence and tracking | src/types/index.ts | Add StudentGoal type | high |
| §3.5.1 | Expand beyond one-shot projections | src/pages/WhatIfProjections.tsx | Add goal tracking state | |
| §7.2.6 | Add goal dashboard UI | src/data/mock-data.ts | Generate goal data | |

---

### Q29 — Which subjects can be projected in What-If?

**Current assumption:** All subjects with exam remaining in current year.

**Possible answers:**

**Answer A: All subjects with remaining exams (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5.1 | No change | — | — | trivial |
| §5.7.8 | Confirm projection subject list | | | |

**Answer B: Only failing subjects**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5.1 | Restrict to failing subjects | src/pages/WhatIfProjections.tsx | Filter projection subjects | low |
| §5.7.8 | Change projectionScope default | | | |

---

### Q30 — What projection modes are needed?

**Current assumption:** Single-subject improvement and multi-subject batch projection.

**Possible answers:**

**Answer A: Both single and batch (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5.1 | No change | — | — | trivial |
| §3.5.2 | Confirm batch mode | | | |

**Answer B: Add class-wide projection (what if all students in class improve by X%)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5.1 | Add class-wide projection mode | src/pages/WhatIfProjections.tsx | Add class-level batch projection | medium |
| §3.5.2 | Document class-wide calculation | | | |
| §5.7.8 | Add class-wide params | | | |
| §7.2.6 | Class projection UI | | | |

---

### Q31 — Does projection affect the displayed weighted average?

**Current assumption:** Projection is shown side-by-side, not replacing the actual weighted average.

**Possible answers:**

**Answer A: Side-by-side display (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5.4 | No change | — | — | trivial |

**Answer B: Toggle to show projected WA as primary**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.5.4 | Add projection overlay mode | src/pages/WhatIfProjections.tsx | Add toggle to overlay projected WA | low |
| §5.7.5 | Add showProjectedWA config | src/contexts/ConfigContext.tsx | Add projectionDisplayMode | |

---

## Cluster: Mugbarim/Enhanced (Q32-Q33)

### Q32 — What exactly counts as a mugbar (enhanced) subject?

**Current assumption:** 5-unit elective subjects that go beyond minimum Bagrut requirements.

**Possible answers:**

**Answer A: 5-unit electives (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | No change | — | — | trivial |
| §5.1.5 | Confirm mugbarim formula | | | |

**Answer B: Any subject taken at higher unit level than required**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Redefine mugbar as relative to min requirement | src/data/mock-data.ts | Calculate mugbar status dynamically | medium |
| §5.1.5 | Update mugbarim identification logic | src/types/index.ts | Add minRequiredUnits to Subject | |

---

### Q33 — How are mugbarim scores combined with core subjects?

**Current assumption:** Separate display; not included in core weighted average.

**Possible answers:**

**Answer A: Separate from core WA (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | No change | — | — | trivial |
| §5.1.5 | Confirm separate display | | | |
| §5.7.3 | Confirm separation config | | | |

**Answer B: Included in an "enhanced weighted average"**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Add enhanced WA alongside core WA | src/data/mock-data.ts | Compute enhancedWeightedAverage | medium |
| §5.1.5 | Define enhanced WA formula | src/types/index.ts | Add enhancedWeightedAverage to Student | |
| §5.7.3 | Add enhancedWA config | src/components/grades/GradeGrid.tsx | Add enhanced WA column | |

---

## Cluster: Special Score Values (Q34-Q38)

### Q34 — What does score value 0 mean?

**Current assumption:** Not yet taken / no score recorded.

**Possible answers:**

**Answer A: Not yet taken (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | No change | src/data/mock-data.ts | Confirm 0 = not taken in display logic | trivial |

**Answer B: Student attended but scored 0 (actual failing score)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Distinguish null (not taken) from 0 (scored zero) | src/types/index.ts | Change score type from number to number\|null | medium |
| | | src/data/mock-data.ts | Use null for not-taken, 0 for actual zero | |
| | | src/components/grades/GradeGrid.tsx | Different display for null vs 0 | |

---

### Q35 — What does score value 777 mean?

**Current assumption:** Special code for "exempt" or "not applicable."

**Possible answers:**

**Answer A: Exempt from this exam**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document 777 = exempt | src/data/mock-data.ts | Handle 777 in display and formula exclusion | low |

**Answer B: Different special meaning (e.g., pending appeal)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document actual meaning | src/data/mock-data.ts | Adjust handling based on actual meaning | low |

---

### Q36 — What does score value 888 mean?

**Current assumption:** Special code for "pending" or "incomplete."

**Possible answers:**

**Answer A: Pending result not yet received**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document 888 = pending | src/data/mock-data.ts | Display "pending" badge; exclude from WA | low |

**Answer B: Different meaning**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document actual meaning | src/data/mock-data.ts | Adjust handling | low |

---

### Q37 — What does score value 999 mean?

**Current assumption:** Special code for "cancelled" or "did not attend."

**Possible answers:**

**Answer A: Did not attend (no-show)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document 999 = no-show | src/data/mock-data.ts | Display "absent" badge; count as failure for eligibility | low |

**Answer B: Different meaning**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document actual meaning | src/data/mock-data.ts | Adjust handling | low |

---

### Q38 — Are there other special score codes?

**Current assumption:** Only 0, 777, 888, 999 observed.

**Possible answers:**

**Answer A: No other codes**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Confirm complete list | — | — | trivial |

**Answer B: Additional codes exist (e.g., 555, 666)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.5 | Document all special codes | src/data/mock-data.ts | Add handling for new codes in display and formula | low |
| | | src/types/index.ts | Add SpecialScoreCode const object | |

---

## Cluster: Abbreviations (Q39-Q43)

### Q39 — What is 'shiluv 07' (integration 07)?

**Current assumption:** An integration program code for special-needs students in regular classes; '07' may be a program identifier.

**Possible answers:**

**Answer A: Ministry integration program (e.g., program code 07 for learning disabilities)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.6 | Add 'shiluv' as 5th accommodation type | src/types/index.ts | Add integration program field to Student | medium |
| §4.2 | Add integration_program to Student model | src/data/mock-data.ts | Generate students with shiluv flag | |
| §5.2 | Clarify if shiluv affects eligibility rules | src/components/grades/GradeGrid.tsx | Display shiluv indicator | |
| | | src/contexts/ConfigContext.tsx | Add shiluv config if affects eligibility | |

**Answer B: Classification that changes weighted average formula or exclusion rules**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.1.6 | Add alternate WA formula for shiluv students | src/data/mock-data.ts | Different computeWeightedAverage for shiluv | high |
| §5.2 | Separate eligibility criteria for shiluv | src/types/index.ts | Add StudentTrack enum including SHILUV | |
| §3.3.1 | Determine if excluded from rikuz like Class 12 | src/pages/WhatIfProjections.tsx | Handle alternate formula | |
| | | src/contexts/ConfigContext.tsx | Add shiluv exclusion config | |

---

### Q40 — What is 't.l. mutaemet' (adapted curriculum)?

**Current assumption:** Tochnit Limudim Mutaemet — the student follows a modified academic program.

**Possible answers:**

**Answer A: Modified curriculum with fewer mandatory subjects — affects eligibility**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.2 | Define alternative eligibility rules for adapted students | src/types/index.ts | Add CurriculumType to Student | high |
| §4.2 | Add curriculum_type field (STANDARD, ADAPTED) | src/data/mock-data.ts | Generate adapted-curriculum students | |
| §3.2.1 | New eligibility status categories | src/contexts/ConfigContext.tsx | Per-curriculum eligibility rules | |
| | | src/pages/WhatIfProjections.tsx | Respect different rules per curriculum | |

**Answer B: Same subjects but adapted exams — display-only label**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.6 | Document as display-only annotation | src/types/index.ts | Add adaptedCurriculum boolean | low |
| §4.2 | Add adapted_curriculum boolean or note | src/data/mock-data.ts | Flag some students as adapted | |
| | | src/components/grades/GradeGrid.tsx | Show adapted curriculum badge | |

---

### Q41 — What is 'bak"s'?

**Current assumption:** Unknown abbreviation — treated as free-text note.

**Possible answers:**

**Answer A: Administrative status code (Ministry classification)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.4.2 | Add as recognized status annotation | src/types/index.ts | Add new status enum value | low |
| §4.2 | May need new status field | src/pages/ChallengingStudents.tsx | Display bak"s badge/tag | |

**Answer B: Program/service enrollment that affects tracking/exclusion**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Document as special category with inclusion/exclusion rules | src/types/index.ts | Extend EligibilityStatus or add tracking field | medium |
| §5.2 | Define how bak"s students counted in eligibility | src/data/mock-data.ts | Generate students with classification | |
| | | src/contexts/ConfigContext.tsx | Add to exclusion rules | |

---

### Q42 — What is 'mad"ach' (appears as 'mad"ach a. gmar')?

**Current assumption:** Either 'Madaei HaChevra' (Social Sciences) or 'Madaei HaChaim' (Life Sciences) with final project.

**Possible answers:**

**Answer A: Madaei HaChevra (Social Sciences) with final project component**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Confirm subject components and weights | src/data/mock-data.ts | Update subject definition if weights differ | low |
| §5.1.5 | Add formula with project component weight | src/types/index.ts | No structural change needed | |

**Answer B: Madaei HaChaim (Life Sciences) — different subject entirely**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Add Life Sciences as new elective | src/data/mock-data.ts | Add life-sciences subject to subjects array | low |
| §5.1.5 | Add Life Sciences formula | src/types/index.ts | No structural change needed | |

---

### Q43 — Does 'ch"m' mean Chinuch Meyuchad (special education)?

**Current assumption:** Yes, referring to Class 12 (special education), excluded from quality metrics.

**Possible answers:**

**Answer A: Confirmed: ch"m = Chinuch Meyuchad = Class 12**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | No change needed | — | — | none |

**Answer B: ch"m refers to broader category than just Class 12 (multiple special-ed students across classes)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | Quality metrics exclusion must be per-student, not per-class | src/types/index.ts | Add isSpecialEducation field to Student | high |
| §4.2 | Add is_special_education boolean to Student | src/data/mock-data.ts | Flag individual students across multiple classes | |
| §5.7.12 | Denominator rules must support per-student exclusion | src/contexts/ConfigContext.tsx | Change classExclusions to student-level | |
| | | src/pages/WhatIfProjections.tsx | Filter special-ed by per-student flag | |

---

## Cluster: Corrections Process (Q44-Q46)

### Q44 — What is the corrections and completions process?

**Current assumption:** Students retake failed exams or submit additional work within a defined correction period.

**Possible answers:**

**Answer A: Formal retake of external exam (moed bet) — new score recorded**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.6 | Define retake as new Grade record with correction flag | src/types/index.ts | Add correction tracking fields (originalScore, isCorrected) | medium |
| §4.2 | Add is_correction boolean and link to original_grade_id | src/data/mock-data.ts | Generate students with correction scores | |
| | | src/components/grades/GradeGrid.tsx | Visual indicator for corrected scores | |

**Answer B: Additional coursework to boost internal component**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.6 | Corrections affect internal score only; recalculate with weight formula | src/types/index.ts | Add correctedInternal field | low |
| §5.1 | No formula change, but internal component value changes | src/data/mock-data.ts | Simulate internal score corrections | |

---

### Q45 — Is there a limit on corrections?

**Current assumption:** No hard limit; each correction is tracked.

**Possible answers:**

**Answer A: Ministry limit exists (e.g., max 2 retakes per subject)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.6 | Add correction limit per subject | src/contexts/ConfigContext.tsx | Add correctionLimit to ConfigState | low |
| §5.7 | Add configurable correction limit | src/types/index.ts | Track correction count per subject | |

**Answer B: No formal limit but corrections only during specific exam periods**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.6 | Document correction windows tied to exam periods | src/contexts/ConfigContext.tsx | Add allowsCorrections to ExamPeriodConfig | low |
| §5.7.10 | Flag which periods allow corrections | | | |

---

### Q46 — When a correction is applied, which score is kept?

**Current assumption:** The higher of original and corrected score is kept.

**Possible answers:**

**Answer A: Higher score kept (confirmed)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.6 | No change — confirmed | src/data/mock-data.ts | Implement max(original, corrected) logic | low |

**Answer B: New score always replaces old regardless**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.6 | Change to 'last score wins' | src/data/mock-data.ts | Replace score directly; store old in audit | low |
| §4.2 | Audit trail must preserve original | src/types/index.ts | Add originalScore field for display | |

---

## Cluster: Columns B-C (Q47-Q48)

### Q47 — Do columns B-C represent Math and English unit levels?

**Current assumption:** Yes — first number = Math units, second = English units.

**Possible answers:**

**Answer A: Confirmed: B=Math units, C=English units**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.3 | No change needed | — | — | none |

**Answer B: Reversed: B=English, C=Math**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.3 | Swap mapping documentation | src/data/mock-data.ts | Swap mathUnitLevel and englishUnitLevel assignment | low |
| §9.2 | Fix import parser column mapping | | | |

---

### Q48 — Is column B vs C placement significant?

**Current assumption:** No — values matter regardless of exact column.

**Possible answers:**

**Answer A: No significance — just formatting variation**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §9.2 | Import parser reads both B and C as pair | — | — | none |

**Answer B: Column B = starting level, Column C = current level (tracks changes)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.3 | Add unit level history tracking | src/types/index.ts | Add originalMathUnitLevel/originalEnglishUnitLevel | medium |
| §4.2 | Add original unit level fields | src/data/mock-data.ts | Generate students with level changes | |
| | | src/components/grades/GradeGrid.tsx | Show level change indicator | |

---

## Cluster: Student Transfers (Q49-Q51)

### Q49 — When a student leaves mid-year, are they removed from total count?

**Current assumption:** Withdrawn students excluded from denominator; data preserved with withdrawn status.

**Possible answers:**

**Answer A: Excluded from count — correct assumption**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | No change needed | — | — | none |

**Answer B: Kept in count with zeros (counted as failures)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Withdrawn remain in denominator as non-eligible | src/data/mock-data.ts | Keep withdrawn in calculations as MISSING_4_PLUS | medium |
| §5.7.12 | Remove withdrawn exclusion from denominator rules | src/contexts/ConfigContext.tsx | Remove withdrawal exclusion logic | |

---

### Q50 — What is Project Hila?

**Current assumption:** A special program (dropout prevention or alternative placement); students counted as withdrawn.

**Possible answers:**

**Answer A: External alternative placement — students leave Bagrut track entirely**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Hila transfer = WITHDRAWN, excluded from all stats | src/types/index.ts | No change; WITHDRAWN exists conceptually | low |
| §4.2 | withdrawal_reason includes 'Project Hila' | src/data/mock-data.ts | Generate 1-2 students with Hila withdrawal | |

**Answer B: Internal school program — students still count in school stats**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | Add PROJECT_HILA as distinct from WITHDRAWN | src/types/index.ts | Add HILA_PROGRAM to EligibilityStatus | medium |
| §4.2 | Add HILA_PROGRAM to bagrut_track | src/data/mock-data.ts | Generate Hila students with partial tracking | |
| | | src/pages/ChallengingStudents.tsx | Show Hila students with distinct badge | |

---

### Q51 — What happens when a student gives up on full Bagrut?

**Current assumption:** Reclassified as non-matriculation (lo begrutim); excluded from eligibility percentages.

**Possible answers:**

**Answer A: Reclassified as non-matriculation — confirmed**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.5 | No change — support reclassification with audit trail | src/types/index.ts | No change; NON_MATRICULATION exists | low |
| | | src/data/mock-data.ts | Generate 1-2 voluntarily withdrawn students | |

**Answer B: Tracked separately as 'partial Bagrut' path**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.1 | Add PARTIAL_VOLUNTARY status | src/types/index.ts | Add PARTIAL_VOLUNTARY to EligibilityStatus | medium |
| §5.2 | Define partial Bagrut eligibility criteria | src/data/mock-data.ts | Generate partial voluntary students | |
| §3.3.1 | Show partial-voluntary as separate rikuz row | src/contexts/ConfigContext.tsx | Handle partial Bagrut path in eligibility rules | |

---

## Cluster: Community Service & PE (Q52-Q53)

### Q52 — What do community service values (1, 3, 4) represent?

**Current assumption:** Completion level or hours category; value >= 1 means completed; not included in weighted average.

**Possible answers:**

**Answer A: Hours categories (1=minimum, 4=exceeded); any value >= 1 = pass**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Document community service scoring scale (1-4 categorical) | src/data/mock-data.ts | Generate 1-4 categorical values (currently generates 55-100) | low |
| §5.2 | Confirm passing threshold: value >= 1 | src/components/grades/GradeGrid.tsx | Display 1-4 scale instead of 0-100 | |

**Answer B: Number of semesters completed; need 4 to pass**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.2 | Change passing threshold from >= 1 to >= 4 | src/data/mock-data.ts | Generate values 0-4; eligibility needs >= 4 | low |
| §3.1.2 | Document as semester-based completion | src/contexts/ConfigContext.tsx | Add community service passing threshold config | |

---

### Q53 — Is PE a formally graded Bagrut subject?

**Current assumption:** PE has 0-100 grade but is pass/fail for Bagrut purposes; threshold assumed 55.

**Possible answers:**

**Answer A: Pass/fail for Bagrut; grade for reference only — confirmed**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | No change needed | — | — | none |

**Answer B: PE grade contributes to separate 'school certificate' metric**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3 | Add school certificate tracking as parallel metric | src/types/index.ts | Add schoolCertificateStatus to Student | medium |
| §4.2 | Add school_certificate_status to Student entity | src/data/mock-data.ts | Calculate school certificate status | |

---

## Cluster: Arabic Columns (Q54)

### Q54 — Why are there two Arabic sections in the sorting sheet?

**Current assumption:** Different levels (3-unit vs 5-unit) or different Arabic tracks (MSA vs Spoken).

**Possible answers:**

**Answer A: Different unit levels: 3-unit Arabic and 5-unit Arabic as separate entries**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Model Arabic as multi-level subject like Math/English | src/data/mock-data.ts | Split Arabic into arabic-3 and arabic-5 subjects | low |
| §4.2 | Arabic needs has_unit_levels=true | src/types/index.ts | No structural change; Subject supports unitLevel | |

**Answer B: Two distinct subjects: MSA (required for Arabic speakers) and Arabic as foreign language**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Add two separate Arabic subjects | src/data/mock-data.ts | Add arabic-native and arabic-foreign subjects | medium |
| §5.2 | Define which Arabic mandatory for which students | src/types/index.ts | No structural change needed | |
| | | src/contexts/ConfigContext.tsx | Per-student mandatory subject overrides | |

---

## Cluster: Future/Architecture (Q55-Q62)

### Q55 — Who is the target audience beyond Sarit?

**Current assumption:** Primarily Sarit (Bagrut coordinator); potentially principals, pedagogical coordinators.

**Possible answers:**

**Answer A: Sarit only (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §1.2 | No change | — | — | trivial |
| §2.1 | Confirm single-user scope | | | |

**Answer B: Multiple roles (principal, coordinators, teachers)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §1.2 | Add role definitions | src/types/index.ts | Add UserRole type | high |
| §2.1 | Define per-role access | src/contexts/ConfigContext.tsx | Add role-based view config | |
| §2.2 | Add role-based navigation | src/App.tsx | Role-based route guards | |
| §8.2 | Add auth requirements | | | |

---

### Q56 — Is multi-school support needed?

**Current assumption:** Single school for now.

**Possible answers:**

**Answer A: Single school only**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §2.2 | No change | — | — | trivial |

**Answer B: Multi-school (district level)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §2.2 | Add school selector and multi-tenancy | src/types/index.ts | Add School entity | high |
| §8.2 | Add school-level data isolation | src/data/mock-data.ts | Generate multi-school data | |
| §8.7 | Add cross-school reporting | src/App.tsx | Add school context wrapper | |

---

### Q57 — What is the deployment target?

**Current assumption:** Web-based SPA, no specific hosting requirement.

**Possible answers:**

**Answer A: Static hosting (Vercel, Netlify, etc.)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §8 | Document hosting platform | — | — | trivial |

**Answer B: On-premise or Ministry-hosted**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §8 | Add on-premise deployment requirements | — | Build/deploy config changes only | medium |

---

### Q58 — Is an alert/notification engine needed?

**Current assumption:** Not currently planned; risk indicators serve as passive alerts.

**Possible answers:**

**Answer A: No — risk badges are sufficient**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.4 | No change | — | — | trivial |

**Answer B: Yes — email/push alerts when students cross risk thresholds**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.4 | Add alert rules engine | src/types/index.ts | Add AlertRule, AlertEvent types | high |
| §3.4.2 | Define alert triggers | src/contexts/ConfigContext.tsx | Add alert rule configuration | |
| §3.4.5 | Alert delivery channels | src/pages/ChallengingStudents.tsx | Add alert history panel | |
| §5.7.11 | Alert config params | src/data/mock-data.ts | Generate sample alert events | |
| §7.2.4 | Alert management UI | | | |

---

### Q59 — Should hashvaa (comparison) support custom date ranges?

**Current assumption:** Fixed year-over-year comparison.

**Possible answers:**

**Answer A: Fixed year-over-year (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3 | No change | — | — | trivial |

**Answer B: Custom date ranges / period-over-period**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3 | Add period selector for comparison | src/pages/Dashboard.tsx | Add date range picker | medium |
| §3.3.3 | Flexible comparison dimensions | src/data/mock-data.ts | Generate comparison data for arbitrary periods | |

---

### Q60 — How many years of historical data should be displayed?

**Current assumption:** Current + 3 prior years (4 total).

**Possible answers:**

**Answer A: 4 years (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | No change | — | — | trivial |

**Answer B: Configurable number of years**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | Add configurable year range | src/contexts/ConfigContext.tsx | Add comparisonYearCount config | low |
| | | src/data/mock-data.ts | Generate variable number of comparison years | |

---

### Q61 — Is data export required?

**Current assumption:** Not currently specified.

**Possible answers:**

**Answer A: No export needed**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §8.4 | No change | — | — | trivial |

**Answer B: Excel/PDF export of rikuz and reports**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §8.4 | Add export spec (formats, layouts) | src/lib/export.ts (new) | Implement XLSX/PDF export | high |
| | | src/components/ui/ExportButton.tsx (new) | Export trigger UI | |

---

### Q62 — Is this replacing the spreadsheet or supplementing it?

**Current assumption:** Supplementing — spreadsheet remains source of truth.

**Possible answers:**

**Answer A: Supplementing (matches assumption)**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §1.2 | No change | — | — | trivial |
| §2.1 | Confirm read-only visualization scope | | | |

**Answer B: Replacing — system becomes source of truth**

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §1.2 | Change scope to CRUD system | All components | Add edit/save capabilities throughout | high |
| §2.1 | Add data entry workflows | src/types/index.ts | Add mutation types | |
| | | src/data/ | Replace mock-data with API layer | |

---

## Assumptions (A1-A14)

### A1 — All 15 regular class sheets follow the same column order

**Current assumption:** Column order is consistent: A=flags, B-C=units, D=number, E=name, G-J=accommodations, K=weighted avg, etc.

**If invalidated:** Different class sheets have different column orders.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1 | Document per-sheet column variations | src/data/mock-data.ts | No impact on mock data (generated, not parsed) | medium |
| §7.2.2 | Add column mapping configuration | — | Future import parser must handle variations | |
| §9.2 | Add flexible column detection | | | |

---

### A2 — Passing grade is always 55 across all subjects

**Current assumption:** Universal passing threshold of 55 for all Bagrut exams.

**If invalidated:** Different subjects or student categories have different passing thresholds.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §5.3 | Add per-subject or per-category passing thresholds | src/data/mock-data.ts | Update determineEligibility to use per-subject thresholds | medium |
| §5.7.1 | Add passingGrade per subject to config | src/contexts/ConfigContext.tsx | Add per-subject passing threshold config | |
| §5.7.7 | Add threshold override config | src/types/index.ts | Add passingThreshold to Subject type | |

---

### A3 — 30/70 is the default internal/external weight split

**Current assumption:** Most subjects use 30% internal / 70% external with documented exceptions.

**If invalidated:** Different default ratio or more varied ratios than expected.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Update default weight documentation | src/data/mock-data.ts | Update subject weight definitions | low |
| §5.1 | Change default formula weights | src/types/index.ts | No structural change (weights already per-subject) | |
| §5.1.3 | Update exception documentation | | | |
| §5.1.5 | Update mugbarim weights | | | |
| §5.7.3 | Update config defaults | | | |

---

### A4 — Sarit is the sole data entry person

**Current assumption:** Only Sarit enters and maintains data; others receive but don't edit.

**If invalidated:** Multiple data entry staff.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| — | Minimal spec impact; add multi-user note | — | No code impact for read-only demo | trivial |

---

### A5 — Risk level is encoded via cell background color in column D

**Current assumption:** Background color of student number cell = risk level (green=1, orange font=2, amber=3, red font=4, peach+red=5).

**If invalidated:** Risk encoded differently (separate column, text annotation, etc.).

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.4.1 | Update risk encoding documentation | — | No code impact (mock data generates risk directly) | low |
| §6.1 | Update color mapping docs | src/lib/colors.ts | Verify color tokens match actual spreadsheet | |
| §6.4 | Update export color mapping | | | |

---

### A6 — Exam period structure is fixed (4-5 periods per year)

**Current assumption:** Always 4-5 exam periods: summer 11th, summer 12th, winter 12th, winter+corrections, final summer.

**If invalidated:** Variable number of periods or different period names.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2.4 | Document actual period structure | src/contexts/ConfigContext.tsx | Update ExamPeriodConfig defaults | low |
| §5.5 | Update period progression rules | src/data/mock-data.ts | Adjust period generation | |
| §5.7.10 | Update period config | | | |

---

### A7 — Sorting sheet is ordered by weighted average descending

**Current assumption:** Students ranked by weighted average, manually maintained or Excel-sorted.

**If invalidated:** Different sort criteria or multi-key sort.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.6.1 | Update sort order documentation | src/pages/RankingView.tsx | Change default sort | low |
| §7.2.5 | Update ranking UI description | | | |

---

### A8 — Non-matriculation students excluded from eligibility percentages

**Current assumption:** Students flagged 'lo begrutim' are not counted in either numerator or denominator.

**If invalidated:** Non-matric students counted in denominator (lowering the percentage).

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.2 | Update exclusion rules | src/data/mock-data.ts | Include non-matric in denominator | medium |
| §3.2.5 | Change denominator calculation | src/lib/utils.ts | Update getEligibilityStats | |
| §3.3.1 | Update rikuz display | src/contexts/ConfigContext.tsx | Add nonMatricInDenominator toggle | |

---

### A9 — General Studies and Intro to Sciences are NOT included in weighted average

**Current assumption:** These subjects have scores recorded but are excluded from the weighted average formula.

**If invalidated:** One or both are included in weighted average.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1 | Update subject classification | src/data/mock-data.ts | Include in computeWeightedAverage | medium |
| §3.1.4 | Add to WA subject list | src/types/index.ts | Update subject isWeighted flags | |
| §5.1 | Update formula documentation | | | |
| §5.1.6 | Update WA formula | | | |
| §5.7.5 | Update WA config | | | |

---

### A10 — Historical comparison data for previous years is manually entered (static)

**Current assumption:** Prior year values in hashvaa sheet are manually typed, not linked to other files.

**If invalidated:** Prior year data comes from previous year's spreadsheet files.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | Document data source for historical values | src/data/mock-data.ts | No change (mock data is static regardless) | low |
| §9.2 | Add historical data import spec | | | |
| §9.3 | Add cross-file reference documentation | | | |

---

### A11 — Sofi (final score) columns are always formula-driven, never manually overridden

**Current assumption:** Every sofi cell contains a formula; no manual overrides.

**If invalidated:** Some sofi values are manually entered (overriding the formula).

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1 | Document manual override capability | src/types/index.ts | Add isManualOverride flag to SubjectGrades | medium |
| §3.1.4 | Add override indicator | src/data/mock-data.ts | Generate some manual overrides | |
| §5.1 | Document override precedence rules | src/components/grades/GradeGrid.tsx | Show override indicator in cells | |

---

### A12 — Each student takes exactly one Math level and one English level

**Current assumption:** A student has scores for either 3-unit OR 4-unit OR 5-unit, not multiple.

**If invalidated:** Students can have scores at multiple unit levels (e.g., started at 5, downgraded to 4).

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.3 | Document multi-level tracking | src/types/index.ts | Allow multiple unit-level scores per subject | medium |
| | | src/data/mock-data.ts | Generate students with level changes | |
| | | src/components/grades/GradeGrid.tsx | Show level history or current+original | |

---

### A13 — All elective subjects are 5-unit level

**Current assumption:** Every elective/megama tracked under 'mugbarim' is at 5-unit level.

**If invalidated:** Some electives are at 3-unit or 4-unit level.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.1.2 | Document variable unit levels for electives | src/data/mock-data.ts | Generate electives at different unit levels | low |
| §5.1 | Update WA formula to handle variable elective units | src/types/index.ts | No structural change (unitLevel exists) | |
| §5.1.5 | Update mugbarim identification logic | | | |

---

### A14 — Year-over-year comparison shows exactly 4 years

**Current assumption:** Comparison sheet always shows current + 3 prior years.

**If invalidated:** Variable number of years shown.

| Spec Section | Spec Change | Code File | Code Change | Effort |
|---|---|---|---|---|
| §3.3.3 | Document variable year count | src/contexts/ConfigContext.tsx | Add comparisonYearCount setting | low |
| | | src/data/mock-data.ts | Generate configurable number of comparison years | |
