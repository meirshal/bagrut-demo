# Bagrut Tracker: Implementation Plan

**Document Version:** 1.0
**Date:** 2026-03-10
**Status:** Approved for planning
**Source:** Gap Analysis (80 gaps) + Product Specification v1.1
**Scope:** Convert demo SPA to full production system

---

## Overview

This plan organizes the conversion of the Bagrut demo (React SPA with mock data) into a production-grade multi-tenant system across 10 milestones. Every gap identified in the analysis is mapped to at least one ticket. The milestones are ordered to build foundational layers first, then progressively add features, analytics, and production hardening.

**Total tickets:** 78
**Estimated duration:** ~9-12 months with a team of 3-4 engineers

---

## Milestone Summary

| Milestone | Name | Tickets | P0 | P1 | P2 | P3 |
|-----------|------|---------|----|----|----|----|
| M1 | Foundation & Testing | 7 | 1 | 5 | 1 | 0 |
| M2 | Backend Infrastructure | 9 | 4 | 4 | 0 | 1 |
| M3 | Data Model Evolution | 8 | 0 | 3 | 4 | 1 |
| M4 | Core Data Pipeline | 6 | 1 | 3 | 1 | 1 |
| M5 | Period & Lifecycle Management | 6 | 0 | 4 | 2 | 0 |
| M6 | Risk & Intervention | 7 | 0 | 3 | 4 | 0 |
| M7 | Advanced Analytics & Views | 10 | 0 | 3 | 6 | 1 |
| M8 | UI Polish & Fixes | 12 | 0 | 1 | 6 | 5 |
| M9 | Export & Reporting | 5 | 0 | 1 | 1 | 3 |
| M10 | Production Hardening | 8 | 0 | 2 | 5 | 1 |

---

## M1: Foundation & Testing

**Goal:** Establish test infrastructure, CI/CD pipeline, error handling, and environment configuration so all subsequent work is built on a solid foundation.

**Duration estimate:** 3-4 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M1-001 | Set up test framework and initial test suite | Install Vitest (or Jest) + React Testing Library + Playwright for E2E. Write unit tests for all calculation functions (weighted average, Sofi formulas, eligibility determination, risk assignment). Write component tests for KPI cards, RikuzMatrix, and ScoreCell. Acceptance: >80% coverage on `src/lib/` and `src/data/`, CI runs all tests on push. | P0 | XL | Feature | -- | PR-004 |
| M1-002 | Add React ErrorBoundary and global error handling | Wrap each route in an ErrorBoundary component with a user-friendly fallback UI in Hebrew. Add a global unhandled rejection handler. Add try/catch around all data transformation functions. Acceptance: any component crash shows a recoverable error screen, not a blank page. | P1 | M | Improvement | -- | PR-001 |
| M1-003 | Set up CI/CD pipeline | Configure GitHub Actions (or equivalent) with: lint, type-check, unit tests, build, E2E tests. Add branch protection rules requiring passing CI. Add deploy-preview for PRs. Acceptance: every PR gets automated checks; main branch auto-deploys to staging. | P1 | M | Feature | M1-001 | PR-003 |
| M1-004 | Environment configuration and secrets management | Create `.env.example` with all required variables. Set up env-specific configs for dev/staging/production. Use a secrets manager (e.g., Doppler, AWS Secrets Manager) for DB credentials and API keys. Acceptance: `npm run build` works with only `.env` populated; no secrets in source code. | P1 | S | Feature | -- | PR-006 |
| M1-005 | Input validation framework with Zod schemas | Define Zod schemas for all data entities (Student, Grade, Subject, etc.). Create validation middleware for API request/response. Create client-side form validation helpers. Acceptance: every API endpoint validates input; invalid data returns structured error messages. | P1 | M | Feature | -- | PR-010 |
| M1-006 | State management solution (React Query + Zustand) | Install and configure TanStack React Query for server-state (data fetching, caching, invalidation). Install Zustand for complex client-side state (filters, UI preferences). Replace direct mock-data imports with query hooks. Acceptance: all data flows through React Query; loading/error states handled uniformly. | P1 | L | Feature | -- | PR-008 |
| M1-007 | Loading states and skeleton screens | Create skeleton components for GradeGrid, KPICards, RikuzMatrix, RankingView, and StudentDetail. Add Suspense boundaries around each route. Show loading spinners during data fetches. Acceptance: no blank screens during data loading; skeleton matches final layout shape. | P1 | M | Improvement | M1-006 | PR-009 |

---

## M2: Backend Infrastructure

**Goal:** Build the database, API layer, authentication, and authorization systems that all features depend on.

