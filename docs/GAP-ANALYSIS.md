# Gap Analysis V3: Comprehensive QA Verification

**Analysis Date:** 2026-03-08
**Analyst:** QA Gap Analysis (automated + browser verification)
**Scope:** Full comparison of demo app (code + live UI at localhost:5174) against spreadsheet inventory
**Previous Reports:** V1 (47 gaps), V2 (14 gaps)

---

## Executive Summary

The bagrut-demo app is a mature prototype that faithfully reproduces the core functionality of the Sheifa School Bagrut tracking spreadsheet. All 8 original Critical gaps have been resolved. The app delivers 7 functional pages (Dashboard, Class Grade Grid for 16 classes, Student Detail, Ranking, Challenging Students, What-If Projections, Settings placeholder) with RTL Hebrew layout, period-aware KPIs, dual-scheme rikuz matrix, multi-component Math/English scoring, and class-specific elective assignments.

**Key findings from this V3 analysis:**

- **Total student count inconsistency** discovered: dashboard body text shows 504, header badge shows 503, spreadsheet specifies ~509. The mock data generates 504 students (sum of CLASS_SIZES) but Header.tsx hardcodes "503".
- **Risk level model uses 3 levels** (1/2/3) instead of the spreadsheet's 5 levels (1-5), collapsing excellence-risk levels 4 and 5 into the ExcellenceTier system instead.
- **Excellence tier 1-Aleph (96+) shows 0 students** in live app -- the score generation distribution makes it nearly impossible to reach a 96+ weighted average, suggesting the mock data calibration needs adjustment.
- **Trend chart Y-axis domains are hardcoded** to ranges that don't match the actual data values (e.g., eligibility chart domain [65,85] but data ranges 92-97%), causing visual misrepresentation.
- **5 Important gaps, 8 Minor gaps, 5 Cosmetic gaps, 3 Mock Data issues, 3 UI issues** remain (24 total).

---

## 1. Fully Implemented Features

### 1.1 Multi-Component Math Scoring (P0 -- RESOLVED)
- **Evidence:** `generateMathGrades()` in mock-data.ts generates all 7 questionnaire scores (q182, q381, q382, q481, q482, q581, q582) with correct Sofi formulas.
- **Verified in UI:** GradeGrid for class-1 shows columns 182, 381, 382, 481, 482, 581, 582, and Sofi. Each student shows scores only for their unit level's questionnaires.

### 1.2 Multi-Module English Scoring (P0 -- RESOLVED)
- **Evidence:** `generateEnglishGrades()` generates modules A-G + oral per unit level with correct Sofi weights.
- **Verified in UI:** GradeGrid shows A, B, C, D, E, F, G, oral, and Sofi columns under the English header.

### 1.3 Complete Subject Coverage (P0 -- RESOLVED)
- **Evidence:** 25 subjects defined in `subjects[]` array: 7 core weighted, 4 required non-weighted (pass/fail), 14 elective/major.
- **Verified in UI:** Class 1 grid shows Math, History (30/70), Civics (20/80), Tanakh (30/70), Literature (30/70), Language (30/70), English, General Studies, Intro to Sciences, PE, Community Service, CS (76/24), Geography (60/40), Spanish (60/40), Jewish Law (50/50). Weight labels displayed in headers.

### 1.4 Class-Specific Elective Pools (P1 -- RESOLVED)
- **Evidence:** `CLASS_ELECTIVES` map assigns realistic subject pools per class (e.g., class 12 gets only Communications).
- **Verified in UI:** Different classes show different elective columns.

### 1.5 Grade Grid with Frozen Columns and Summary Rows (P0 -- RESOLVED)
- **Evidence:** GradeGrid.tsx uses TanStack Table with 8 frozen columns (mathUnit, engUnit, studentNum, name, accommodations, risk, excellence, weightedAvg), sticky positioning via RTL right offsets.
- **Verified in UI:** Scrolling the grid keeps left columns fixed. Three summary rows visible: class average (green), exam count, failing count (red).

