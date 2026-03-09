# Demo Completion Roadmap

**Date:** 2026-03-09
**Status:** Planning — items to be selected for implementation
**Source:** Cross-referenced from PRODUCT-SPEC.md, GAP-ANALYSIS.md, and full codebase review

---

## How to Use This Document

Each item has a unique ID (e.g., `T1-03`). Pick items by ID to queue them for implementation. Effort estimates assume familiarity with the codebase.

**Effort scale:** Trivial (<30 min), Low (1-2h), Medium (half day), High (1-2 days), Very High (3+ days)

---

## Tier 1: Quick Fixes

Low effort, high polish. Fix these first to eliminate visible bugs and UX confusion.

| ID | Item | Effort | File(s) | Details |
|----|------|--------|---------|---------|
| T1-01 | Fix student count bug | Trivial | `src/components/layout/Header.tsx` | Header hardcodes "503" — should use `getAllStudents().length` (504) |
| T1-02 | Fix trend chart Y-axis domains | Trivial | `src/components/dashboard/TrendCharts.tsx` | Hardcoded domains are wrong: eligibility `[65,85]` for 92-97% data, excellence `[15,25]` for 34-44% data. Remove `domain` props or set correct ranges |
| T1-03 | Remove risk levels 4-5 from ranking filter | Trivial | `src/pages/RankingView.tsx` | Filter dropdown offers risk levels 1-5 but data only contains 1-3. Selecting 4 or 5 returns 0 results |
| T1-04 | Fix "Students" nav link | Trivial | `src/components/layout/Sidebar.tsx`, `src/App.tsx` | `/students` routes to SchoolDashboard (same as `/`). Either create a student list page or remove the nav link |
| T1-05 | Connect or remove ClassHeader period selector | Low | `src/components/grades/ClassHeader.tsx`, `src/pages/ClassGradeGrid.tsx` | Period dropdown in class view stores selection in local state but never passes it to GradeGrid. Changing the period has no effect |
| T1-06 | Consolidate weighted average functions | Low | `src/data/mock-data.ts`, `src/lib/utils.ts`, `src/pages/WhatIfProjections.tsx` | Three different calculation paths: `computeWeightedAverage()` (variable denominator), `calculateWeightedAverage()` (fixed denominator), and inline in WhatIfProjections. Unify to one function |
| T1-07 | Make Aleph tier reachable in mock data | Low | `src/data/mock-data.ts` | 0 students reach 96+ weighted average. Increase proportion of high scores or add dedicated high-performing archetypes so some students reach Aleph tier |

---

## Tier 2: Core Data Accuracy

Makes the demo trustworthy. These fix incorrect or incomplete data representations.

| ID | Item | Effort | File(s) | Details |
|----|------|--------|---------|---------|
| T2-01 | Add cumulative % rows to rikuz matrix | Low | `src/components/dashboard/RikuzMatrix.tsx` | Spreadsheet shows cascading cumulative percentages: "0 missing" %, "0-1 missing" %, "0-2 missing" %, etc. Currently only per-category counts/percentages are shown |
| T2-02 | Add 5th exam period (projected final) | Low | `src/data/mock-data.ts` | Spreadsheet tracks 5 periods: After Summer 2023, After Summer 2024, After Winter 2025, After Winter 2025 + Corrections, After Summer 2025 (projected). Demo has 4 |
| T2-03 | Variable-denominator in What-If projections | Low | `src/pages/WhatIfProjections.tsx` | What-If uses fixed denominator (all 7 core subjects always counted). Should match mock-data.ts variable-denominator approach that skips missing subjects |
| T2-04 | Physics 4-component weight model | Medium | `src/data/mock-data.ts`, `src/types/index.ts` | Physics uses wrong 30/70 split. Should be `361*0.30 + 376*0.15 + 283*0.30 + 371*0.25`. Extend `Subject` type to support multi-component weight models (similar to Math/English) |
| T2-05 | Special score values (chasam/ikuv) | Medium | `src/types/index.ts`, `src/data/mock-data.ts`, `src/components/grades/ScoreCell.tsx` | Score cells can only hold numbers. Need to support "chasam" (barrier — student blocked from exam) and "ikuv" (delay — score pending). Extend `SubjectGrades` to support string values or add a status field. Update ScoreCell to render special values with appropriate styling |
| T2-06 | Third rikuz categorization scheme (questionnaire-based) | Medium | `src/components/dashboard/RikuzMatrix.tsx`, `src/types/index.ts` | Spreadsheet uses 3 categorization schemes. Demo supports exam-missing and failure-count. Missing: questionnaire-to-correct/complete scheme ("1 questionnaire to correct", "2 questionnaires to correct", etc.). Add third toggle option |

---

## Tier 3: Key Missing Features

Biggest demo impact. These fill major feature gaps visible to stakeholders.