**Duration estimate:** 5-7 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M2-001 | Database schema and persistence layer | Design and implement PostgreSQL schema covering all entities from PRODUCT-SPEC Section 4: School, AcademicYear, Class, Student, StudentEnrollment, Subject, ExamQuestionnaire, SubjectFormula, ExamPeriod, Grade, RiskAssessment, EligibilitySnapshot, Accommodation, Note, Staff, ChallengeAssignment, YearComparison (15+ tables). Use Prisma or Drizzle as ORM. Include seed scripts. Acceptance: all entities created with proper foreign keys, constraints, and indexes; seed data matches current mock data. | P0 | XL | Feature | -- | BE-001 |
| M2-002 | REST API layer | Build a Node.js (Express or Fastify) or Next.js API routes layer with full CRUD endpoints for: students, grades, classes, subjects, risk assessments, notes, eligibility snapshots, year comparisons. Use Zod schemas from M1-005 for validation. Include pagination, sorting, and filtering. Acceptance: all demo views can be served from API instead of mock-data.ts; API documented with OpenAPI/Swagger. | P0 | XL | Feature | M2-001, M1-005 | BE-002 |
| M2-003 | Authentication system | Implement token-based auth (JWT or session cookies) with login/logout, password reset, session timeout. Support email/password initially. Add SSO integration points for future Google Workspace support. Acceptance: all API endpoints require authentication; sessions expire after configurable timeout; login page works in Hebrew RTL. | P0 | XL | Feature | M2-002 | BE-003 |
| M2-004 | Role-Based Access Control (RBAC) | Implement the 6-role permission matrix from PRODUCT-SPEC Section 2.2: Coordinator, Homeroom Teacher, Subject Coordinator, Principal, Counselor, Admin. Add per-class restrictions (homeroom teacher sees own class only), per-subject restrictions (subject coordinator sees own subject only), and per-student restrictions (counselor sees assigned students only). Use row-level security in PostgreSQL where appropriate. Acceptance: each role can only access data per the permission matrix; unauthorized access returns 403. | P0 | L | Feature | M2-003 | BE-004 |
| M2-005 | Audit trail system | Create an immutable append-only audit_log table capturing all data modifications: entity type, entity ID, field changed, old value, new value, changed_by, timestamp, reason. Support filtering by student, user, date range, and action type. 7-year minimum retention policy. Acceptance: every grade change, risk change, and status change is logged; audit log is queryable via API; logs cannot be deleted. | P1 | L | Feature | M2-001, M2-002 | BE-008 |
| M2-006 | Production build and hosting setup | Set up cloud hosting (e.g., Vercel for frontend, Railway/Render for backend, or full AWS/GCP). Configure SSL/TLS, CDN, domain, and DNS. Create staging and production environments. Acceptance: app accessible via HTTPS on a custom domain; staging environment mirrors production. | P1 | M | Feature | M2-002 | PR-007 |
| M2-007 | Data privacy and security compliance | Implement AES-256 encryption at rest for database. Enforce TLS 1.3 for all API traffic. Add consent management scaffolding. Add data export per student for parent requests. Document compliance with Israeli Privacy Protection Law. Acceptance: database encrypted; all traffic over TLS; privacy policy page exists; student data exportable on request. | P1 | L | Feature | M2-001, M2-003 | BE-010 |
| M2-008 | Academic year management | Build the year lifecycle: initialization (create new AcademicYear, roll forward students, create classes), mid-year operations (add/remove students, transfers between classes, unit level changes), year-end finalization (lock, archive, generate comparison data). Acceptance: coordinator can create a new year; students roll forward with historical data preserved; year can be locked as immutable. | P1 | L | Feature | M2-001, M2-002 | BE-009 |
| M2-009 | Ministry of Education API integration points | Create abstraction layer for future integration with Mashov/Manbas APIs. Define interfaces for automatic score retrieval. Implement as a pluggable adapter pattern. Acceptance: integration interface defined; mock adapter works; documentation explains how to connect a real Ministry API. | P3 | L | Feature | M2-002 | BE-012 |

---

## M3: Data Model Evolution

**Goal:** Extend the data model to support special values, multi-component subjects, formula consolidation, and additional data structures required by the production system.

**Duration estimate:** 3-4 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M3-001 | Special score values (chasam/ikuv) support | Extend SubjectGrades type to support non-numeric values: chasam (barrier), ikuv (delay), exempt. Add a `special_value` enum field to the Grade entity. Update ScoreCell component to render special values with appropriate icons and tooltips. Update all calculation functions to gracefully exclude special values. Acceptance: a score cell can display "chasam" or "ikuv" with a warning icon; calculations skip these values without errors. | P1 | M | Feature | M2-001 | DM-001, N-4 |
| M3-002 | Physics 4-component weight model | Extend the Subject weights system to support multi-component formulas beyond 2 (internal/external). Implement the Physics formula: Q361*0.30 + Q376*0.15 + Q283*0.30 + Q371*0.25. Add multi-component generation and display in the grade grid. Acceptance: Physics shows 4 questionnaire columns with correct weights; Sofi calculated correctly. | P1 | M | Feature | -- | DM-002, N-1 |
| M3-003 | Weighted average formula consolidation | Eliminate the three divergent calculation paths (computeWeightedAverage in mock-data.ts, calculateWeightedAverage in utils.ts, inline in WhatIfProjections). Create a single canonical `calculateWeightedAverage()` function used everywhere. Acceptance: one function, one result; all views show identical weighted averages for the same student. | P1 | S | Bug | -- | DM-004, MD-3 |
| M3-004 | Variable denominator fix in What-If | Update WhatIfProjections to use the variable-denominator formula (matching the gamification sheet) instead of fixed denominator. Use the canonical function from M3-003. Acceptance: What-If averages match the gamification sheet logic; students with missing subjects get fair projections. | P2 | S | Bug | M3-003 | DM-003, P-4 |
| M3-005 | Overall average including electives | Implement the "memutza kolel" (overall average) metric that includes elective performance: `(CoreWeightedSum + ElectiveFinal * 5) / (TotalUnits + 5)`. Display in What-If projections and student detail. Acceptance: elective-inclusive average shown alongside core-only average. | P2 | S | Feature | M3-003 | DM-005 |
| M3-006 | Add 5th exam period (projected final) | Add the "After Summer (final)" projected period to the period definitions, bringing the total from 4 to 5 periods. This period represents the projected end-of-year state. Acceptance: period selector shows 5 options; rikuz matrix can display data for all 5 periods. | P2 | S | Feature | -- | DM-006, P-3 |
| M3-007 | Add 10 rare elective subjects | Add the 10 missing subjects to the data model and class elective pools: Italian, Chinese, Philosophy, Extended Bible Studies, Music, Music Recital, Dance, Theater, Mada"ch Final Project, Biology Final Project. Acceptance: all 35 subjects from the spreadsheet are available; classes can be assigned any subject. | P3 | M | Feature | -- | DM-008, N-7 |
| M3-008 | Grade entity with audit fields and manual override | Extend the Grade entity with: special_value enum, is_manual_override flag, override_reason text, original_calculated_score, entered_by/at, updated_by/at fields. Create API endpoints for grade override with reason capture. Acceptance: coordinator can override a calculated score; both original and override are stored; override shows indicator in UI. | P2 | M | Feature | M2-001, M3-001 | DM-010 |