### 1.6 Rikuz Matrix with Dual Scheme and Period Support (P0 -- RESOLVED)
- **Evidence:** RikuzMatrix.tsx accepts `selectedPeriod`, toggles between exam-missing and failure-count schemes, separates class 12 from regular classes.
- **Verified in UI:** Dashboard shows rikuz table with 15 regular class columns + totals + class 12 column + combined totals + percentage column. Toggle buttons work.

### 1.7 KPI Cards Period-Aware (P1 -- RESOLVED)
- **Evidence:** KPICards.tsx receives `selectedPeriod`, calls `getKPIByPeriod()`.
- **Verified in UI:** Dashboard KPI cards show total students, eligible count, at-risk count, excellence candidates with year-over-year trend indicators.

### 1.8 Year-Over-Year Trend Charts (P1 -- RESOLVED)
- **Evidence:** TrendCharts.tsx renders 3 mini area charts (eligibility rate, excellence rate, math 5-unit rate) using Recharts, sourced from `getYearComparisons()` with correct spreadsheet values.
- **Verified in UI:** Three charts visible on dashboard with years on x-axis.

### 1.9 Ranking View with Subject Scores (P1 -- RESOLVED)
- **Evidence:** RankingView.tsx shows all students ranked by weighted average, with columns for rank, class, student number, name, math/eng unit levels, 7 core subject final scores, weighted average, eligibility, risk.
- **Verified in UI:** Table displays with sorting, search, class filter, risk filter, and export dropdown.

### 1.10 Student Detail Page (P1 -- RESOLVED)
- **Evidence:** StudentDetail.tsx shows header card (name, class, unit levels, accommodations, risk, eligibility), score table with expandable Math/English components, eligibility checklist, and notes.
- **Verified in UI:** Clicking a student name from ranking navigates to detail page.

### 1.11 Challenging Students Kanban (P1 -- RESOLVED)
- **Evidence:** ChallengingStudents.tsx displays 3-column Kanban: Especially Challenging, Will Probably Pass, Close Follow-up. 15 students assigned across categories.
- **Verified in UI:** Three columns with 5 students each, linked to student detail pages.

### 1.12 What-If Projections (P1 -- RESOLVED)
- **Evidence:** WhatIfProjections.tsx projects missing subject scores using highest-score-minus-offset method, recalculates weighted averages and eligibility.
- **Verified in UI:** Config panel with offset input, 3 KPI summary cards, table showing 50 students with improvement potential.

### 1.13 Score Cell Conditional Coloring (P1 -- RESOLVED)
- **Evidence:** `getScoreCellStyle()` in colors.ts applies red font for <52, light-blue bg + red font for 52-53, cyan bg + red font for 54, blue font for 90+.
- **All 20 spreadsheet colors** defined as exact hex matches in colors.ts.

### 1.14 Non-Matriculation Student Distribution (P1 -- RESOLVED)
- **Evidence:** `nonMatricDistribution` in mock-data.ts marks students in classes 1, 2, 4, 5, 6, 8, 10, 11, 13, 15 matching spreadsheet pattern.

### 1.15 Exam Period Selection (P1 -- RESOLVED)
- **Evidence:** Period selector in Header.tsx drives AppShell's PeriodContext, which feeds into KPICards and RikuzMatrix. ClassHeader also has an independent period selector.
- **4 exam periods** defined: summer-11, summer-12, winter-12, corrections.

### 1.16 RTL Layout and Hebrew UI (P1 -- RESOLVED)
- **Evidence:** `dir="rtl"` on all page containers, Sidebar on right side, proper Hebrew labels throughout.
- **Verified in UI:** Fully Hebrew interface with correct RTL text flow.

### 1.17 Color Legend (Previously C-2 -- NOW RESOLVED)
- **Evidence:** GridLegend.tsx provides a collapsible legend showing risk levels, excellence tiers, score colors, column colors, accommodations, and pass/fail indicators.
- **Verified in UI:** "Mikra" (legend) button visible below class header, expands to show comprehensive legend.

---

## 2. Partially Implemented Features