| ID | Item | Effort | File(s) | Details |
|----|------|--------|---------|---------|
| T3-01 | Per-student longitudinal trajectory view | High | New component, `src/pages/StudentDetail.tsx` or `src/pages/ClassGradeGrid.tsx` | Core tracking feature from spreadsheet rows ~99-131. Show each student's color-coded status (green/yellow/red) across exam periods as a timeline. E.g., "After Summer '23: ✓ → After Winter '25: ⚠ → After Corrections: ✓". Add to StudentDetail page and/or as a section in ClassGradeGrid |
| T3-02 | Year-over-year comparison page | Medium | New page + route | Dedicated page replacing the spreadsheet's "Hashvaa" sheet. Full table with all metrics: eligibility rate, English 4-unit count/%, English 5-unit count/%, Math 4-unit count/%, Math 5-unit count/%, total student counts, full eligible counts, honors count/%. Currently only 3 mini trend charts on dashboard |
| T3-03 | Excellence overview page | Medium | New page + route | Dedicated view showing all 6 tiers (ALEPH through NONE) with student counts, percentages, per-class breakdown, and drill-down to student lists. Currently excellence data only appears in grid badges, KPI cards, and QuickActions sidebar |
| T3-04 | Overall average including electives | Medium | `src/data/mock-data.ts`, `src/pages/WhatIfProjections.tsx` | Add secondary metric from gamification sheet: `Overall Average = (CoreWeightedSum + ElectiveSofi * 5) / (CoreDenominator + 5)`. Display alongside the core-only weighted average |
| T3-05 | Export functionality | Medium | `src/pages/RankingView.tsx`, new utility | Export dropdown exists but does nothing. Implement actual Excel (.xlsx via xlsx library), CSV, and PDF (via jsPDF) generation for the ranking table, class grid, and student detail |
| T3-06 | English/Math unit-level completion rates view | Medium | New page or dashboard section | Dedicated view showing 3/4/5-unit distribution for Math and English: count and percentage at each level, with year-over-year trend data |

---

## Tier 4: Admin Configuration

Makes the demo interactive and impressive for stakeholders. They can tweak thresholds and see results in real time.

### T4-00: Foundation — Config Context/Store

**Effort:** Medium
**Files:** New `src/contexts/ConfigContext.tsx` or Zustand store, refactor consumers

Create a React context (or Zustand store) holding all configurable business rule values. Initialize with current hardcoded defaults. Persist to localStorage so settings survive page refreshes. All items below (T4-01 through T4-12) depend on this foundation.

Build the Settings page shell (`src/pages/Settings.tsx`) with tabbed navigation replacing the current placeholder.

### Configuration Items

All effort estimates below assume T4-00 is completed first.

| ID | Setting | Effort | Currently hardcoded in | Details |
|----|---------|--------|----------------------|---------|
| T4-01 | Passing threshold | Low | `colors.ts` → `getScoreCellStyle()` | Default: 55. Number input. Changing it ripples into: score color coding (red font), eligibility calculations, and risk auto-suggestion |
| T4-02 | Excellence tier thresholds | Low | `mock-data.ts` → `determineExcellenceTier()` | Defaults: ALEPH ≥96, BET ≥90, BORDER_BET ≥86, GIMEL ≥85, BORDER_GIMEL ≥81. Table of 5 cutoffs with number inputs. Border tiers editable by coordinator |
| T4-03 | Score color coding thresholds | Low | `colors.ts` → `getScoreCellStyle()` | Defaults: failing <55, borderline 52-53, threshold 54, excellence ≥90. Four number inputs with live color preview swatches. Failing threshold linked to T4-01 |
| T4-04 | Risk level auto-suggestion rules | Low | `mock-data.ts` → `determineRiskLevel()` | Defaults: 0 failures = level 1, 1 failure = level 2, 2+ failures = level 3, avg <65 escalates level 2 → 3. Adjustable failure count thresholds + weighted average cutoff |
| T4-05 | Subject weight formulas | Medium | `mock-data.ts` → `subjects[]` array | Per-subject editor: list of exam components with weight percentage inputs that must sum to 100%. Support for weight variants (e.g., CS 70/30 vs 76/24) |
| T4-06 | Weighted average — subject inclusion | Low | `mock-data.ts` → `computeWeightedAverage()` | Checklist of which subjects to include in weighted average + per-subject unit weight inputs. Toggle for variable denominator (skip missing subjects) |
| T4-07 | Eligibility determination rules | Medium | `mock-data.ts` → `determineEligibility()` | Checklist of mandatory subjects that must be passed + additional requirements (General Studies, PE, Community Service). Toggle for "full Bagrut despite missing exam" policy |
| T4-08 | What-If projection defaults | Low | `WhatIfProjections.tsx` | Default offset (-5), student inclusion criteria, show projected excellence tier toggle, allow per-student offset override |
| T4-09 | Class exclusion rules | Low | `mock-data.ts` → `isSpecial` flag, `RikuzMatrix.tsx` | Per-class toggles: exclude from quality metrics, exclude from school-wide ranking, exclude from year-over-year comparison. Default: only class 12 excluded |
| T4-10 | Exam period definitions | Medium | `mock-data.ts` → `examPeriods[]` | Editable list of period names with display ordering, add/remove periods, set active period |
| T4-11 | Challenging student categories | Low | `ChallengingStudents.tsx` | Editable category list: name, color, display order. Default 3 categories. Allow adding custom categories (up to 10) |
| T4-12 | Statistics denominator rules | Low | `RikuzMatrix.tsx`, `KPICards.tsx` | Toggle between "Quality" denominator (excluding special ed classes) and "All students". Both values always calculated — this controls which is shown as primary |