---

## M4: Core Data Pipeline

**Goal:** Enable real data flow: import from xlsx, bulk score import, data entry UI, and CRUD operations on grades.

**Duration estimate:** 4-5 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M4-001 | Real data import from xlsx format | Implement the 5-step xlsx import process from PRODUCT-SPEC Section 9: sheet identification, class sheet parsing (headers, student data, summary rows, tracking grid), rikuz import, hashvaa import, verification step. Support the specific sarit-example.xlsx format. Acceptance: uploading the actual Sheifa xlsx produces correct data in the database; calculated values match the spreadsheet. | P0 | XL | Feature | M2-001, M2-002 | BE-005 |
| M4-002 | Bulk score import (CSV/Excel) | Build a CSV/Excel upload interface for batch score entry after Ministry results are released. Support column mapping, preview before commit, validation (0-100 or special values), and error reporting. Acceptance: coordinator can upload a CSV of scores; valid scores are saved; invalid rows are flagged for correction. | P1 | M | Feature | M2-002, M4-001 | BE-013 |
| M4-003 | Data entry / edit capability in grade grid | Convert the read-only grade grid to support inline editing. Click any cell to enter edit mode. Support Tab navigation between cells, Enter to confirm, Escape to cancel. Validate input (0-100 or special value). Auto-recalculate Sofi and weighted average on each entry. Acceptance: coordinator can click a cell, type a score, Tab to the next cell; Sofi updates instantly; changes are persisted. | P1 | XL | Feature | M2-002 | CF-003, N-8 |
| M4-004 | ExamQuestionnaire and SubjectFormula as first-class entities | Move exam questionnaire codes and subject formulas from hardcoded mock-data.ts arrays into database entities with CRUD API. Build a settings UI for managing formulas (add/edit/deactivate questionnaires and their weights). Acceptance: admin can add a new questionnaire code; changing a weight recalculates affected Sofi scores; formulas are versioned per academic year. | P2 | M | Feature | M2-001, M2-002 | DM-012 |
| M4-005 | Student transfer and departure tracking | Add transfer history, withdrawal fields, and bagrut_track status to the Student entity. Implement the StudentEnrollment junction table. Support mid-year class transfers with date tracking. Acceptance: coordinator can transfer a student between classes; transfer history is preserved; withdrawn students are excluded from eligibility calculations. | P1 | M | Feature | M2-001 | DM-009 |
| M4-006 | Progressive disclosure from grid cells | Clicking a score cell opens a detail popover showing: score history for that questionnaire, manual override option (with reason capture), related notes, and exam period context. Acceptance: clicking any score cell shows history and context; override is possible from the popover; changes are audited. | P2 | M | Improvement | M4-003, M3-008 | UX-009 |

---

## M5: Period & Lifecycle Management

**Goal:** Implement period transitions, the corrections process, eligibility snapshots, and academic year lifecycle management.

**Duration estimate:** 3-4 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M5-001 | EligibilitySnapshot per period | Create the EligibilitySnapshot entity and populate it at each period transition. Store: eligibility status, failure count, questionnaires to correct, missing subjects (JSON list), weighted average, excellence tier, snapshot date. Acceptance: each student has one snapshot per period; snapshots are immutable once the next period begins. | P1 | M | Feature | M2-001 | DM-011 |
| M5-002 | Period transition logic | Implement the full period transition workflow: create EligibilitySnapshots for all active students, prompt risk reassessment, prompt challenging students review, recalculate all rikuz aggregations, freeze previous period data as immutable. Acceptance: coordinator can advance to a new period; snapshots are created; previous period is locked. | P1 | L | Feature | M5-001, M2-005 | CF-001 |
| M5-003 | Corrections process (tikunim ve-hashlamot) | Implement the corrections workflow: students can request retakes, the higher score is kept, corrections have a defined window (the "after winter + corrections" period). Track both original and corrected scores via audit trail. Acceptance: coordinator can enter a correction score; higher score is kept automatically; both scores visible in audit. | P1 | L | Feature | M2-005, M5-002 | CF-002 |
| M5-004 | ClassHeader period selector connected to grid data | Connect the ClassHeader period selector dropdown to actually filter the grade grid data by the selected period. The grid should show period-specific scores and failing counts. Acceptance: selecting a different period in the class header changes the displayed data; "corrections" period shows corrected scores. | P2 | S | Bug | M5-001 | UX-003, P-5 |
| M5-005 | Period comparison side-by-side | Add a comparison mode to the dashboard/rikuz that shows two periods side-by-side with delta columns. Acceptance: coordinator can select two periods and see counts, percentages, and deltas in a single view. | P2 | M | Feature | M5-001 | CF-013 |
| M5-006 | Configurable business rules engine | Build a settings UI for configuring per-school, per-year business rules: passing thresholds, excellence tier thresholds, risk level auto-suggestion parameters, weighted average subject inclusion, eligibility determination rules. Include formula locking per year and impact preview when changing rules mid-year. Acceptance: admin can change the passing threshold; system shows "this would reclassify N students" before confirming; changes are audited. | P1 | L | Feature | M2-001, M2-002 | CF-006 |