### P-1: Risk Level Model (3 levels vs. 5 levels)
- **Priority:** P1 (Important)
- **Status:** Partially implemented
- **Spreadsheet:** Uses 5 risk levels: 1 (on track), 2 (risk), 3 (high risk), 4 (excellence risk 1-Bet), 5 (excellence risk 1-Gimel)
- **Demo:** Uses 3 risk levels (1/2/3) for the `RiskLevel` type. Levels 4 and 5 are handled separately via `ExcellenceTier` (border_bet, border_gimel). The RiskBadge only displays levels 1-3. The RankingView filter offers levels 1-5 but the data only contains 1-3.
- **Impact:** The risk distribution in the UI (85.5% level 1, 10.7% level 2, 3.8% level 3) conflates the spreadsheet's risk-to-eligibility and risk-to-excellence into separate systems. Students at excellence risk show as level 1 with an excellence tier badge instead of risk level 4/5. This is a deliberate design choice but differs from the spreadsheet's unified 5-level system.
- **To close:** Either add levels 4 and 5 to the RiskLevel type and RiskBadge, or document the design decision explicitly.

### P-2: Year-Over-Year Comparison (Mini-charts vs. Full Page)
- **Priority:** P2 (Minor)
- **Status:** Partially implemented
- **Spreadsheet:** Dedicated "Hashvaa" sheet with 13 metrics across 4 years in a structured table.
- **Demo:** Three mini trend charts (eligibility, excellence, math-5) embedded in the dashboard. Missing metrics: English 4-unit count/%, English 5-unit count/%, Math 4-unit count/%, total student counts, full eligible counts.
- **To close:** Add a dedicated Year-Over-Year comparison page or expand the dashboard section with additional metrics.

### P-3: Exam Periods (4 vs. 5)
- **Priority:** P2 (Minor)
- **Status:** Partially implemented
- **Spreadsheet:** Tracks 5 distinct exam periods: After Summer 2023, After Summer 2024, After Winter 2025, After Winter 2025 + Corrections, After Summer 2025 (projected).
- **Demo:** Defines 4 periods (summer-11, summer-12, winter-12, corrections). The projected final period ("After Summer 2025") is not modeled.
- **To close:** Add a 5th period representing the projected final state.

### P-4: Gamification/What-If Projections
- **Priority:** P2 (Minor)
- **Status:** Partially implemented
- **Spreadsheet:** The Mishchuk (Gamification) sheet uses variable-denominator averages (only counting units for subjects the student has completed), an "overall average including electives" formula, and projects scores as "best score minus 5".
- **Demo:** WhatIfProjections.tsx uses the same "best score minus offset" projection method and recalculates weighted averages. However, it uses a fixed-denominator formula (all 7 core subjects always counted) rather than the spreadsheet's variable denominator. The "overall average including electives" metric is not shown.
- **To close:** Implement variable-denominator averaging and add elective-inclusive average.

### P-5: ClassHeader Period Selector Not Connected to Grid Data
- **Priority:** P2 (Minor)
- **Status:** Partially implemented
- **Spreadsheet:** Class sheets show period-specific exam data with failing counts per period.
- **Demo:** ClassHeader.tsx has a period selector dropdown, but the selected period is stored in local state and not passed to GradeGrid. The grade grid always shows the same (current) data regardless of which period is selected in the class header.
- **To close:** Either connect the class-level period selector to filter grade data, or remove it to avoid confusion.

---

## 3. Not Yet Implemented Features

### N-1: Physics 4-Component Weight Model
- **Priority:** P1 (Important)
- **Status:** Not implemented
- **Spreadsheet:** Physics uses 4-component formula: `361*0.30 + 376*0.15 + 283*0.30 + 371*0.25`
- **Demo:** Physics uses simple 30/70 (internal/external) weighting. The `Subject` type only supports 2-component weights (`internal`/`external`). Physics scores are structurally incorrect.
- **To close:** Extend `Subject` weights to support multi-component models, or add Physics-specific generation logic similar to Math/English.