---

## Tier 5: Workflow Features

Adds operational depth. These are features a real coordinator (Sarit) would use daily.

| ID | Item | Effort | File(s) | Details |
|----|------|--------|---------|---------|
| T5-01 | Student notes with timestamps and action items | Medium | `src/types/index.ts`, `src/pages/StudentDetail.tsx` | Current notes are basic text with author/date. Add: time-stamped entries with author attribution, action items with assignee and due date, status tags ("at risk", "not functioning", "improvement"), period-specific annotations |
| T5-02 | Staff assignment UI | Medium | `src/pages/ChallengingStudents.tsx`, new component | Mock data assigns staff but no UI to manage it. Add: reassignment dropdown per student card, assignment history view, "My Assigned Students" filtered view for each staff member |
| T5-03 | Intervention tracking | High | New components, `src/pages/StudentDetail.tsx` | Full intervention log: each conversation, meeting, or action recorded with date and outcome. Outcome tracking (did student improve?). Escalation path suggestions (Sarit → Hila). Period-over-period trajectory indicator |
| T5-04 | Period transition logic | High | New workflow, multiple files | When activating a new exam period: create EligibilitySnapshot for every student, prompt coordinator to review risk levels, prompt review of challenging students list, recalculate all aggregations, freeze previous period data |
| T5-05 | Corrections process | High | `src/types/index.ts`, `src/data/mock-data.ts`, new UI | Track both original and corrected scores per student. Keep the higher of the two. Define correction window (tied to "after corrections" period). Show override indicator in grade grid |

---

## Tier 6: Polish & Completeness

Final polish. These round out the demo but are lower priority.

| ID | Item | Effort | File(s) | Details |
|----|------|--------|---------|---------|
| T6-01 | Missing navigation sub-views | High | Multiple new pages + routes | ~8 views from the full nav spec not yet built: Eligibility Summary (dedicated), At-Risk Overview, Class Summary, Class Tracking Grid, Class Notes, Subject-Level Ranking, Subject Performance, Export Center |
| T6-02 | Information density controls | High | `src/components/grades/GradeGrid.tsx`, new UI | Column show/hide configuration, compact mode toggle (reduced row height/font/padding), heatmap overlays for numeric cells, keyboard shortcuts (Tab, arrows, Ctrl+S), saved views (named column configurations like "Math Focus" or "At Risk Only") |
| T6-03 | 10 rare elective subjects | Medium | `src/data/mock-data.ts` | Missing: Italian, Chinese, Philosophy, Extended Bible Studies, Music, Music Recital, Dance, Theater, Mada"ch Final Project, Biology Final Project. These appear in only 1-2 classes each in the real spreadsheet |
| T6-04 | Grade entry mode | Very High | `src/components/grades/GradeGrid.tsx`, backend required | Make the grid editable: click any cell to enter edit mode, Tab to advance, Enter to confirm, arrow keys to navigate, validation on entry (0-100 or special value selection). Significant rework of the read-only TanStack Table |
| T6-05 | Mobile responsiveness | High | All page components | KPI cards stack vertically, rikuz matrix becomes scrollable card list, class grid becomes student list with expandable rows, kanban becomes vertical list with filter tabs, ranking shows essential columns with horizontal scroll |

---

## Summary

| Tier | Items | Total Effort | Focus |
|------|-------|-------------|-------|
| Tier 1: Quick Fixes | 7 | ~1 day | Bug fixes and UX cleanup |
| Tier 2: Core Data Accuracy | 6 | ~2-3 days | Correct data representations |
| Tier 3: Key Missing Features | 6 | ~4-5 days | Major feature gaps |
| Tier 4: Admin Configuration | 13 (incl. foundation) | ~4-5 days | Interactive settings system |
| Tier 5: Workflow Features | 5 | ~5-7 days | Operational depth |
| Tier 6: Polish & Completeness | 5 | ~7-10 days | Final rounding |
| **Total** | **42 items** | **~23-31 days** | |

---

## Selection Template

To queue items for implementation, list the IDs:

```
Selected items: T1-01, T1-02, T1-03, ...
```