---

## M6: Risk & Intervention

**Goal:** Build the risk override system, intervention tracking, staff dashboards, and interactive challenging students management.

**Duration estimate:** 3-4 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M6-001 | Manual risk level override with audit | Allow coordinator to manually override auto-calculated risk levels. Show auto-suggestion alongside manual input. Capture reason for override. Log all changes in audit trail. Acceptance: coordinator sees auto-suggested risk level; can override with a reason; override is logged; RiskBadge shows override indicator. | P1 | M | Feature | M2-002, M2-005 | CF-005 |
| M6-002 | Risk level model expansion (3 to 5 levels) | Add risk levels 4 (excellence risk 1-Bet, weighted average 86-89) and 5 (excellence risk 1-Gimel, weighted average 81-84) to the RiskLevel type. Update RiskBadge to display all 5 levels with correct colors (level 4: red text bold, level 5: peach background). Update the RankingView filter to match available levels. Acceptance: students near excellence thresholds show levels 4 or 5; RiskBadge renders all 5 levels; filter matches data. | P2 | M | Improvement | -- | DM-007, P-1, UX-002 |
| M6-003 | Intervention tracking system | Build an intervention log for each student: record conversations, meetings, and actions with date, participants, and outcome. Track whether students improved after intervention. Support escalation path suggestions (e.g., homeroom teacher -> Sarit -> Hila). Add period-over-period trajectory indicators. Acceptance: staff can add intervention entries; outcomes are tracked; escalation suggestions appear when a student's situation worsens. | P1 | L | Feature | M2-001, M2-002 | CF-004 |
| M6-004 | Notes and action items with full audit trail | Extend the notes system: time-stamped entries, action items with assignee and due date, status tags ("at risk for Bagrut", "not functioning", "improvement"), period-specific annotations. All notes fully audited. Acceptance: staff can create action items; items have assignees and due dates; status tags are filterable. | P2 | M | Feature | M2-001, M2-002 | CF-009 |
| M6-005 | Staff assignment and personal dashboard | Build per-staff filtered views showing their assigned students. Track assignment history. Create a personal dashboard with: my students, pending action items, recent changes for my students. Acceptance: a homeroom teacher logs in and sees only their class; a counselor sees only assigned students; dashboard shows pending items. | P2 | M | Feature | M2-003 | CF-007 |
| M6-006 | Drag-and-drop in Challenging Students Kanban | Add drag-and-drop support between Kanban columns to reclassify challenging students (Especially Challenging, Will Probably Pass, Close Follow-up). Log reclassifications in audit trail. Acceptance: dragging a student card between columns updates their category; change is persisted and audited. | P2 | M | Improvement | -- | CF-008 |
| M6-007 | Notification and alert system | Build an in-app notification system for: borderline score alerts (scores 52-54 entered), threshold-crossing alerts (student drops below 55 or rises above 90), risk reassessment prompts after period transitions. Acceptance: entering a borderline score triggers a notification; coordinator sees alert badges; notifications are dismissible. | P1 | L | Feature | M2-002 | UI-013 |

---

## M7: Advanced Analytics & Views

**Goal:** Build trajectory views, cumulative percentage rows, rikuz drill-down, year-over-year page, subject performance analysis, and per-student what-if projections.