### N-2: Per-Student Longitudinal Trajectory View
- **Priority:** P1 (Important)
- **Status:** Not implemented
- **Spreadsheet:** Class sheets (rows ~99-131) show each student's color-coded status across 3 time periods in a side-by-side grid (green/yellow/red background).
- **Demo:** No per-student trajectory visualization. The rikuz matrix shows school-wide period comparisons, but individual student progress across periods is not visible.
- **To close:** Add a per-student trajectory component in the ClassGradeGrid page or StudentDetail page.

### N-3: Cumulative Percentage Rows in Rikuz
- **Priority:** P1 (Important)
- **Status:** Not implemented
- **Spreadsheet:** Shows cascading cumulative percentages: "0 missing" %, "0-1 missing" %, "0-2 missing" %, "0-3 missing" %, etc.
- **Demo:** RikuzMatrix shows per-category percentages and a total eligibility rate, but not cascading cumulative rows.
- **To close:** Add cumulative percentage columns to the RikuzMatrix.

### N-4: Special Score Values (Chasam/Ikuv)
- **Priority:** P1 (Important)
- **Status:** Not implemented
- **Spreadsheet:** Score cells can contain non-numeric values: "chasam" (barrier -- student blocked from exam, causes #VALUE! errors) and "ikuv" (delay -- score pending).
- **Demo:** `SubjectGrades` model is numeric-only. No way to represent barrier/delay status in the type system or UI.
- **To close:** Extend `SubjectGrades` to support string values or add a status field, and update ScoreCell to render special values.

### N-5: Third Categorization Scheme (Questionnaire-Based)
- **Priority:** P1 (Important)
- **Status:** Not implemented
- **Spreadsheet:** Uses 3 categorization schemes at different periods: exam-missing, failure-count, and questionnaire-to-correct/complete (e.g., "3 questionnaires to correct", "4 questionnaires to correct").
- **Demo:** Supports exam-missing and failure-count schemes via toggle. The questionnaire-based scheme is absent.
- **To close:** Add a third toggle option to RikuzMatrix and implement questionnaire counting logic.

### N-6: Export Functionality
- **Priority:** P2 (Minor)
- **Status:** Not implemented (UI-only)
- **Spreadsheet:** N/A (it is the spreadsheet).
- **Demo:** RankingView has an export dropdown with Excel/CSV/PDF options, but clicking them does nothing. No actual export logic implemented.
- **To close:** Implement file generation using libraries like xlsx or jsPDF, or remove the dropdown to avoid confusion.

### N-7: Rare Elective Subjects (10 missing)
- **Priority:** P3 (Minor)
- **Status:** Not implemented
- **Spreadsheet:** Contains 35 total subjects. The demo has 25.
- **Missing subjects:** Italian, Chinese, Philosophy, Extended Bible Studies, Music, Music Recital, Dance, Theater, Mada"ch Final Project, Biology Final Project.
- **Impact:** These subjects appear in only 1-2 classes each and are low-frequency. Acceptable for a demo.
- **To close:** Add these subjects to the data model and class elective pools if full fidelity is needed.

### N-8: Data Entry / Edit Capability
- **Priority:** P3 (Minor)
- **Status:** Not implemented
- **Spreadsheet:** Primary function is data entry by the Bagrut coordinator.
- **Demo:** Fully read-only. Expected for a prototype.
- **To close:** Would require backend infrastructure. Out of scope for demo.

---

## 4. Mock Data Quality Assessment

### MD-1: Student Count Inconsistency
- **Priority:** P2 (Minor)
- **Description:** Multiple conflicting student counts in the app:
  - `CLASS_SIZES` sum = 504 students (verified: 33+35+31+34+32+36+30+36+29+34+32+13+35+31+33+30 = 504)
  - Dashboard body text: "504 students in 16 classes"
  - Header badge: hardcoded "503" in Header.tsx (line 36)
  - Spreadsheet: ~509 students total
- **Impact:** Minor confusion but the 503 vs 504 discrepancy is a clear bug.
- **To close:** Fix Header.tsx to use dynamic student count from `getAllStudents().length` instead of hardcoded "503".

### MD-2: Excellence Tier Aleph (96+) Unreachable
- **Priority:** P2 (Minor)
- **Description:** The live app shows 0 students with Excellence 1-Aleph (96+). The `generateScore()` function caps regular students at 90-100 range only 15% of the time, and the weighted average formula dilutes across 7 subjects making a 96+ average extremely rare. The spreadsheet shows 255 -> 197 -> 196 -> 174 honors students, with the excellence threshold starting at 85+.
- **Impact:** The excellence distribution is skewed -- 0% at top tier vs. realistic data.
- **To close:** Increase the proportion of excellent scores or add dedicated high-performing student archetypes to ensure some students reach 96+.

### MD-3: Weighted Average Formula Inconsistency for Missing Subjects
- **Priority:** P2 (Minor)
- **Description:** `computeWeightedAverage()` in mock-data.ts uses a variable denominator (only counting subjects with scores > 0), but `calculateWeightedAverage()` in utils.ts uses a fixed denominator (always counts all 7 subjects, substituting 0 for missing). Students missing core subjects get different averages depending on which function is used. The WhatIfProjections page uses its own inline calculation.
- **Impact:** Three different weighted average calculation paths may produce inconsistent results.
- **To close:** Consolidate to a single calculation function used everywhere.

---

## 5. UI/UX Observations

### UI-1: Trend Chart Y-Axis Domains Mismatched
- **Priority:** P2 (Minor)
- **Description:** TrendCharts.tsx hardcodes Y-axis domains that don't match the data:
  - Eligibility chart: `domain={[65, 85]}` but data ranges 92.4% - 96.8% (chart shows correct values but axis scale is wrong)
  - Excellence chart: `domain={[15, 25]}` but data ranges 34.6% - 43.8%
  - Math 5-unit chart: `domain={[28, 42]}` -- this one is close but still slightly off
- **Impact:** Charts display correctly via Recharts auto-scaling override but the hardcoded domains are misleading if they were to take effect.
- **To close:** Either remove the domain prop (let Recharts auto-scale) or set correct ranges.

### UI-2: RankingView Risk Filter Shows Levels 4 and 5
- **Priority:** P3 (Cosmetic)
- **Description:** The RankingView filter dropdown offers risk levels 1-5, but the data model only generates levels 1-3. Selecting level 4 or 5 returns 0 results.
- **To close:** Remove levels 4 and 5 from the filter, or implement 5-level risk as noted in P-1.

### UI-3: ClassHeader Period Selector Disconnected
- **Priority:** P2 (Minor)
- **Description:** The period dropdown in ClassHeader.tsx stores its selection in local state (`useState`) but this value is never passed to GradeGrid or any other component. Changing the period has no visible effect on the class view.
- **To close:** Either connect it to filter the grade data by period, or remove the selector.

### UI-4: Settings Page is Placeholder
- **Priority:** P3 (Cosmetic)
- **Description:** Settings page shows only a placeholder message "Settings page will be displayed here". This is expected for a demo.
- **To close:** Implement or remove from navigation.

### UI-5: Students Nav Link Goes to Dashboard
- **Priority:** P3 (Cosmetic)
- **Description:** The sidebar "Students" link (`/students`) routes to `SchoolDashboard` (same as `/`), not to a dedicated student list page. This is a confusing UX pattern.
- **To close:** Either create a dedicated students page or remove the link from navigation.

---

## 6. Priority Recommendations

### P0 -- Fix Immediately (0 items)
No blocking issues found. All Critical gaps from previous reports are resolved.

### P1 -- Should Fix (5 items)
| # | Item | Category | Effort |
|---|------|----------|--------|
| N-1 | Physics 4-component weight model | Data accuracy | Medium |
| N-2 | Per-student longitudinal trajectory view | Feature gap | High |
| N-3 | Cumulative percentage rows in rikuz | Feature gap | Low |
| N-4 | Special score values (chasam/ikuv) | Data model | Medium |
| N-5 | Third categorization scheme (questionnaire-based) | Feature gap | Medium |

### P2 -- Nice to Have (10 items)
| # | Item | Category | Effort |
|---|------|----------|--------|
| P-2 | Full year-over-year comparison page | Feature gap | Medium |
| P-3 | 5th exam period (projected final) | Data model | Low |
| P-4 | Variable-denominator average in What-If | Calculation | Low |
| P-5 | ClassHeader period selector connection | UX bug | Low |
| N-6 | Export functionality | Feature gap | Medium |
| MD-1 | Student count inconsistency (503 vs 504) | Data bug | Trivial |
| MD-2 | Excellence Tier Aleph unreachable | Mock data | Low |
| MD-3 | Weighted average formula inconsistency | Data quality | Low |
| UI-1 | Trend chart Y-axis domains | UI bug | Trivial |
| UI-3 | ClassHeader period selector disconnected | UX bug | Low |

### P3 -- Low Priority / Cosmetic (9 items)
| # | Item | Category | Effort |
|---|------|----------|--------|
| P-1 | Risk level model (3 vs 5 levels) | Design decision | Medium |
| N-7 | 10 rare elective subjects missing | Data completeness | Medium |
| N-8 | Data entry capability | Feature scope | Very High |
| UI-2 | Risk filter shows nonexistent levels 4-5 | UI bug | Trivial |
| UI-4 | Settings page placeholder | Incomplete | Low |
| UI-5 | Students link goes to dashboard | UX | Low |
| C-1 | Bold styling for risk levels 2 and 4 | Cosmetic | Trivial |
| C-3 | School contact info not displayed | Cosmetic | Trivial |
| C-4 | Class sizes differ from spreadsheet | Cosmetic | Low |
| C-5 | Teacher names don't match spreadsheet | Cosmetic | Trivial |

---

## 7. Gap Count Summary

| Category | Count |
|----------|-------|
| **Fully Implemented** | 17 features verified |
| **Partially Implemented** | 5 features |
| **Not Yet Implemented** | 8 features |
| **Mock Data Issues** | 3 issues |
| **UI/UX Issues** | 5 issues |
| **Total Gaps** | **21** |

### By Priority

| Priority | Count | Description |
|----------|-------|-------------|
| **P0 (Critical)** | 0 | None -- all critical gaps resolved |
| **P1 (Important)** | 5 | Should fix for production readiness |
| **P2 (Nice to Have)** | 10 | Improve quality and completeness |
| **P3 (Low/Cosmetic)** | 9 | Polish and edge cases |
| **Total** | **24** | |

### Comparison with Previous Reports

| Severity | V1 Report | V2 Report | V3 Report | Trend |
|----------|-----------|-----------|-----------|-------|
| **Critical** | 8 | 0 | 0 | Stable |
| **Important** | 26 | 5 | 5 | Stable (same 5 from V2) |
| **Minor** | 8 | 6 | 8 | +2 (new issues found) |
| **Cosmetic** | 5 | 3 | 5 | +2 (new issues found) |
| **Mock Data** | -- | -- | 3 | New category |
| **UI/UX** | -- | -- | 5 | New category |
| **Total** | **47** | **14** | **24** | +10 (deeper analysis) |

**Note:** V3 gap count is higher than V2 because this analysis introduced new categories (Mock Data Issues, UI/UX Observations) and performed live browser verification that uncovered issues not visible from code review alone (e.g., student count discrepancy, chart domain mismatch, unreachable excellence tier).

---

## 8. Verification Methodology

1. **Code review:** Read all source files under src/types, src/data, src/lib, src/components, src/pages (30+ files).
2. **Browser automation:** Navigated the live app at localhost:5174, read page accessibility trees for Dashboard, Class Grade Grid (class-1), Analytics/Projections, Ranking, and Challenging Students pages.
3. **Cross-reference:** Compared every spreadsheet feature documented in spreadsheet-inventory.md against both code implementation and live UI rendering.
4. **Data validation:** Verified mock data generation logic (RNG seed, score distributions, Sofi formulas, eligibility determination) against spreadsheet formulas.
5. **Consistency checks:** Compared student counts, eligibility rates, and year-over-year values between different pages and components.
