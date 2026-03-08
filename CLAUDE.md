# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Israeli Bagrut (matriculation exam) tracking system demo. A React SPA that visualizes school-wide grade data with spreadsheet-style grids, dashboards, and analytics. All data is mock-generated; no backend.

## Commands

- `npm run dev` — Start Vite dev server (usually localhost:5173 or 5174)
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint across all TS/TSX files
- `npx tsc --noEmit` — Type-check without emitting (use after code changes)

No test framework is configured.

## Architecture

**Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, TanStack React Table v8, shadcn/ui (Radix), Recharts, React Router v7.

**Data flow:** `src/data/mock-data.ts` generates 504 students across 16 classes using a seeded RNG (seed=42) for deterministic output. Data is exported via functions (`getAllStudents()`, `getStudentsByClass()`, `getClasses()`, `getSubjects()`). No state management library — components import data directly.

**Routing (App.tsx):** `/` dashboard, `/class/:classId` grade grid, `/student/:studentId` detail, `/ranking` ranked list, `/at-risk` challenging students, `/analytics` what-if projections, `/settings` placeholder. All wrapped in `AppShell` layout which provides `PeriodContext`.

## Key Design Decisions

**RTL throughout.** All containers use `dir="rtl"`. shadcn configured with `"rtl": true`. Frozen columns in the grade grid use `position: sticky` with `right` offsets (not `left`).

**Risk vs Excellence are independent.** Risk levels (1-3) track passing risk. Excellence tiers (ALEPH/BET/BORDER_BET/GIMEL/BORDER_GIMEL/NONE) track honors proximity. Both derived from the original spreadsheet's 5-level system — levels 4-5 were extracted into the excellence tier system.

**Const objects, not enums.** TypeScript `erasableSyntaxOnly` is enabled, so `RiskLevel`, `ExcellenceTier`, `AccommodationType`, etc. are const objects with derived types (e.g., `type ExcellenceTier = (typeof ExcellenceTier)[keyof typeof ExcellenceTier]`).

**Variable-denominator weighted average.** Only subjects with actual grades are counted. Missing subjects are excluded from both numerator and denominator (matching the original spreadsheet's gamification formula).

**Color tokens in `src/lib/colors.ts`.** All colors mapped from the original Excel spreadsheet. Helper functions (`getScoreCellStyle`, `getRiskBadgeStyle`, `getExcellenceBadgeStyle`) return inline style objects. Don't use arbitrary hex values — use the token system.

## Grade Grid (`src/components/grades/GradeGrid.tsx`)

The largest component (~1000 lines). 8 frozen columns (mathUnit, engUnit, studentNum, name, accommodations, risk, excellence, weightedAvg) + scrollable subject columns. Uses TanStack React Table with custom `FilterFn<Student>` implementations:
- `multiSelectFilter` — checkbox filters for enums
- `textFilter` — ngram token matching (each space-separated token matched independently)
- `rangeFilter` — min/max for numeric columns
- `accommodationFilter` — special logic for accommodation arrays

## Mock Data Generation (`src/data/mock-data.ts`)

- Seeded LCG RNG ensures deterministic data across runs
- ~8% of regular students get "excellent" talent (correlated high scores 85-100)
- ~18% of regular non-excellent students miss 1-3 core subjects (enables What-If projections)
- Class 12 is special education (13 students, lower scores, Communications subject)
- Each class has 4-5 assigned electives from a pool of 14

## Documentation

Project docs live in `/docs/`:
- `PRODUCT-SPEC.md` — Full product spec with [IMPLEMENTED]/[NOT YET IMPLEMENTED] markers
- `GAP-ANALYSIS.md` — Current gaps between spreadsheet and demo
- `spreadsheet-inventory.md` — Complete analysis of the original Excel spreadsheet
- `FILE-ANALYSIS.md` — Detailed file-level spreadsheet analysis
- `QUESTIONS.md` / `QUESTIONS-FOR-SARIT.md` — Open questions for the Bagrut coordinator

## Path Aliases

`@/*` resolves to `./src/*` (configured in both tsconfig and vite).