**Duration estimate:** 4-5 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M7-001 | Per-student longitudinal trajectory view | Create a visual timeline showing each student's color-coded status (green/yellow/red) across all exam periods. Display as status dots on a horizontal timeline in the StudentDetail page and as a compact row in the ClassGradeGrid. Acceptance: student detail shows trajectory across all periods; class view shows compact trajectory per student; improving/declining trends are visually distinct. | P1 | L | Feature | M5-001 | UI-001, N-2 |
| M7-002 | Cumulative percentage rows in rikuz matrix | Add cascading cumulative percentage rows to the RikuzMatrix: "0 missing %", "0-1 missing %", "0-2 missing %", "0-3 missing %", etc. Match the spreadsheet's cumulative format. Acceptance: rikuz matrix shows cumulative rows; values match spreadsheet calculations; cumulative percentages are color-coded. | P1 | M | Feature | -- | UI-002, N-3 |
| M7-003 | Third categorization scheme (questionnaire-based) | Add the questionnaire-to-correct/complete scheme as a third toggle option in the RikuzMatrix: "no questionnaires to correct", "1 questionnaire to correct", "2 questionnaires", etc. Implement questionnaire counting logic. Acceptance: three scheme toggle buttons work; questionnaire counts are accurate; scheme matches the corrections period use case. | P1 | M | Feature | -- | UI-003, N-5 |
| M7-004 | Full year-over-year comparison page | Create a dedicated Year-Over-Year comparison page with all 13 metrics from the hashvaa sheet: total students, eligible students, eligibility rate, English 4-unit count/%, English 5-unit count/%, Math 4-unit count/%, Math 5-unit count/%, honors count/%. Display as a structured table with 4+ years and trend charts. Acceptance: all 13 metrics displayed; data matches hashvaa sheet values; trend arrows show direction. | P2 | M | Feature | -- | UI-004, P-2 |
| M7-005 | English/Math completion rates by unit level | Create views showing student distribution by unit level (3/4/5) for both Mathematics and English, with counts, percentages, and year-over-year trends. Acceptance: pie/bar charts show unit level distribution; trends show direction; data is filterable by class. | P2 | M | Feature | -- | UI-005 |
| M7-006 | Excellence dashboard view | Build a dedicated excellence dashboard with per-tier breakdowns (Aleph/Bet/Border-Bet/Gimel/Border-Gimel/None), trending across periods, and threshold alerts for students near tier boundaries. Acceptance: dashboard shows all 6 tiers with counts; students near boundaries are highlighted; trends across periods are visible. | P2 | M | Feature | M5-001 | UI-006 |
| M7-007 | Rikuz cell drill-down | Make rikuz matrix cells clickable. Clicking a cell shows a popover or panel listing all students in that category for that class. Include student name, weighted average, and missing subjects. Acceptance: clicking any count cell shows the student list; students are clickable to navigate to their detail page. | P2 | M | Feature | -- | CF-012 |
| M7-008 | Subject performance cross-class analysis | Create a view for subject coordinators showing their subject's performance across all 16 classes: class averages, failure rates, score distributions, and top/bottom students. Acceptance: selecting a subject shows per-class comparison; outlier classes are highlighted; data is period-aware. | P2 | L | Feature | -- | CF-015 |
| M7-009 | Per-student what-if projection | Add an individual What-If projection tool to the StudentDetail page. Allow adjusting projected scores for each missing subject and see the impact on weighted average and eligibility in real time. Acceptance: student detail has a "What-If" tab; adjusting a projected score recalculates instantly; results show current vs. projected. | P2 | M | Feature | -- | CF-011 |
| M7-010 | Subject-level ranking view | Add per-subject ranking views showing all students ranked by a specific subject's score across all classes. Currently only weighted-average ranking exists. Acceptance: ranking page has a subject selector; selecting a subject shows students ranked by that subject's score; filters work. | P3 | M | Feature | -- | CF-014 |

---

## M8: UI Polish & Fixes

**Goal:** Fix all UI/UX issues, chart problems, navigation gaps, column visibility, compact mode, keyboard shortcuts, and data quality issues.

**Duration estimate:** 3-4 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M8-001 | Fix trend chart Y-axis domains | Remove or correct the hardcoded Y-axis domain props in TrendCharts.tsx. Eligibility chart domain [65,85] should be ~[90,100], excellence chart domain [15,25] should be ~[30,45], math 5-unit domain [28,42] is close but slightly off. Either let Recharts auto-scale or set correct ranges. Acceptance: all three charts show data within the visible axis range; no clipping or misleading scales. | P2 | S | Bug | -- | UX-001, UI-1 |
| M8-002 | Fix student count inconsistency | Replace the hardcoded "503" in Header.tsx with a dynamic count from `getAllStudents().length`. Ensure dashboard body text and header badge show the same number. Acceptance: header and dashboard show the same student count; count updates when students are added/removed. | P2 | S | Bug | -- | DQ-001, MD-1 |
| M8-003 | Fix non-matriculation student denominator | Clarify and fix the denominator discrepancy (503 vs 509) based on how non-matriculation students are counted. Ensure eligibility percentages use the correct denominator consistently. Acceptance: eligibility percentage denominator is consistent across all views; non-matric exclusion logic is documented. | P2 | S | Bug | -- | DQ-006 |
| M8-004 | Fix Students nav link | Either create a dedicated Students page (student roster with search and filters) or remove the Students link from the sidebar navigation. The current link routes to SchoolDashboard which is confusing. Acceptance: Students link leads to a useful page or is removed from nav. | P3 | S | Bug | -- | UX-004, UI-5 |
| M8-005 | Settings page implementation | Replace the Settings placeholder with a functional settings page. Include sections for: business rules, academic year management, class configuration, subject/formula management, user management, data import/export, audit log viewer. Acceptance: settings page has organized sections; coordinator and admin roles see appropriate sections. | P2 | L | Feature | M5-006 | UX-004 (UI-4 in GAP) |
| M8-006 | Navigation structure completion | Implement missing sub-views from PRODUCT-SPEC navigation tree: Class Summary, Class Tracking Grid, Class Notes, Risk Assessment History (in student detail), My Assigned Students, Intervention Log, Trend Analysis (as separate page), Export Center. Acceptance: all navigation items from the spec are accessible; empty states shown for views without data. | P2 | L | Feature | -- | UX-007 |
| M8-007 | Configurable column visibility in grade grid | Add a column visibility control panel to the grade grid. Allow users to show/hide columns. Support saved views as named column configurations (e.g., "Math Focus", "At Risk Only", "All Subjects"). Acceptance: column picker shows all available columns; toggling hides/shows columns; saved views persist across sessions. | P2 | M | Feature | -- | UI-008 |
| M8-008 | Compact mode toggle | Add a toggle that reduces row height, font size, and padding in the grade grid to maximize visible data density. Preserves the spreadsheet-like information density that Sarit values. Acceptance: compact mode shows significantly more rows on screen; toggle persists across sessions; all data remains readable. | P3 | S | Improvement | -- | UI-009 |
| M8-009 | Keyboard shortcuts for power users | Implement full keyboard navigation in the grade grid: Tab to advance cells, arrow keys for navigation, Enter to confirm, Escape to cancel edit, Ctrl+S to save. Add a keyboard shortcut overlay (accessible via "?"). Acceptance: a user can enter scores using only the keyboard; shortcut overlay lists all available shortcuts. | P2 | M | Feature | M4-003 | UI-011 |
| M8-010 | Bold styling for risk levels 2 and 4 | Add bold font weight to RiskBadge for risk levels 2 and 4, matching the spreadsheet's bold styling convention. Acceptance: levels 2 and 4 display with bold text in all views. | P3 | S | Bug | M6-002 | UX-005 |
| M8-011 | School contact info display | Display school contact information (phone, fax, email, website) from the spreadsheet in an appropriate location (settings page, header tooltip, or footer). Acceptance: school contact info is visible and matches the spreadsheet data. | P3 | S | Improvement | -- | UX-006 |
| M8-012 | Mock data calibration improvements | Fix Excellence Tier Aleph (96+) being unreachable by adding high-performing student archetypes. Adjust class sizes to match spreadsheet. Use actual teacher names from spreadsheet. Calibrate score distributions to match real demographics. Acceptance: at least 2-3 students reach 96+ weighted average; class sizes and teacher names match spreadsheet when using seed data. | P3 | M | Bug | -- | DQ-002, DQ-003, DQ-004, DQ-005, MD-2 |

---

## M9: Export & Reporting

**Goal:** Implement Excel/CSV/PDF export, print-optimized layouts, and scheduled report generation.

**Duration estimate:** 2-3 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M9-001 | Excel/CSV export implementation | Replace the non-functional export dropdown with working export logic. Implement Excel (.xlsx) generation using SheetJS/xlsx library. Implement CSV export. Support filtered/sorted data export (export what you see). Acceptance: clicking Excel/CSV download buttons produces correct files; filtered data exports correctly; Hebrew characters render properly in Excel. | P1 | L | Feature | -- | BE-006, N-6 |
| M9-002 | PDF report generation | Implement formatted PDF reports using jsPDF or a server-side renderer: class report (per homeroom teacher), student report card, school summary report, year-over-year comparison report. RTL Hebrew layout in PDFs. Acceptance: each report type generates a properly formatted PDF; Hebrew text renders correctly; reports are printable. | P2 | L | Feature | M2-002 | BE-006 |
| M9-003 | Print-optimized layouts | Add print CSS (@media print) for all major views: grade grid, student detail, rikuz matrix, ranking view. Ensure proper page breaks, headers, and footers. Acceptance: Ctrl+P produces clean printed output for each major view; no overlapping content or cut-off columns. | P3 | M | Feature | -- | UI-012 |
| M9-004 | Scheduled report generation and email | Build a scheduled job system that auto-generates and emails reports after each exam period. Configurable recipients per report type. Acceptance: coordinator can schedule a report; reports are generated and emailed at the configured time; failed sends are retried. | P3 | M | Feature | M9-001, M9-002, M2-002 | BE-014 |
| M9-005 | What-If scenario save and compare | Allow saving What-If projections as named scenarios. Support comparing two scenarios side-by-side. Acceptance: coordinator can save a scenario with a name; comparing two scenarios shows deltas; scenarios persist across sessions. | P3 | M | Feature | M2-001 | CF-010 |

---

## M10: Production Hardening

**Goal:** Performance optimization, monitoring, mobile responsiveness, accessibility, multi-tenant support, backup, and localization.

**Duration estimate:** 4-6 weeks

| ID | Title | Description | Priority | Size | Label | Dependencies | Gap IDs |
|----|-------|-------------|----------|------|-------|--------------|---------|
| M10-001 | Performance optimization | Benchmark and optimize: page load <2s for 500 students, grade entry response <200ms, dashboard refresh <3s, ranking sort <1s. Optimize GradeGrid for large datasets (virtualization with TanStack Virtual). Support 50 concurrent users. Acceptance: all performance targets met under load testing; GradeGrid handles 500+ rows smoothly. | P2 | L | Improvement | M2-002 | PR-005 |
| M10-002 | Logging and monitoring infrastructure | Set up Sentry for error tracking. Add structured logging (pino or winston) to the backend. Configure uptime monitoring for 99.5% SLA during school hours (7:00-20:00 IST). Add performance monitoring (response times, error rates). Acceptance: errors appear in Sentry within 1 minute; uptime is monitored; alerts fire on outages. | P1 | M | Feature | M2-002 | PR-002 |
| M10-003 | Mobile responsiveness | Implement responsive layouts for all views: KPI cards stack vertically, grade grid becomes expandable student list, student detail uses card-based layout, Kanban becomes vertical list with filter tabs. Acceptance: app is usable on mobile devices (320px+); no horizontal overflow; touch targets are 44px+. | P2 | L | Improvement | -- | UI-007 |
| M10-004 | WCAG AA contrast compliance | Audit all colors against WCAG AA contrast ratios. Adjust spreadsheet-derived colors that fail compliance (especially light backgrounds with colored text). Ensure all color-coded information has a non-color alternative (text labels, icons). Acceptance: all text meets WCAG AA contrast ratios; color is never the sole indicator; automated accessibility scan passes. | P2 | M | Improvement | -- | UX-008 |
| M10-005 | Multi-school (multi-tenant) support | Implement full multi-tenant architecture: data isolation per school (schema or row-level), independent configuration (subjects, formulas, periods), shared Ministry subject catalog, per-school branding (name, logo). Acceptance: two schools can coexist in the system with fully isolated data; admin can switch between schools; each school has its own configuration. | P2 | XL | Feature | M2-001, M2-003 | BE-007 |
| M10-006 | Backup and disaster recovery | Configure daily full backups, hourly incrementals, and point-in-time recovery (30-day window). Set up monthly automated restore verification. RPO=1hr, RTO=4hr. Add user-triggered full data export. Acceptance: backup runs automatically; restore from backup is verified monthly; RPO and RTO targets are documented and tested. | P2 | M | Feature | M2-001 | BE-011 |
| M10-007 | Localization/i18n framework | Set up an i18n framework (react-intl or i18next) with Hebrew as primary and English as secondary language. Support Hebrew calendar display. Ensure proper Israel timezone (Asia/Jerusalem) formatting. Acceptance: all UI strings are externalized; language can be switched to English; dates show Hebrew calendar format by default. | P1 | M | Feature | -- | UI-014 |
| M10-008 | Heatmap overlays for grade grid | Add optional color gradient overlays on numeric cells for visual pattern recognition. Toggle on/off per user preference. Use accessible color gradients (blue-to-red or similar). Acceptance: heatmap toggle adds color gradients to score cells; patterns are visually apparent; toggle persists across sessions. | P3 | M | Feature | -- | UI-010 |

---

## Gap Coverage Matrix

Every gap from the 80-gap analysis is mapped below. Gaps may appear in multiple tickets if they span concerns.

| Gap ID | Gap Title | Ticket(s) |
|--------|-----------|-----------|
| BE-001 | Database and Persistence Layer | M2-001 |
| BE-002 | REST/GraphQL API Layer | M2-002 |
| BE-003 | Authentication and Authorization System | M2-003 |
| BE-004 | Role-Based Access Control (RBAC) | M2-004 |
| BE-005 | Data Import from xlsx Format | M4-001 |
| BE-006 | Data Export (Excel, CSV, PDF) | M9-001, M9-002 |
| BE-007 | Multi-School (Multi-Tenant) Support | M10-005 |
| BE-008 | Audit Trail System | M2-005 |
| BE-009 | Academic Year Management | M2-008 |
| BE-010 | Data Privacy and Security Compliance | M2-007 |
| BE-011 | Backup and Disaster Recovery | M10-006 |
| BE-012 | Ministry of Education API Integration | M2-009 |
| BE-013 | Bulk Score Import | M4-002 |
| BE-014 | Scheduled Report Generation and Email | M9-004 |
| DM-001 | Special Score Values (Chasam/Ikuv) | M3-001 |
| DM-002 | Physics 4-Component Weight Model | M3-002 |
| DM-003 | Variable Denominator Fix in What-If | M3-004 |
| DM-004 | Weighted Average Formula Consolidation | M3-003 |
| DM-005 | Overall Average Including Electives | M3-005 |
| DM-006 | 5th Exam Period (Projected Final) | M3-006 |
| DM-007 | Risk Level Model (3 vs 5 Levels) | M6-002 |
| DM-008 | 10 Rare Elective Subjects Missing | M3-007 |
| DM-009 | Student Transfer and Departure Tracking | M4-005 |
| DM-010 | Grade Entity with Audit Fields | M3-008 |
| DM-011 | EligibilitySnapshot per Period | M5-001 |
| DM-012 | ExamQuestionnaire and SubjectFormula Entities | M4-004 |
| CF-001 | Period Transition Logic | M5-002 |
| CF-002 | Corrections Process (Tikunim veHashlamot) | M5-003 |
| CF-003 | Data Entry / Edit Capability | M4-003 |
| CF-004 | Intervention Tracking System | M6-003 |
| CF-005 | Manual Risk Level Override with Audit | M6-001 |
| CF-006 | Configurable Business Rules Engine | M5-006 |
| CF-007 | Staff Assignment and Personal Dashboard | M6-005 |
| CF-008 | Drag-and-Drop in Challenging Students Kanban | M6-006 |
| CF-009 | Notes and Action Items with Full Audit Trail | M6-004 |
| CF-010 | What-If Scenario Save and Compare | M9-005 |
| CF-011 | Per-Student What-If Projection | M7-009 |
| CF-012 | Rikuz Cell Drill-Down | M7-007 |
| CF-013 | Period Comparison Side-by-Side | M5-005 |
| CF-014 | Subject-Level Ranking View | M7-010 |
| CF-015 | Subject Performance Cross-Class Analysis | M7-008 |
| UI-001 | Per-Student Longitudinal Trajectory View | M7-001 |
| UI-002 | Cumulative Percentage Rows in Rikuz | M7-002 |
| UI-003 | Third Categorization Scheme (Questionnaire-Based) | M7-003 |
| UI-004 | Full Year-Over-Year Comparison Page | M7-004 |
| UI-005 | English/Math Completion Rates by Unit Level | M7-005 |
| UI-006 | Excellence Dashboard View | M7-006 |
| UI-007 | Mobile Responsiveness | M10-003 |
| UI-008 | Configurable Column Visibility in Grid | M8-007 |
| UI-009 | Compact Mode Toggle | M8-008 |
| UI-010 | Heatmap Overlays for Grade Grid | M10-008 |
| UI-011 | Keyboard Shortcuts for Power Users | M8-009 |
| UI-012 | Print-Optimized Layouts | M9-003 |
| UI-013 | Notification and Alert System | M6-007 |
| UI-014 | Localization/i18n Framework | M10-007 |
| DQ-001 | Student Count Inconsistency (503 vs 504) | M8-002 |
| DQ-002 | Excellence Tier Aleph (96+) Unreachable | M8-012 |
| DQ-003 | Class Sizes Differ from Spreadsheet | M8-012 |
| DQ-004 | Teacher Names Don't Match Spreadsheet | M8-012 |
| DQ-005 | Mock Data Score Distribution Calibration | M8-012 |
| DQ-006 | Non-Matriculation Student Count | M8-003 |
| UX-001 | Trend Chart Y-Axis Domains Mismatched | M8-001 |
| UX-002 | RankingView Risk Filter Shows Nonexistent Levels 4-5 | M6-002 |
| UX-003 | ClassHeader Period Selector Disconnected | M5-004 |
| UX-004 | Students Nav Link Goes to Dashboard | M8-004 |
| UX-005 | Bold Styling for Risk Levels 2 and 4 | M8-010 |
| UX-006 | School Contact Info Not Displayed | M8-011 |
| UX-007 | Navigation Structure Incomplete vs. Spec | M8-006 |
| UX-008 | WCAG AA Contrast Compliance | M10-004 |
| UX-009 | Progressive Disclosure from Grid Cells | M4-006 |
| PR-001 | Error Handling and Error Boundaries | M1-002 |
| PR-002 | Logging and Monitoring Infrastructure | M10-002 |
| PR-003 | Deployment Pipeline (CI/CD) | M1-003 |
| PR-004 | Test Framework and Test Suite | M1-001 |
| PR-005 | Performance Optimization | M10-001 |
| PR-006 | Environment Configuration and Secrets Management | M1-004 |
| PR-007 | Production Build and Hosting Setup | M2-006 |
| PR-008 | State Management Solution | M1-006 |
| PR-009 | Loading States and Skeleton Screens | M1-007 |
| PR-010 | Input Validation Framework | M1-005 |

**Also mapped from GAP-ANALYSIS.md gap IDs (N-*, P-*, MD-*, UI-* series):**

| GAP-ANALYSIS ID | Mapped To | Ticket(s) |
|-----------------|-----------|-----------|
| N-1 (Physics) | DM-002 | M3-002 |
| N-2 (Trajectory) | UI-001 | M7-001 |
| N-3 (Cumulative %) | UI-002 | M7-002 |
| N-4 (Chasam/Ikuv) | DM-001 | M3-001 |
| N-5 (3rd scheme) | UI-003 | M7-003 |
| N-6 (Export) | BE-006 | M9-001 |
| N-7 (Rare subjects) | DM-008 | M3-007 |
| N-8 (Data entry) | CF-003 | M4-003 |
| P-1 (Risk levels) | DM-007 | M6-002 |
| P-2 (YoY page) | UI-004 | M7-004 |
| P-3 (5th period) | DM-006 | M3-006 |
| P-4 (Variable denom) | DM-003 | M3-004 |
| P-5 (Period selector) | UX-003 | M5-004 |
| MD-1 (Student count) | DQ-001 | M8-002 |
| MD-2 (Excellence tier) | DQ-002 | M8-012 |
| MD-3 (Formula inconsistency) | DM-004 | M3-003 |
| UI-1 (Chart domains) | UX-001 | M8-001 |
| UI-2 (Risk filter) | UX-002 | M6-002 |
| UI-3 (Period selector) | UX-003 | M5-004 |
| UI-4 (Settings placeholder) | -- | M8-005 |
| UI-5 (Students link) | UX-004 | M8-004 |

---

## Dependency Graph (Simplified)

```
M1 (Foundation)
 |
 v
M2 (Backend) --------+
 |                    |
 v                    v
M3 (Data Model)   M5 (Period/Lifecycle) --> M6 (Risk/Intervention)
 |                    |
 v                    v
M4 (Data Pipeline) M7 (Analytics)
 |
 v
M8 (UI Polish) -----> M9 (Export)
                       |
                       v
                    M10 (Production Hardening)
```

**Critical path:** M1 -> M2 -> M3 -> M4 (data entry) -> M5 (period management) -> Production

**Parallelizable:** M3 and M5 can run in parallel after M2. M7 and M8 can largely run in parallel. M9 and M10 can start once earlier milestones stabilize.

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Formula accuracy regression | High -- incorrect grades affect students | M1-001 establishes comprehensive calculation tests before any refactoring |
| Data migration errors | High -- corrupted import from xlsx | M4-001 includes a verification step comparing calculated values against spreadsheet |
| RBAC bypass | Critical -- unauthorized data access | M2-004 uses PostgreSQL RLS + application-level checks; penetration testing in M10 |
| Performance degradation with real data | Medium -- GradeGrid may slow with 500+ students | M10-001 adds virtualization; performance benchmarked early in M2 |
| Hebrew RTL regression | Medium -- UI breaks during refactoring | E2E tests (M1-001) include RTL-specific assertions |
| Multi-tenant data leakage | Critical -- school A sees school B's data | M10-005 uses schema-level or strong row-level isolation with automated tests |
