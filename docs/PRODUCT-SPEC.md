# Bagrut Tracker -- Product Specification

**Product Name:** Bagrut Tracker (BT)
**Version:** 1.1 (Updated to reflect demo implementation status)
**Date:** 2026-03-08
**Status:** Draft -- Updated with implementation status markers per demo app at commit date
**Source Analysis:** Based on comprehensive analysis of `sarit-example.xlsx` from Sheifa School
**Demo Implementation:** React/TypeScript SPA with mock data (504 students, 16 classes, 25 subjects)

> **Implementation Status Key:** Each major section is annotated with one of:
> - **[IMPLEMENTED]** -- Feature is fully working in the demo
> - **[PARTIALLY IMPLEMENTED]** -- Feature exists but with notable gaps vs. spec
> - **[NOT YET IMPLEMENTED]** -- Feature is specified but not present in the demo

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [User Roles and Personas](#2-user-roles-and-personas)
3. [Core Features](#3-core-features)
4. [Data Model](#4-data-model)
5. [Business Rules](#5-business-rules)
6. [Color System and Visual Design Language](#6-color-system-and-visual-design-language)
7. [UX/UI Concepts](#7-uxui-concepts)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Migration Path](#9-migration-path)
10. [Open Questions and Assumptions](#10-open-questions-and-assumptions)

---

## 1. Product Vision

### 1.1 Problem Statement

The Israeli Bagrut (Matriculation Exam) system is extraordinarily complex. A single school like Sheifa manages approximately 503 students across 16 classes, each taking 7-10 subjects with multiple exam questionnaires (components), spread across 4-5 exam periods over 2-3 academic years. Each subject has its own internal/external component weighting rules (30/70, 80/20, 50/50, and others). Passing thresholds, eligibility calculations, excellence tiers, and risk assessments must all be tracked simultaneously.

Today, this entire operation runs on a single, manually-maintained Excel workbook. The analysis of Sheifa School's actual tracking file revealed:

**Pain Points of the Current Excel-Based System:**

1. **Massive manual data entry burden.** Approximately 500 students multiplied by 20+ subjects multiplied by multiple exam periods yields over 40,000 data cells maintained by a single person (Sarit).
2. **Error-prone formulas.** Non-numeric entries like "chasam" (barrier) and "ikuv" (delay) cause #VALUE! errors that cascade through dependent calculations. At least 4 such errors were identified in Class 12 alone.
3. **Manual color coding.** Risk levels, passing/failing status, internal/external markers, and period headers all rely on manual background and font color application across thousands of cells -- a tedious and error-prone process.
4. **No real-time updates.** Data is stale between update cycles. Stakeholders cannot see current status without requesting the latest file from Sarit.
5. **Inconsistent column layouts.** Class 12 has a fundamentally different column structure from the other 15 classes. Even among regular classes, the elective subject columns vary, making cross-class operations fragile.
6. **No collaboration.** A single Excel file creates versioning challenges. Homeroom teachers, counselors, and administrators cannot contribute data or view status independently.
7. **No audit trail.** When grades change -- whether due to corrections, data entry errors, or policy decisions -- there is no record of what changed, when, or by whom.
8. **No automated alerts.** At-risk students must be identified by visual scanning of color-coded cells across 20 sheets. A borderline score of 53 is only noticed if Sarit happens to look at that cell.
9. **Scaling limitations.** Adding a new subject, class, or exam period requires restructuring columns across multiple sheets -- a brittle and time-consuming operation.
10. **No longitudinal analytics.** Year-over-year comparison requires manual data entry of historical figures. The current file shows concerning declining trends (eligibility: 96.6% to 92.4%; honors: 43.8% to 34.6%) but provides no tools to drill into root causes.

### 1.2 Target Users and Their Needs

| User | Primary Need | Current Pain |
|------|-------------|--------------|
| **Sarit** (Bagrut Coordinator) | Complete visibility into every student's Bagrut progress; ability to identify at-risk students and coordinate interventions | Spends extensive hours on manual data entry, color coding, and formula maintenance |
| **Homeroom Teachers** (Mechanchim) | Class-level view of their students' Bagrut status; ability to see which students need attention | Must wait for Sarit to share data; cannot self-serve |
| **School Principal** (likely Hila) | School-wide performance metrics; year-over-year trends; resource allocation decisions | Receives static snapshots; cannot explore data interactively |
| **Counselors** (Shira and others) | List of students assigned to them for follow-up; intervention tracking | Rely on verbal briefings or printed lists from Sarit |
| **Subject Coordinators** | Subject-level performance across all classes; identification of struggling students in their subject | No dedicated view exists; must scan across 16 class sheets |
| **Students and Parents** (potential) | Individual progress toward Bagrut eligibility | Currently have no access whatsoever |

### 1.3 Value Proposition

Bagrut Tracker replaces the manual Excel workbook with a purpose-built web application that:

1. **Eliminates manual data entry errors** through validated input, formula automation, and graceful handling of special values (chasam, ikuv).
2. **Provides real-time visibility** to all stakeholders through role-based dashboards, eliminating the single-file bottleneck.
3. **Automates risk detection** using configurable rules that flag at-risk students the moment a score is entered, rather than waiting for periodic manual review.
4. **Preserves the information density** that makes the Excel effective -- color-coded grids, at-a-glance status, and compact data views -- while adding clarity, navigation, and interactivity.
5. **Enables collaboration** between Sarit, homeroom teachers, counselors, and administrators through role-based access with full audit trails.
6. **Supports institutional memory** by maintaining multi-year historical data, enabling trend analysis and data-driven planning.
7. **Scales across schools** with multi-tenant architecture, enabling deployment beyond Sheifa to any Israeli school using the Bagrut system.

### 1.4 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time spent on data entry per exam period | 50% reduction vs. Excel | User time tracking |
| Data entry errors (formula breakage, misplaced scores) | Zero tolerance | Automated validation |
| At-risk student identification time | < 1 minute from score entry to alert | System logs |
| Stakeholder self-service rate | 80% of data requests served without Sarit involvement | Access logs |
| User satisfaction (Sarit) | > 90% | Periodic survey |
| Data freshness | Same-day score entry after Ministry release | Audit trail timestamps |

---

## 2. User Roles and Personas

### 2.1 Role Definitions

#### Role: Bagrut Coordinator (Sarit)

**Hebrew title:** רכזת בגרות
**Profile:** Sarit is the school's Bagrut coordinator or VP for academics. She is the primary maintainer of the current Excel workbook and the central point of contact for all Bagrut-related matters.

**Responsibilities in the system:**
- Enter and update all student grades (internal and external)
- Assign and update risk levels (tzafi) for each student
- Manage the challenging students workflow (categorize, assign, track)
- Generate and review school-wide and class-level reports
- Prepare year-over-year comparison data
- Run what-if projections (gamification)
- Configure exam periods, subjects, and class rosters at start of year
- Export data for external reporting

**Permissions:** Full read/write access to all data within the school. Can configure subjects, formulas, and exam periods. Can manage user accounts for other staff.

**Key persona attributes:**
- Expert-level understanding of the Bagrut system
- Values speed and information density -- accustomed to seeing 40+ columns at once
- Needs keyboard-driven data entry (tabbing through cells)
- Works in concentrated bursts after exam results arrive
- Relies heavily on color patterns for rapid assessment

---

#### Role: Homeroom Teacher (Mechanech/et)

**Hebrew title:** מחנכ/ת
**Profile:** Each of the 16 classes has an assigned homeroom teacher (e.g., David Shroni for class 1, Safi Baruch for class 12). They are responsible for the overall well-being and academic progress of their class.

**Responsibilities in the system:**
- View their class's Bagrut status dashboard
- See individual student details for students in their class
- Add notes and observations to student records
- View students assigned to them in the challenging students workflow
- [ASSUMPTION] Potentially enter internal (school-based) assessment scores

**Permissions:** Read access to their own class. Write access limited to notes and [ASSUMPTION] internal scores. No access to other classes' student-level data.

---

#### Role: Subject Coordinator

**Hebrew title:** רכז/ת מקצוע
**Profile:** Responsible for a specific Bagrut subject across the school (e.g., head of Mathematics department).

**Responsibilities in the system:**
- View subject-level performance across all classes
- Identify students struggling in their subject
- [ASSUMPTION] Enter or validate internal assessment scores for their subject
- Compare class-level performance within the subject

**Permissions:** Read access to their subject's data across all classes. [ASSUMPTION] Write access to internal scores for their subject. No access to other subjects' data except aggregated views.

---

#### Role: School Principal

**Hebrew title:** מנהל/ת בית הספר
**Profile:** Based on the analysis, "Hila" appears to be a senior administrator (possibly principal or VP) who serves as an escalation point for non-functioning students.

**Responsibilities in the system:**
- View school-wide dashboards and analytics
- Review year-over-year comparison trends
- View the challenging students workflow and escalation status
- Access any class or student detail as needed
- [ASSUMPTION] Approve certain actions (e.g., reclassifying a student as non-matriculation)

**Permissions:** Full read access to all data. Limited write access (approvals, notes). Cannot modify grade data or system configuration.

---

#### Role: Counselor

**Hebrew title:** יועצ/ת
**Profile:** Based on the analysis, "Shira" is a staff member (likely a counselor or VP) assigned to close follow-up of challenging students. "Hila" also serves in an advisory/escalation role.

**Responsibilities in the system:**
- View students assigned to them for follow-up
- Update intervention status and notes
- Track student improvement trajectories
- View the challenging students list filtered by their assignments

**Permissions:** Read access to assigned students' data only. Write access to notes and intervention tracking fields. [ASSUMPTION] Can view class-level summaries but not individual grades for non-assigned students.

---

#### Role: System Administrator (Multi-School)

**Hebrew title:** מנהל/ת מערכת
**Profile:** Technical administrator managing the platform across one or more schools.

**Responsibilities in the system:**
- Manage school tenants and configuration
- Define subject catalogs, exam questionnaire codes, and weight formulas
- Manage academic year rollover
- Handle data import/export
- Manage user accounts and role assignments
- Monitor system health and audit logs

**Permissions:** Full system access including configuration, user management, and data administration. No direct grade modification (must act through Coordinator role).

---

#### Role: Student / Parent (Future Phase)

**Hebrew title:** תלמיד/ה / הורה
**Profile:** The student themselves or their parent/guardian.

**Responsibilities in the system:**
- View their own (or their child's) Bagrut progress
- See completed exams, scores, and remaining requirements
- View projected eligibility status
- [ASSUMPTION] This role is NOT in scope for v1 but should be architecturally supported

**Permissions:** Read-only access to a single student's data. No access to class-level or school-level data.

**Open question:** Q62 -- Would the school want to share individual student dashboards with students/parents, or is this strictly an internal staff tool?

---

### 2.2 Role-Permission Matrix

| Capability | Coordinator | Homeroom Teacher | Subject Coord. | Principal | Counselor | Admin |
|-----------|:-----------:|:----------------:|:--------------:|:---------:|:---------:|:-----:|
| Enter/edit grades | Yes (all) | [ASSUMPTION] Own class internal only | [ASSUMPTION] Own subject internal only | No | No | No |
| View student details | All students | Own class | Own subject across classes | All | Assigned students | All |
| Assign risk levels | Yes | No | No | No | No | No |
| Manage challenging students | Yes | View own class | No | View all | View/edit assigned | No |
| View school dashboards | Yes | Own class | Own subject | Yes | Summary only | Yes |
| View year-over-year | Yes | No | No | Yes | No | Yes |
| Run what-if projections | Yes | [ASSUMPTION] Own class | No | Yes | No | No |
| Add student notes | Yes | Own class | Own subject | Yes | Assigned students | No |
| Export data | Yes | [ASSUMPTION] Own class | No | Yes | No | Yes |
| Configure system | Limited (subjects, periods) | No | No | No | No | Full |
| Manage users | No | No | No | No | No | Yes |

---

## 3. Core Features

### 3.1 Student Grade Management [PARTIALLY IMPLEMENTED]

#### 3.1.1 Per-Class Grade Entry and Tracking [PARTIALLY IMPLEMENTED -- read-only grid, no data entry]

The system shall provide a grade entry interface that mirrors the information density of the current Excel class sheets while eliminating manual formula maintenance.

**Requirements:**

- **Grid-based data entry.** Each class has a spreadsheet-like grid with students as rows and exam components as columns. The grid must support rapid keyboard-driven entry (Tab to advance, Enter to confirm, arrow keys to navigate).
- **Per-class configuration.** Each class has a defined set of subjects and their exam components (questionnaires). The column set varies by class based on which elective subjects the class takes. For example:
  - Class 1 includes Geography (57381, 57238) and Spanish (579385, 579283)
  - Class 2 includes Film/Cinema (61387, 61283) and Medical Sciences (802381, 802283)
  - Class 12 includes Communications (56387, 56283) -- unique to this class
- **Homeroom teacher display.** Each class view shows the assigned homeroom teacher name prominently (as the Excel shows in row 3).
- **Student roster.** Each class displays 16-40 students (typical range) with: student number, student name, Math unit level (3/4/5), English unit level (3/4/5), and accommodation flags.

**Data points per student per subject:**
- Internal (school-based) assessment score (ציון פנימי)
- External (national exam) score (ציון חיצוני) -- may have multiple questionnaire components
- Calculated final score (ציון סופי) -- auto-calculated from the weighted formula
- Special values: "chasam" (barrier), "ikuv" (delay), empty (not yet taken)

#### 3.1.2 Subject-Specific Exam Components [IMPLEMENTED]

Each subject in the Israeli Bagrut system has a specific structure of exam components with defined weighting rules. The system must encode all of these precisely.

**Core Subjects (Mandatory):**

| Subject | Hebrew | Components | Weights | Notes |
|---------|--------|------------|---------|-------|
| Mathematics | מתמטיקה | 3-unit: 182/183, 381, 382; 4-unit: 481, 482; 5-unit: 581, 582 | See Sofi formulas below | 7 questionnaire codes across 3 levels |
| History | היסטוריה | Internal + External | 30% / 70% | Standard |
| Civics | אזרחות | Performance task (מטלת ביצוע) + Exam | 20% / 80% | Exception to standard |
| Tanakh (Bible) | תנ"ך | Internal + External | 30% / 70% | Standard |
| Literature | ספרות | Internal + External | 30% / 70% | Standard |
| Hebrew Language | לשון | Internal + External | 30% / 70% | Standard |
| English | אנגלית | Modules A-G + Oral | Complex multi-module | See English structure below |
| General Studies | השכלה כללית | Single/dual score | N/A | [ASSUMPTION] Not weighted in average |
| Intro to Sciences | מבוא למדעים | Single score | N/A | [ASSUMPTION] Not weighted in average |
| Physical Education | חנ"ג | Single score (0-100) | N/A | [ASSUMPTION] Pass/fail for eligibility |
| Community Service | מעורבות חברתית | Score (1-4) | N/A | [ASSUMPTION] Hours-based, required for eligibility |

**Elective/Major Subjects (Megamot):**

| Subject | Hebrew | Components | Weights |
|---------|--------|------------|---------|
| Computer Science | מדעי המחשב | 899381, 899373 (or 899371/899271) + 883589 | 70%/30% (or 76%/24% variant) |
| Physics | פיזיקה | 361, 376, 283, 371 | 30%/15%/30%/25% |
| Chemistry | כימיה | Multiple codes | [ASSUMPTION] 30%/70% standard |
| Biology | ביולוגיה | Multiple codes + Final Project (ע. גמר) | [ASSUMPTION] 30%/70% with project |
| Geography | גאוגרפיה | 57381, 57238 | 60%/40% |
| Management/Economics | מנהל וכלכלה | 839283, 381 | 30%/70% |
| Social Sciences | מדעי החברה | 281, 283, 273, 189 | [ASSUMPTION] Multi-component |
| Jewish Law (Oral Torah) | חוק"ש תושב"ע | 7383, 7281 | 50%/50% |
| Spanish | ספרדית | 579385, 579283 | 60%/40% |
| Arabic | ערבית | Multiple codes | [ASSUMPTION] Standard weights |
| French | צרפתית | Codes vary | [ASSUMPTION] Standard weights |
| Italian | איטלקית | Codes vary | [ASSUMPTION] Standard weights |
| Chinese | סינית | Codes vary | [ASSUMPTION] Standard weights |
| Film/Cinema | קולנוע | 61387, 61283 | [ASSUMPTION] Standard weights |
| Medical Sciences | מדעי הרפואה | 802381, 802283 | [ASSUMPTION] Standard weights |
| Communications | תקשורת | 56387, 56283 | 50%/50% (Class 12 only) |
| Philosophy | פילוסופיה | Codes vary | [ASSUMPTION] Standard weights |
| Music | מוזיקה | Multiple codes | [ASSUMPTION] Standard weights |
| Dance | מחול | Multiple codes | [ASSUMPTION] Standard weights |
| Theater | תאטרון | Multiple codes | [ASSUMPTION] Standard weights |
| Extended Bible | תנ"ך מורחב | Codes vary | [ASSUMPTION] Standard weights |

**English Module Structure:**

English is the most complex subject, with 7 written modules plus oral components:

| Module | Exam Code | Level | Weight in Sofi |
|--------|-----------|-------|----------------|
| A | 16381 | 3 units | 0.27 in Sofi 3 |
| B | 16383 | 3 units | 0.26 in Sofi 3 |
| C | 16382 | 3 units | 0.27 in Sofi 3 |
| D | 16483 | 4 units | [ASSUMPTION] 0.27 in Sofi 4 |
| E | 16471 (regular) / 16481 (class 12) | 4 units | 0.27 in Sofi 5 |
| F | 16583 | 5 units | 0.26 in Sofi 5 |
| G | 16582 | 5 units | 0.27 in Sofi 5 |
| Oral 3 | (oral exam) | 3 units | 0.20 in Sofi 3 |
| Oral 4 | (oral exam) | 4 units | 0.20 in Sofi 4 |
| Oral 5 | (oral exam) | 5 units | 0.20 in Sofi 5 |

**Mathematics Questionnaire Structure:**

| Code | Level | Role in Formula |
|------|-------|-----------------|
| 182/183 | 3 units | Weight 0.25 in Sofi 3 |
| 381 | 3 units | Weight 0.35 in Sofi 3 |
| 382 | 3 units | Weight 0.40 in Sofi 3 |
| 481 | 4 units | Weight 0.65 in Sofi 4 |
| 482 | 4 units | Weight 0.35 in Sofi 4 |
| 581 | 5 units | Weight 0.60 in Sofi 5 |
| 582 | 5 units | Weight 0.40 in Sofi 5 |

#### 3.1.3 Multiple Exam Unit Levels [IMPLEMENTED]

The system must support students at different unit levels (3/4/5 units) for Mathematics and English, and potentially other subjects.

**Requirements:**
- Each student has an assigned unit level for Math (3, 4, or 5) and for English (3, 4, or 5), stored as a student attribute.
- The unit level determines: (a) which questionnaire codes apply, (b) which Sofi formula is used, (c) what weight is applied in the weighted average.
- [ASSUMPTION - A12] Each student takes exactly one level per subject. However, the system should support level changes (e.g., student upgrades from 3-unit to 4-unit mid-year) with historical tracking.
- Common unit level combinations observed: "5 5", "5 3", "5 4", "4 3", "4 4".
- [ASSUMPTION - Q47] The first number represents Math unit level and the second represents English unit level.

#### 3.1.4 Auto-Calculation of Weighted Averages and Final Scores [IMPLEMENTED]

All final subject scores and the overall weighted average must be automatically calculated.

**Subject Final Scores (Sofi):**

See Section 5 (Business Rules) for the complete formula catalog.

**Overall Weighted Average:**

The weighted average uses differential weights based on unit counts:

For 5-unit Math + 5-unit English:
```
Weighted Average = (MathSofi5 * 5 + History * 2 + Civics * 2 + Tanakh * 2 + Literature * 2 + Language * 2 + EnglishSofi5 * 5) / 20
```

For 4-unit Math + 4-unit English:
```
Weighted Average = (MathSofi4 * 4 + History * 2 + Civics * 2 + Tanakh * 2 + Literature * 2 + Language * 2 + EnglishSofi4 * 4) / 18
```

For mixed levels (e.g., 5-unit Math + 3-unit English):
```
[ASSUMPTION - Q21] Weighted Average = (MathSofi5 * 5 + History * 2 + Civics * 2 + Tanakh * 2 + Literature * 2 + Language * 2 + EnglishSofi3 * 3) / 19
```

**General rule:** The denominator equals the sum of all weights: MathUnits + 2 + 2 + 2 + 2 + 2 + EnglishUnits.

**Recalculation behavior:** Weighted averages recalculate instantly when any component score changes.

**Variable denominator (demo implementation):** [IMPLEMENTED] The demo uses a variable-denominator formula that skips missing subjects. If a core subject's final score is 0 or undefined, both its score and its unit weight are excluded from the numerator and denominator. This matches the gamification sheet's approach and prevents students with missing subjects from being penalized with 0s.

```
// Pseudocode for variable-denominator weighted average:
for each core subject (math, history, civics, tanakh, literature, language, english):
    if subject.final > 0:
        weightedSum += subject.final * subject.units
        totalUnits += subject.units
weightedAverage = weightedSum / totalUnits
```

**Demo note:** Approximately 18% of regular (non-excellent) students are generated with 1-3 missing core subjects (history, civics, tanakh, literature, or language) to exercise the variable-denominator logic and enable realistic What-If projections. The missing subject count follows this distribution: 60% miss 1 subject, 25% miss 2, 15% miss 3.

#### 3.1.5 Special Values Support [NOT YET IMPLEMENTED]

The system must handle non-numeric values in score cells:

| Value | Hebrew | Meaning | System Behavior |
|-------|--------|---------|-----------------|
| chasam | חסם | Barrier -- student blocked from taking this exam | Exclude from calculations; display with warning icon; flag for coordinator review |
| ikuv | עיכוב | Delay -- score pending or exam deferred | Treat as "pending"; exclude from calculations; auto-remind coordinator |
| Empty/null | (blank) | Exam not yet taken | Exclude from calculations; show as empty cell |
| Manual override | (numeric) | Coordinator manually set a final score | Store both calculated and overridden values; show override indicator |

**Error handling:** Unlike the Excel file where "chasam" causes #VALUE! errors, the system must gracefully handle all special values without breaking any downstream calculations.

#### 3.1.6 Accommodations Tracking [IMPLEMENTED]

The system must track four types of exam accommodations per student:

| Accommodation | Hebrew | Meaning | Impact |
|--------------|--------|---------|--------|
| Adapted | מותאם | Student takes a modified version of the exam | [ASSUMPTION - Q26] Different exam format; same scoring |
| Dictation | הכתבה | Someone reads/writes for the student | [ASSUMPTION] Same exam, different administration |
| Oral | בע"פ | Oral exam instead of written | [ASSUMPTION] May have different questionnaire codes |
| Special | ע"ח | Other special accommodations | [ASSUMPTION] Catch-all for other adjustments |

**Requirements:**
- Each accommodation is a boolean flag per student (can have multiple simultaneously).
- Accommodations are displayed as icons/badges in the student row.
- [ASSUMPTION - Q27] Accommodations do not change the scoring formula, only the exam administration method.
- The system should support filtering students by accommodation type.

---

### 3.2 Bagrut Eligibility Tracking [IMPLEMENTED]

#### 3.2.1 Real-Time Eligibility Status Calculation [IMPLEMENTED]

The system shall continuously calculate each student's Bagrut eligibility status based on their current scores.

**Eligibility categories (from the rikuz sheet analysis):**

| Status | Hebrew | Definition |
|--------|--------|-----------|
| Full Bagrut | בגרות מלאה | [ASSUMPTION - Q10] Student has passed (55+) all mandatory subjects and meets all additional requirements |
| Full Bagrut despite missing exam | בגרות מלאה למרות בחינה חסרה | [ASSUMPTION - Q13] Student qualifies for Bagrut even though one subject exam is incomplete, per Ministry policy |
| Missing 1 exam | חסרה בחינה אחת | Student needs to pass one more exam |
| Missing 2 exams | חסרות 2 בחינות | Student needs to pass two more exams |
| Missing 3 exams | חסרות 3 בחינות | Yellow alert zone |
| Missing 4 exams | חסרות 4 בחינות | Red alert zone |
| Missing 4+ exams | חסרות יותר מ-4 בחינות | Critical -- significant Bagrut risk |
| Non-matriculation | לא בגרותי/ת | Student is not on the Bagrut track |

**Additional failure-based categorization (used for mid-year snapshots):**

| Status | Hebrew |
|--------|--------|
| No failures | ללא נכשלים |
| 1 failure or missing exam | נכשל 1 או חסרה בחינה |
| 2 failures | 2 נכשלים |
| 3 failures | 3 נכשלים |
| 4 failures | 4 נכשלים |
| 5+ failures | 5 ויותר נכשלים |

**Questionnaire-based categorization (used for correction-focused views):**

| Status | Hebrew |
|--------|--------|
| No questionnaires to correct | אין שאלונים לתיקון |
| 1 questionnaire to correct/complete | שאלון אחד לתיקון / השלמה |
| 2 questionnaires to correct/complete | שני שאלונים לתיקון / השלמה |
| 3 questionnaires to correct/complete | שלושה שאלונים לתיקון / השלמה |
| 4 questionnaires to correct/complete | ארבעה שאלונים לתיקון / השלמה |
| Many questionnaires to correct/complete | שאלונים רבים לתיקון / השלמה |

The system must support all three categorization schemes as they serve different analytical needs at different points in the academic year.

**Demo note:** The demo supports 2 of 3 categorization schemes: exam-missing and failure-count, toggled via buttons on the rikuz matrix. The third scheme (questionnaire-based) is [NOT YET IMPLEMENTED].

#### 3.2.2 Missing Exams Tracking Per Student [PARTIALLY IMPLEMENTED]

For each student, the system must display:
- A list of all required subjects/questionnaires
- Which have been completed (with scores)
- Which are still pending
- Which have special status (chasam, ikuv)
- Net count of missing/failing items

This replaces the manual counting that Sarit currently does when populating the status summary sections of each class sheet.

#### 3.2.3 Risk Level Classification (Tzafi System) [IMPLEMENTED]

**Demo implementation note:** The demo separates the spreadsheet's unified 5-level risk system into two independent systems: a 3-level **risk classification** (tracking eligibility risk) and a 6-tier **excellence classification** (tracking honors proximity). This design choice allows each system to be evaluated independently rather than overloading a single scale.

**Risk Levels (3-level system in demo):**

| Level | Hebrew Name | English | Visual Indicator | Meaning |
|-------|------------|---------|-----------------|---------|
| 1 | סיכוי גבוה | High chance | Green background (#C2D69B) | Student is on track for full Bagrut with no issues |
| 2 | סיכון | Risk | Orange text (#E36C09) | Student has some risk -- 1 failing core subject |
| 3 | סיכון גבוה | High risk | Amber/gold background (#FFC000) | Significant risk -- 2+ failures or 1 failure with low average |

**Spreadsheet reference (5-level system):** The original spreadsheet uses 5 risk levels where levels 4 and 5 track proximity to excellence thresholds:
- Level 4: סיכון מצויינות 1 ב (Risk to Excellence 1-Bet) -- student near the 90-point threshold
- Level 5: סיכון גבוה למצויינות 1 ג (Risk to Excellence 1-Gimel) -- student near the 85-point threshold

In the demo, these concerns are handled by the ExcellenceTier system (see below) rather than as risk levels.

**Assignment logic (demo):**
- Risk levels are auto-calculated based on core subject failure count and weighted average:
  - 0 failures: Level 1 (on track)
  - 1 failure: Level 2 (risk), or Level 3 if weighted average < 65
  - 2+ failures: Level 3 (high risk)
- [FULL PRODUCT] Risk levels should be primarily manual with auto-suggestions (see Section 5.4), with coordinator override authority.
- Risk levels are tracked historically -- each change is timestamped and attributed.

**Excellence Tier System (6-tier system in demo):** [IMPLEMENTED]

The demo implements a separate excellence tier system that combines the official Metzuyanut designations with two additional "border" tiers that map to the spreadsheet's risk levels 4 and 5:

| Tier | Code | Hebrew | Threshold | Spreadsheet Equivalent |
|------|------|--------|-----------|----------------------|
| ALEPH | `aleph` | מצויינות 1-א | Weighted average >= 96 | Official Metzuyanut tier |
| BET | `bet` | מצויינות 1-ב | Weighted average 90-95 | Official Metzuyanut tier |
| BORDER_BET | `border_bet` | גבול מצויינות 1-ב | Weighted average 86-89 | Maps to spreadsheet risk level 4 |
| GIMEL | `gimel` | מצויינות 1-ג | Weighted average 85 | Official Metzuyanut tier |
| BORDER_GIMEL | `border_gimel` | גבול מצויינות 1-ג | Weighted average 81-84 | Maps to spreadsheet risk level 5 |
| NONE | `none` | ללא הצטיינות | Weighted average < 81 | N/A |

[ASSUMPTION - Q5] Excellence designation is based solely on the weighted average. The BORDER_BET and BORDER_GIMEL tiers are demo-specific additions that highlight students close to crossing an excellence threshold, enabling proactive intervention.

#### 3.2.4 Historical Status Tracking Across Exam Periods [PARTIALLY IMPLEMENTED]

The system preserves each student's status at each exam period snapshot, enabling longitudinal analysis.

**Standard exam periods per academic year:**

| # | Period | Hebrew | Approx. Calendar |
|---|--------|--------|-----------------|
| 1 | After summer (11th grade) | לאחר קיץ תשפ"ג | August (Y-1) |
| 2 | After summer (12th grade) | לאחר קיץ תשפ"ד | August (Y) |
| 3 | After winter (12th grade) | לאחר חורף תשפ"ה | February (Y+1) |
| 4 | After winter + corrections | לאחר חורף תשפ"ה + תיקונים והשלמות | March (Y+1) |
| 5 | After summer (final) | לאחר קיץ תשפ"ה | July (Y+1) |

[ASSUMPTION - A6] This 5-period structure is standard and consistent across years.

**For each period snapshot, the system stores:**
- Student's eligibility category (from the lists above)
- Number of missing/failing exams or questionnaires
- Risk level at that point
- Color-coded status indicator (green/yellow/red)
- Free-text notes

**Trajectory visualization:** The system shall display a student's status trajectory across periods (replacing the manual color-coded tracking grid at the bottom of each class sheet), enabling quick identification of improving vs. declining students.

Example:
```
Student: Aharon Shachar
  After Summer '23: [Green] On track (0 missing)
  After Summer '24: [Yellow] At risk (1 failing)
  After Winter '25:  [Yellow] At risk (1 failing)
  After Corrections: [Green] On track (0 failing)
```

#### 3.2.5 Special Student Categories [IMPLEMENTED]

**"Full Bagrut Despite Missing Exam" (בגרות מלאה למרות בחינה חסרה):**
- [ASSUMPTION - Q13] This applies when a student meets Bagrut requirements despite not completing all exams, likely per Ministry of Education policy for specific subjects or circumstances.
- [ASSUMPTION - Q14] This likely applies only to certain elective subjects, not core subjects.
- [ASSUMPTION - Q15] The system treats these students as "fully eligible" in cumulative statistics, but displays them as a distinct sub-category.

**Non-Matriculation Students (לא בגרותי/ת):**
- Students flagged as non-matriculation are on a different academic track.
- [ASSUMPTION - A8] They are excluded from eligibility percentage calculations.
- They remain visible in the class roster with a clear visual marker.
- The system supports reclassification (e.g., a student who "gives up on full Bagrut" mid-year, per Anomaly 4).

**Students Who Left:**
- Students who transferred, left abroad, or moved to special programs (e.g., "Project Hila") need a "withdrawn" status.
- [ASSUMPTION - Q49] Withdrawn students are excluded from the denominator in eligibility calculations.
- The system retains their historical data for audit purposes.

---

### 3.3 Dashboard and Analytics [IMPLEMENTED]

#### 3.3.1 School-Wide Summary (Replacing the Rikuz Sheet) [IMPLEMENTED]

A real-time dashboard replacing the manual rikuz (consolidation) sheet. This is the principal's and coordinator's primary view.

**Layout:**

The summary displays a matrix: classes as columns, eligibility categories as rows, with counts, percentages, and cumulative percentages.

**Data displayed:**

For each exam period:
- Per-class student counts by eligibility category
- Class totals
- School total (without Class 12)
- Class 12 total (separate column)
- Combined school total (with Class 12)
- Percentage of each category relative to total
- Cumulative percentages (cascading):
  - % with full Bagrut
  - % with full Bagrut or 1 missing
  - % with full Bagrut, 1 missing, or 2 missing
  - And so on

**Example from current data (After Summer 2023):**
- 331 students (66.7%) with no missing exams
- 443 (89.3%) with 0-1 missing (cumulative)
- 470 (94.8%) with 0-2 missing (cumulative)
- 484 (97.6%) with 0-3 missing (cumulative)
- Total: 496 regular + 13 Class 12 = 509

**Interactivity:**
- Click any cell to drill down to the list of students in that category
- Toggle between exam-missing, failure-count, and questionnaire-based views
- Filter by exam period
- Compare two periods side by side

#### 3.3.2 Class-Level Breakdowns [IMPLEMENTED]

Each class has its own dashboard showing:
- Class name and homeroom teacher
- Student count and roster summary
- Eligibility breakdown (counts by category)
- Subject-level performance:
  - Class average per subject
  - Count of students with scores per subject
  - Count of failing students per subject per exam period
- Risk level distribution (count per level 1-3 in demo; full product supports levels 1-5)

This replaces the summary rows (43-91) in each class sheet.

#### 3.3.3 Year-Over-Year Comparison (Replacing Hashvaa Sheet) [PARTIALLY IMPLEMENTED]

A trend analysis view showing school performance across multiple academic years.

**Metrics tracked (from the actual comparison sheet):**

| Metric | Hebrew | Example Values (4-year trend) |
|--------|--------|-------------------------------|
| Total students | מספר התלמידים בשכבה | 582 -> 532 -> 532 -> 503 |
| Full Bagrut eligible | מספר התלמידים עם זכאות מלאה | 562 -> 515 -> 515 -> 465 |
| Eligibility rate | אחוז עם זכאות מלאה | 96.6% -> 96.8% -> 96.8% -> 92.4% |
| English 4-unit count and % | 4 יח"ל באנגלית | 10.8% -> 12.4% -> 11.7% -> 11.1% |
| English 5-unit count and % | 5 יח"ל באנגלית | 85.7% -> 85.7% -> 84.6% -> 82.3% |
| Math 4-unit count and % | 4 יח"ל במתמטיקה | 31.4% -> 30.8% -> 32.7% -> 29.2% |
| Math 5-unit count and % | 5 יח"ל במתמטיקה | 41.6% -> 35.9% -> 37.0% -> 33.8% |
| Honors students count and % | תלמידים שסיימו כמצטיינים | 43.8% -> 37.0% -> 36.8% -> 34.6% |

**Visualization:** Line charts and bar charts with trend arrows. [ASSUMPTION - A14] The system supports configurable year ranges (default: current + 3 prior years, expandable to 5+ years).

**Exclusion note:** The comparison header states "Quality Bagrut Certificate (not including Ch"M)" -- [ASSUMPTION - Q3] "Ch"M" (ח"מ) stands for Chinuch Meyuchad (special education), meaning Class 12 is excluded from these quality metrics.

**Demo note:** The demo shows 3 mini area charts (eligibility rate, excellence rate, math 5-unit rate) on the dashboard using Recharts. Missing metrics vs. spreadsheet: English 4-unit %, English 5-unit %, Math 4-unit %, total student counts, full eligible counts. No dedicated year-over-year comparison page exists.

#### 3.3.4 English/Math Completion Rates by Unit Level [NOT YET IMPLEMENTED]

Dedicated views showing the distribution of students by unit level for Mathematics and English:

**Mathematics:**
- Count and percentage at 3-unit level
- Count and percentage at 4-unit level
- Count and percentage at 5-unit level
- Trend across years

**English:**
- Count and percentage at 3-unit level
- Count and percentage at 4-unit level
- Count and percentage at 5-unit level
- Trend across years

#### 3.3.5 Excellence (Metzuyanut) Tier Tracking [PARTIALLY IMPLEMENTED]

Dashboard showing students by excellence tier:

| Tier | Code (Demo) | Students | % of Total |
|------|-------------|----------|-----------|
| Metzuyanut 1-Aleph (>= 96) | `ALEPH` | Count | % |
| Metzuyanut 1-Bet (90-95) | `BET` | Count | % |
| Border Bet (86-89) | `BORDER_BET` | Count | % |
| Metzuyanut 1-Gimel (85) | `GIMEL` | Count | % |
| Border Gimel (81-84) | `BORDER_GIMEL` | Count | % |
| No excellence (< 81) | `NONE` | Count | % |

**Demo note:** Excellence tiers are displayed as badges in the grade grid and student detail views. The BORDER_BET and BORDER_GIMEL tiers replace the spreadsheet's risk levels 4 and 5. A dedicated excellence dashboard view is not yet implemented -- excellence data appears in the grid, KPI cards, and ranking view.

---

### 3.4 At-Risk Student Management [PARTIALLY IMPLEMENTED]

#### 3.4.1 Visual Risk Identification [IMPLEMENTED]

The system shall make risk levels immediately visible across all views:

- **In class grids:** Student row background color matches risk level (green/amber/red spectrum).
- **In student lists:** Risk level badge displayed prominently next to each student name.
- **In dashboards:** Risk distribution pie/bar charts per class and school-wide.
- **Score-level highlighting:**
  - Scores below 55: Red font (failing)
  - Scores 52-53: Light blue background with red font (borderline failing)
  - Scores 54: Cyan background with red font (barely below threshold)
  - Scores above 90: Blue font (excellence indicator)

#### 3.4.2 Challenging Students Workflow [IMPLEMENTED]

This replaces the "Meategarim" (challenging students) sections in the rikuz sheet.

**Three-category classification:**

| Category | Hebrew | Description | Typical Action |
|----------|--------|-------------|---------------|
| Especially Challenging | מאתגרים במיוחד | Students at serious risk of not receiving Bagrut | Direct conversation with Sarit required |
| Will Probably Pass | יעברו כנראה | Students with issues but likely to resolve | Monitor; may need light intervention |
| Close Follow-up | לטיפול צמוד של שירה ומחנכי הכיתה | Students needing ongoing tracking by counselor and homeroom teacher | Assigned to Shira and/or homeroom teacher |

**Workflow:**
1. Coordinator identifies students for the challenging list (manual selection or system suggestion based on rules).
2. Coordinator assigns category (Especially Challenging / Will Probably Pass / Close Follow-up).
3. Coordinator assigns responsible staff member(s): Sarit, Shira, Hila, or specific homeroom teacher.
4. Staff member records notes and action items.
5. System tracks whether follow-up occurred and outcomes.
6. At each exam period, the list is reviewed and updated.

**Example challenging student records (from actual data):**

| Student | Category | Notes | Assigned To |
|---------|----------|-------|-------------|
| Ben Ari Ram Asher | Especially Challenging | "Taking Language exam" | Sarit |
| Finkelkraut Bar Shlomo | Especially Challenging | "Taking Tanakh in winter + completing History now, checking re: 30% History" | Sarit |
| Geva Liat | Especially Challenging | "Not functioning" | Sarit/Hila |
| Betzalel Ido | Will Probably Pass | (flagged yellow) | Monitor |
| Hamar Romi | Close Follow-up | "Improvement" | Shira + homeroom |
| Levi-Kopelman Yotam | Close Follow-up | "Not functioning -- another conversation at Hila's" | Shira + Hila |
| Amir Ariel | Close Follow-up | "Did not take Math 381 in winter. Took Language in winter -- for conversation with Hila" | Shira + Hila |

#### 3.4.3 Individual Student Notes and Action Items [PARTIALLY IMPLEMENTED]

Each student record supports:
- Free-text notes (visible to all authorized users)
- Time-stamped entries (audit trail)
- Action items with assignee and due date
- Status tags: "At risk for Bagrut" (בסכנה לבגרות), "Not functioning" (לא מתפקד/ת), "Improvement" (שיפור), etc.
- Period-specific annotations (e.g., "Taking winter exam", "Completing History now")

#### 3.4.4 Staff Assignment [PARTIALLY IMPLEMENTED -- mock data assigns staff, no UI for reassignment]

- Each challenging student can be assigned to one or more staff members.
- Staff members see their assigned students in a personal dashboard.
- The system tracks assignment history (who was assigned when, and when reassigned).

#### 3.4.5 Intervention Tracking [NOT YET IMPLEMENTED]

Beyond the Excel's static notes, the digital system adds:
- **Intervention log:** Each conversation, meeting, or action recorded with date and outcome.
- **Outcome tracking:** Did the student improve? Did they take the makeup exam? What was the result?
- **Escalation path:** If a student's situation worsens, automatic escalation suggestion to a higher authority (Sarit -> Hila).
- **Period-over-period comparison:** Visual indicator showing whether the student's trajectory is improving, stable, or declining.

---

### 3.5 What-If / Gamification [IMPLEMENTED]

This replaces the Mishchuk (gamification) sheet.

#### 3.5.1 Projection Engine [IMPLEMENTED]

The system shall allow the coordinator (and optionally homeroom teachers) to simulate future exam outcomes:

**How it works:**
1. For each student, identify which exams are still pending (missing scores).
2. Apply a configurable projection method to estimate scores for those exams.
3. Recalculate the weighted average and eligibility status using both actual and projected scores.
4. Display the projected outcome alongside the current actual outcome.

**Default projection method (from the current Excel):**
```
Projected score = Student's best actual score - offset
Default offset = 5 points
```

This provides a "conservative but optimistic" estimate: the student is assumed to perform nearly as well as their best subject.

**Demo note:** The demo's WhatIfProjections page uses the "best score minus offset" method. It projects scores for students with missing core subjects (~18% of regular students, generated with 1-3 missing subjects). The projection recalculates weighted averages and eligibility status. Three KPI summary cards show current vs. projected totals. A config panel allows adjusting the offset value.

#### 3.5.2 Configurable Projection Offset [IMPLEMENTED]

- [ASSUMPTION - Q30] The default offset of -5 points is intentional and used in practice.
- The coordinator shall be able to adjust the offset per simulation run (e.g., -3 for optimistic, -10 for pessimistic).
- The system may also support per-subject or per-student offsets for more granular projections.

#### 3.5.3 Impact on Weighted Average and Eligibility [IMPLEMENTED]

The projection view shows:
- **Current weighted average** (based on actual scores only)
- **Projected weighted average** (including estimated scores for pending exams)
- **Delta** (how much the average would change)
- **Projected eligibility status** (would the student pass if projections hold?)
- **Projected excellence tier** (would the student achieve Metzuyanut?)

#### 3.5.4 Overall Average Including Electives [NOT YET IMPLEMENTED]

The gamification sheet includes an "overall average" (memutza kolel) that adds elective subject performance:

```
Overall Average = (Core Subjects Weighted Sum + ElectiveSofi5 * 5) / (CoreDenominator + 5)
```

[ASSUMPTION - Q31] This number is used for internal planning and student conversations, not for official Ministry reporting. It helps identify students whose elective performance significantly impacts their overall academic standing.

#### 3.5.5 Variable Denominator [IMPLEMENTED]

The gamification system uses a variable denominator (Column AV: "metoach yechidot" / out of units) that reflects how many total units each student has completed so far. This allows fair comparison between students at different stages of completion.

**Demo implementation:** The `computeWeightedAverage()` function in `mock-data.ts` implements variable-denominator averaging. For each of the 7 core subjects, if the student's final score is undefined or 0, both the subject's score and its unit weight are excluded from the calculation. This ensures students with missing subjects receive a fair average based only on completed work, rather than being penalized with 0s in the denominator.

---

### 3.6 Ranking and Sorting [IMPLEMENTED]

This replaces the Miyun (sorting) sheet.

#### 3.6.1 School-Wide Ranking by Weighted Average [IMPLEMENTED]

A ranked list of all students across the school, sorted by weighted average (descending).

**Display columns:**
- Rank number
- Class identifier (e.g., "yb 1")
- Student number
- Student name
- Math unit level
- English unit level
- Accommodations (icons)
- All subject scores (core + electives)
- Weighted average
- Eligibility status
- Risk level
- Excellence tier

**From the analysis:** The sorting sheet contains approximately 528 rows and 145 columns, covering all students and all possible subjects.

#### 3.6.2 Filtering and Sorting [IMPLEMENTED]

The ranking view supports:
- **Sort by:** Weighted average (default), any subject score, student name, class
- **Filter by class:** Show only students from specific class(es)
- **Filter by subject:** Show only students taking a specific elective
- **Filter by risk level:** Show only students at a specific risk level
- **Filter by eligibility status:** Show only students with specific status
- **Filter by unit level:** Show only 5-unit Math students, for example
- **Filter by accommodation:** Show only accommodated students
- **Search by name:** Free-text search for student name

#### 3.6.3 Export Capabilities [NOT YET IMPLEMENTED -- UI-only dropdown, no actual export logic]

- Export filtered/sorted lists to Excel (.xlsx)
- Export to CSV
- Export to PDF (formatted report)
- [ASSUMPTION] Print-optimized layout for physical distribution

---

## 4. Data Model [PARTIALLY IMPLEMENTED -- demo uses TypeScript interfaces, not a database]

**Demo note:** The demo implements a subset of the data model as TypeScript interfaces in `src/types/index.ts`. Key types implemented: `Student`, `SchoolClass`, `Subject`, `ExamPeriod`, `SubjectGrades`, `RikuzRow`, `EligibilityStats`, `FailureStats`, `PeriodKPIData`, `YearComparison`. The demo uses `RiskLevel` (3 levels: 1-3), `ExcellenceTier` (6 tiers: NONE through ALEPH), `UnitLevel` (3/4/5), `EligibilityStatus` (8 statuses), `AccommodationType` (4 types), and `ChallengeCategory` (3 categories) as const objects. There is no database or persistence layer -- all data is generated at runtime by `mock-data.ts`.

### 4.1 Entity-Relationship Overview

```
School (1) ----< (N) AcademicYear
AcademicYear (1) ----< (N) Class
AcademicYear (1) ----< (N) ExamPeriod
Class (1) ----< (N) StudentEnrollment >---- (N) Student (1)
Class (1) ----  (1) Staff [homeroom teacher]
School (1) ----< (N) Staff
Staff (1) ----< (N) StaffAssignment >---- (N) Student (1)

Subject (1) ----< (N) ExamQuestionnaire
Subject (1) ----< (N) SubjectFormula
Student (1) ----< (N) Grade
Grade (N) >---- (1) ExamQuestionnaire
Grade (N) >---- (1) ExamPeriod [optional: when score was received]

Student (1) ----< (N) RiskAssessment
RiskAssessment (N) >---- (1) ExamPeriod [snapshot at this period]

Student (1) ----< (N) EligibilitySnapshot
EligibilitySnapshot (N) >---- (1) ExamPeriod

Student (1) ----< (N) Note
Note (N) >---- (1) Staff [author]

Student (1) ----< (N) Accommodation
Student (1) ----< (N) ChallengeAssignment
ChallengeAssignment (N) >---- (1) Staff [assigned to]

AcademicYear (1) ----< (N) YearComparison
```

### 4.2 Core Entities

#### School

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | School name (e.g., "Sheifa") |
| code | String | Unique school code |
| contact_email | String | e.g., sheifa10@walla.com |
| website | String | e.g., www.sheifa.co.il |
| phone | String | e.g., 050-5343804 |
| fax | String | e.g., 08-9457692 |
| created_at | Timestamp | |
| updated_at | Timestamp | |

#### AcademicYear

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| school_id | FK -> School | |
| hebrew_name | String | e.g., "tashpeh" |
| display_name | String | e.g., 'תשפ"ה' |
| gregorian_start | Date | e.g., 2024-09-01 |
| gregorian_end | Date | e.g., 2025-08-31 |
| is_current | Boolean | Only one active per school |
| status | Enum | PLANNING, ACTIVE, COMPLETED, ARCHIVED |

#### Class

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| academic_year_id | FK -> AcademicYear | |
| number | Integer | Class number (1-16) |
| display_name | String | e.g., 'יב 1' |
| grade_level | Integer | e.g., 12 |
| homeroom_teacher_id | FK -> Staff | |
| class_type | Enum | REGULAR, SPECIAL (for class 12) |
| is_excluded_from_quality_metrics | Boolean | [ASSUMPTION] True for special classes |
| student_count | Integer (computed) | |

#### Student

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| school_id | FK -> School | |
| student_number | Integer | School-assigned number |
| first_name | String | Hebrew |
| last_name | String | Hebrew |
| full_name | String (computed) | Last + First (Hebrew convention) |
| math_unit_level | Enum | UNITS_3, UNITS_4, UNITS_5 |
| english_unit_level | Enum | UNITS_3, UNITS_4, UNITS_5 |
| bagrut_track | Enum | MATRICULATION, NON_MATRICULATION, WITHDRAWN |
| withdrawal_reason | String | Nullable; e.g., "Left abroad Jan 2024", "Transferred to Project Hila" |
| withdrawal_date | Date | Nullable |
| status | Enum | ACTIVE, TRANSFERRED, WITHDRAWN, GRADUATED |
| created_at | Timestamp | |
| updated_at | Timestamp | |

#### StudentEnrollment

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| class_id | FK -> Class | |
| enrolled_date | Date | When enrolled in this class |
| left_date | Date | Nullable; when left this class |
| is_current | Boolean | |
| transfer_note | String | e.g., "Transferred from Yud-Bet 11" |

This junction table supports mid-year class transfers (Anomaly 1: student "Shabbat Tal" transferred from Yud-Bet 11).

#### Subject

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| hebrew_name | String | e.g., 'מתמטיקה' |
| english_name | String | e.g., "Mathematics" |
| abbreviation | String | e.g., "מתמ'" |
| category | Enum | CORE, ELECTIVE, NON_ACADEMIC |
| is_mandatory | Boolean | Required for Bagrut eligibility |
| has_unit_levels | Boolean | True for Math, English |
| default_unit_level | Enum | UNITS_3, UNITS_4, UNITS_5, or NULL |
| is_included_in_weighted_avg | Boolean | [ASSUMPTION - A9] False for General Studies, Intro Sciences, PE, Community Service |
| sort_order | Integer | Display order in grids |

#### ExamQuestionnaire

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| subject_id | FK -> Subject | |
| code | String | Ministry exam code (e.g., "16381", "899373") |
| name | String | Human-readable name (e.g., "Module A") |
| unit_level | Enum | UNITS_3, UNITS_4, UNITS_5, or NULL |
| component_type | Enum | INTERNAL, EXTERNAL, ORAL, PERFORMANCE_TASK, PROJECT |
| weight_in_formula | Decimal | e.g., 0.27, 0.70 |
| formula_group | String | Groups questionnaires into a single Sofi (e.g., "MATH_SOFI_3") |
| sort_order | Integer | |
| is_active | Boolean | Can be deactivated if codes change year to year |

#### SubjectFormula

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| subject_id | FK -> Subject | |
| formula_name | String | e.g., "Sofi 3", "Sofi 4", "Sofi 5" |
| unit_level | Enum | UNITS_3, UNITS_4, UNITS_5 |
| formula_expression | String | JSON representation of the calculation |
| description | String | Human-readable description |

Example formula_expression for Math Sofi 3:
```json
{
  "type": "weighted_sum",
  "components": [
    { "questionnaire_code": "182", "weight": 0.25 },
    { "questionnaire_code": "381", "weight": 0.35 },
    { "questionnaire_code": "382", "weight": 0.40 }
  ]
}
```

#### ExamPeriod

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| academic_year_id | FK -> AcademicYear | |
| hebrew_name | String | e.g., 'לאחר קיץ תשפ"ד' |
| english_name | String | e.g., "After Summer 2024" |
| period_type | Enum | AFTER_SUMMER, AFTER_WINTER, AFTER_CORRECTIONS, PROJECTED |
| approximate_date | Date | |
| sort_order | Integer | 1-5 within academic year |
| categorization_mode | Enum | EXAM_MISSING, FAILURE_COUNT, QUESTIONNAIRE_BASED |
| is_active | Boolean | |

#### Grade

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| exam_questionnaire_id | FK -> ExamQuestionnaire | |
| academic_year_id | FK -> AcademicYear | |
| score | Decimal | Nullable; 0-100 |
| special_value | Enum | NULL, CHASAM (barrier), IKUV (delay), EXEMPT |
| is_manual_override | Boolean | True if coordinator manually set this |
| override_reason | String | Nullable |
| original_calculated_score | Decimal | Stored when override applied |
| entered_by | FK -> Staff | |
| entered_at | Timestamp | |
| updated_by | FK -> Staff | |
| updated_at | Timestamp | |

#### RiskAssessment

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| exam_period_id | FK -> ExamPeriod | |
| risk_level | Integer | 1-5 (full product) / 1-3 (demo) |
| is_system_suggested | Boolean | True if auto-calculated |
| is_manually_overridden | Boolean | True if coordinator changed it |
| assessed_by | FK -> Staff | |
| assessed_at | Timestamp | |
| notes | Text | |

#### EligibilitySnapshot

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| exam_period_id | FK -> ExamPeriod | |
| status | Enum | FULL_BAGRUT, FULL_DESPITE_MISSING, MISSING_1, MISSING_2, MISSING_3, MISSING_4, MISSING_4_PLUS, NON_MATRICULATION, WITHDRAWN |
| failure_count | Integer | Number of failing subjects at this point |
| questionnaires_to_correct | Integer | Number of questionnaires needing correction |
| missing_subjects | JSON | List of subject IDs still incomplete |
| weighted_average | Decimal | Calculated at snapshot time |
| excellence_tier | Enum | NONE, BORDER_GIMEL, GIMEL, BORDER_BET, BET, ALEPH |
| snapshot_date | Date | |

#### Accommodation

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| accommodation_type | Enum | ADAPTED (מותאם), DICTATION (הכתבה), ORAL (בע"פ), SPECIAL (ע"ח) |
| academic_year_id | FK -> AcademicYear | |
| applies_to_subject_id | FK -> Subject | Nullable (if applies to all subjects) |
| notes | Text | |

#### Note

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| exam_period_id | FK -> ExamPeriod | Nullable (if not period-specific) |
| content | Text | Free-text note |
| note_type | Enum | GENERAL, RISK_NOTE, INTERVENTION, STATUS_UPDATE |
| author_id | FK -> Staff | |
| created_at | Timestamp | |
| is_visible_to_all | Boolean | Access control for sensitive notes |

#### Staff

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| school_id | FK -> School | |
| first_name | String | |
| last_name | String | |
| full_name | String (computed) | |
| email | String | |
| role | Enum | COORDINATOR, HOMEROOM_TEACHER, SUBJECT_COORDINATOR, PRINCIPAL, COUNSELOR, ADMIN |
| is_active | Boolean | |

#### ChallengeAssignment

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| student_id | FK -> Student | |
| exam_period_id | FK -> ExamPeriod | |
| category | Enum | ESPECIALLY_CHALLENGING, WILL_PROBABLY_PASS, CLOSE_FOLLOW_UP |
| assigned_staff_id | FK -> Staff | |
| status | Enum | OPEN, IN_PROGRESS, RESOLVED, ESCALATED |
| notes | Text | Action items and observations |
| created_by | FK -> Staff | |
| created_at | Timestamp | |
| resolved_at | Timestamp | Nullable |
| resolution_notes | Text | |

#### YearComparison

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| school_id | FK -> School | |
| academic_year_id | FK -> AcademicYear | |
| total_students | Integer | |
| eligible_students | Integer | |
| eligibility_rate | Decimal | |
| english_4_unit_count | Integer | |
| english_5_unit_count | Integer | |
| math_4_unit_count | Integer | |
| math_5_unit_count | Integer | |
| honors_count | Integer | |
| is_finalized | Boolean | False for current year (in-progress) |

### 4.3 Constraints and Invariants

1. **One active enrollment per student.** A student can only be in one class at a time. Transfers create a new enrollment and close the old one.
2. **One score per questionnaire per student per year.** A student has at most one grade record per exam questionnaire per academic year. Corrections overwrite (with audit).
3. **Risk level per period.** Each student has at most one risk assessment per exam period.
4. **Eligibility snapshot per period.** Each student has exactly one eligibility snapshot per exam period.
5. **Class 12 separation.** Class 12 (type=SPECIAL) is always tracked separately in aggregation views, with an option to combine into school totals.
6. **Referential integrity.** All foreign keys enforced. Soft deletes only (no hard deletion of student data).

---

## 5. Business Rules

### 5.1 Grade Calculation Formulas -- Complete Catalog [IMPLEMENTED for Math/English multi-component; standard internal/external for others]

The following formulas are the core business logic of the system. They were extracted from the actual Excel workbook and must be implemented with exact precision.

#### 5.1.1 Mathematics Final Scores

**Sofi 3 (3-unit level):**
```
MathSofi3 = Q382 * 0.40 + Q381 * 0.35 + Q182 * 0.25
```
Where Q182 = score on questionnaire 182/183, Q381 = score on questionnaire 381, Q382 = score on questionnaire 382.

**Sofi 4 (4-unit level):**
```
MathSofi4 = Q481 * 0.65 + Q482 * 0.35
```

**Sofi 5 (5-unit level):**
```
MathSofi5 = Q581 * 0.60 + Q582 * 0.40
```

#### 5.1.2 English Final Scores

**Sofi 3 (3-unit level):**
```
EnglishSofi3 = Oral3 * 0.20 + ModuleC * 0.27 + ModuleB * 0.26 + ModuleA * 0.27
```

**Sofi 4 (4-unit level):**
```
EnglishSofi4 = Oral4 * 0.20 + ModuleB * 0.27 + ModuleA * 0.26 + ModuleD * 0.27
```
Note: [ASSUMPTION] Sofi 4 formula inferred from Class 12 pattern. The component mapping may differ.

**Sofi 5 (5-unit level):**
```
EnglishSofi5 = Oral5 * 0.20 + ModuleG * 0.27 + ModuleF * 0.26 + ModuleE * 0.27
```

#### 5.1.3 Standard 30/70 Subjects

**History:**
```
HistoryFinal = External * 0.70 + Internal * 0.30
```

**Tanakh (Bible):**
```
TanakhFinal = External * 0.70 + Internal * 0.30
```

**Literature:**
```
LiteratureFinal = External * 0.70 + Internal * 0.30
```

**Hebrew Language:**
```
LanguageFinal = External * 0.70 + Internal * 0.30
```

#### 5.1.4 Civics -- Special 80/20

```
CivicsFinal = Exam * 0.80 + PerformanceTask * 0.20
```

#### 5.1.5 Elective Subject Formulas

**Computer Science (מדעי המחשב):**
```
CSFinal5 = Component1 * 0.70 + Component2 * 0.30
```
Note: Some classes show a 76%/24% variant. [ASSUMPTION] The 70/30 is standard; 76/24 may apply when a third component (883589) is involved.

**Physics (פיזיקה):**
```
PhysicsFinal5 = Q371 * 0.25 + Q283 * 0.30 + Q376 * 0.15 + Q361 * 0.30
```

**Jewish Law / Oral Torah (חוק"ש תושב"ע):**
```
JewishLawFinal5 = Q7281 * 0.50 + Q7383 * 0.50
```

**Geography (גאוגרפיה):**
```
GeographyFinal5 = Q57238 * 0.40 + Q57381 * 0.60
```

**Management and Economics (מנהל וכלכלה):**
```
MgmtEconFinal5 = Q381 * 0.70 + Q839283 * 0.30
```

**Spanish (ספרדית):**
```
SpanishFinal5 = Q579283 * 0.40 + Q579385 * 0.60
```

**Communications (תקשורת) -- Class 12 only:**
```
CommFinal5 = Q56283 * 0.50 + Q56387 * 0.50
```

**Other electives** (Chemistry, Biology, Social Sciences, Arabic, French, Italian, Chinese, Philosophy, Film/Cinema, Medical Sciences, Music, Dance, Theater, Extended Bible):
[ASSUMPTION] Standard 30%/70% (internal/external) unless otherwise documented. The system must support custom weight configuration per subject to accommodate Ministry changes.

#### 5.1.6 Weighted Average Formula [IMPLEMENTED -- variable denominator]

**Core formula structure:**
```
WeightedAverage = (MathFinal * MathUnits + HistoryFinal * 2 + CivicsFinal * 2 + TanakhFinal * 2 + LiteratureFinal * 2 + LanguageFinal * 2 + EnglishFinal * EnglishUnits) / TotalUnits
```

Where `TotalUnits = MathUnits + 2 + 2 + 2 + 2 + 2 + EnglishUnits`.

**Demo implementation (variable denominator):** The demo's `computeWeightedAverage()` function uses a **variable denominator** approach. If a core subject has a missing or zero final score, that subject's score AND its unit weight are excluded from both the numerator and denominator. This prevents students with incomplete exams from receiving artificially low averages. For example, a student missing History (2 units) would have their average calculated over `TotalUnits - 2` instead of the full `TotalUnits`. This matches the gamification sheet's approach in the original spreadsheet.

**Concrete instances:**

| Math Level | English Level | Denominator | Example |
|-----------|--------------|-------------|---------|
| 5 | 5 | 20 | Most common |
| 5 | 4 | 19 | [ASSUMPTION] |
| 5 | 3 | 18 | [ASSUMPTION - Q21] |
| 4 | 4 | 18 | Confirmed in data |
| 4 | 3 | 17 | [ASSUMPTION] |
| 3 | 5 | 18 | [ASSUMPTION] |
| 3 | 4 | 17 | [ASSUMPTION] |
| 3 | 3 | 16 | [ASSUMPTION] |

**Gamification overall average (including elective):**
```
OverallAverage = (CoreWeightedSum + ElectiveFinal * 5) / (TotalUnits + 5)
```

#### 5.1.7 Aggregation Formulas

**Class average per subject:**
```
ClassAverage(Subject) = AVERAGE(all student scores in that subject for the class, excluding nulls/specials)
```

**Student count per subject:**
```
SubjectCount(Subject) = COUNT(non-null, non-special scores for that subject in the class)
```

**Category counts (for rikuz):**
```
CategoryCount(Category, Class) = COUNT(students in Class whose eligibility status = Category)
```

**School total:**
```
SchoolTotal(Category) = SUM(CategoryCount(Category, Class) for all regular classes)
```

**Cumulative percentage:**
```
CumulativeRate(n) = SUM(rate for categories 0 through n) / TotalStudents
```

**Year-over-year rate:**
```
EligibilityRate(Year) = EligibleStudents(Year) / TotalStudents(Year)
```

### 5.2 Eligibility Determination Rules [IMPLEMENTED]

[ASSUMPTION - Q10, Q11, Q12] The following rules determine full Bagrut eligibility:

1. **Pass all mandatory core subjects** (score >= 55 in final calculated score):
   - Mathematics (at any unit level)
   - History
   - Civics
   - Tanakh (Bible)
   - Literature
   - Hebrew Language
   - English (at any unit level)

2. **Complete additional requirements:**
   - General Studies: [ASSUMPTION] Pass (55+) or completion
   - Introduction to Sciences: [ASSUMPTION] Pass or completion
   - Physical Education: [ASSUMPTION] Pass or completion
   - Community Service: [ASSUMPTION] Value >= 1 (completed)

3. **Elective subject:** [ASSUMPTION - Q12] At least one 5-unit elective must be passed for full Bagrut.

4. **"Full Bagrut despite missing exam":** [ASSUMPTION - Q13, Q14, Q15] A student may qualify if they meet all core requirements but have one non-core subject incomplete. This is classified as full eligibility in cumulative statistics.

5. **Non-matriculation exception:** Students flagged as "lo begrutim" are excluded from eligibility calculations entirely.

### 5.3 Passing Threshold and Borderline Ranges [IMPLEMENTED]

| Score Range | Status | Visual Treatment |
|------------|--------|-----------------|
| 55 and above | Passing | Default (no special formatting) |
| 54 | Borderline -- very close | Cyan background (FF00B0F0), red font |
| 52-53 | Borderline -- close | Light blue background (FF8DB3E2), red font |
| Below 52 | Failing | Red font (FFFF0000) |
| 90 and above | Excellence indicator | Blue font (FF548DD4) |

### 5.4 Risk Level Assignment Rules [IMPLEMENTED -- auto-calculated, manual override not yet available]

**Demo implementation (3-level auto-calculated):**

The demo auto-calculates risk levels based on core subject failure count and weighted average:

| Condition | Risk Level |
|-----------|-----------|
| 0 failures | 1 (on track) |
| 1 failure, weighted average >= 65 | 2 (risk) |
| 1 failure, weighted average < 65 | 3 (high risk) |
| 2+ failures | 3 (high risk) |

Excellence proximity is tracked separately via the ExcellenceTier system (BORDER_BET for 86-89, BORDER_GIMEL for 81-84) rather than as risk levels 4 and 5.

**Full product (5-level with manual override):**

[ASSUMPTION - Q7, Q8] In the full product, risk levels should be manually assigned with auto-suggestions:

| Condition | Suggested Risk Level |
|-----------|---------------------|
| 0 failing/missing exams AND weighted average >= 85 | 1 (High chance) |
| 0-1 failing AND weighted average < 85 | 2 (Risk) |
| 2+ failing/missing exams | 3 (High risk) |
| 0-1 failing AND weighted average 86-89 (close to 1-Bet threshold) | 4 (Risk to Excellence 1-Bet) |
| 0-1 failing AND weighted average 81-84 (close to 1-Gimel threshold) | 5 (Risk to Excellence 1-Gimel) |

The coordinator can always override auto-suggestions. Override actions are logged with reason.

[ASSUMPTION - Q9] Risk levels are updated after each exam period but can be changed at any time.

### 5.5 Period Transition Logic [NOT YET IMPLEMENTED]

When a new exam period becomes active:

1. **Snapshot creation:** The system creates an EligibilitySnapshot for every active student, capturing their current status at that point in time.
2. **Risk reassessment prompt:** The system prompts the coordinator to review and update risk levels.
3. **Challenging students review:** The system prompts review of the challenging students list.
4. **Aggregation recalculation:** All rikuz totals, cumulative percentages, and dashboards update automatically.
5. **Historical preservation:** Previous period's data is frozen and immutable (except via admin override with audit).

### 5.6 Corrections Process (תיקונים והשלמות) [NOT YET IMPLEMENTED]

[ASSUMPTION - Q44, Q45, Q46]:
- Students can request to retake failed exams or submit additional work.
- The new score replaces the old score (the higher of the two is kept).
- Corrections have a defined window (the "after winter + corrections" period).
- The system tracks both original and corrected scores in the Grade entity (via audit trail).

### 5.7 Configurable Business Rules [NOT YET IMPLEMENTED]

The following business rules are configurable by administrators and coordinators through a dedicated **Settings > Business Rules** screen. Each rule has a system default (matching the current spreadsheet behavior) and can be overridden per school, per academic year.

#### 5.7.1 Passing Threshold

| Setting | Default | Configurable By | Scope |
|---------|---------|-----------------|-------|
| Global passing grade | 55 | Admin | School-wide |
| Per-subject override | None | Admin | Per subject |

The passing threshold determines: failing score color coding (red font), eligibility calculations, and risk level auto-suggestions. Some accommodated exams or specific subjects may have different thresholds per Ministry policy.

#### 5.7.2 Excellence Tier Thresholds

| Tier | Default Threshold | Configurable By | Notes |
|------|-------------------|-----------------|-------|
| Metzuyanut 1-Aleph | >= 96 | Admin | Highest honors |
| Metzuyanut 1-Bet | >= 90 | Admin | Second tier |
| Border Bet (proximity alert) | >= 86 | Coordinator | Students close to Bet threshold |
| Metzuyanut 1-Gimel | >= 85 | Admin | Third tier |
| Border Gimel (proximity alert) | >= 81 | Coordinator | Students close to Gimel threshold |

The border tiers are configurable separately from the official tiers since they represent the school's proactive intervention range, not Ministry definitions.

#### 5.7.3 Subject Weight Formulas

Managed via **Settings > Subject and Formula Management**. Each subject defines:

- **Component list:** Which questionnaire codes / exam parts make up the subject
- **Weight per component:** Percentage weight in the final calculated score (must sum to 100%)
- **Weight variants:** Support for alternative weight sets (e.g., CS 70/30 vs. 76/24) selectable per class or student

Weights are locked per academic year once scores are entered to prevent retroactive recalculation without an audit trail. Changes apply to future periods only, unless an admin explicitly triggers a full recalculation with logged justification.

#### 5.7.4 Risk Level Auto-Suggestion Rules

The system auto-suggests risk levels but coordinators can override. The suggestion rules are configurable:

| Parameter | Default | Configurable By |
|-----------|---------|-----------------|
| Failure count thresholds | 0 = on track, 1 = risk, 2+ = high risk | Coordinator |
| Weighted average cutoff for risk escalation | 65 (1 failure + avg < 65 → high risk) | Coordinator |
| Enable/disable auto-suggestion | Enabled | Coordinator |
| Require reason for manual override | Yes | Admin |

#### 5.7.5 Weighted Average — Subject Inclusion

| Setting | Default | Configurable By |
|---------|---------|-----------------|
| Core subjects included in weighted average | Math, History, Civics, Tanakh, Literature, Language, English | Admin |
| Unit weight per subject | Math: 3/4/5, English: 3/4/5, all others: 2 | Admin |
| Include electives in "overall" average | Yes (separate metric) | Coordinator |
| Primary display metric | Standard (core only) | Coordinator |
| Variable denominator (skip missing subjects) | Enabled | Admin |

#### 5.7.6 Eligibility Determination Rules

| Rule | Default | Configurable By | Notes |
|------|---------|-----------------|-------|
| Mandatory core subjects for eligibility | All 7 core subjects must be passed | Admin | List of subject IDs |
| Additional required completions | General Studies, Intro Sciences, PE, Community Service | Admin | Pass or completion |
| Elective requirement | At least one 5-unit elective passed | Admin | Can be disabled for specific tracks |
| "Full Bagrut despite missing exam" policy | Enabled for non-core subjects | Admin | Ministry policy toggle |
| Non-matriculation exclusion from eligibility stats | Enabled | Admin | Per-student flag |

#### 5.7.7 Score Color Coding Thresholds

| Threshold | Default | Configurable By | Visual Treatment |
|-----------|---------|-----------------|-----------------|
| Failing score upper bound | < 55 (uses passing threshold) | Linked to 5.7.1 | Red font |
| Borderline range — close | 52-53 | Coordinator | Light blue background + red font |
| Borderline range — very close | 54 | Coordinator | Cyan background + red font |
| Excellence indicator | >= 90 | Coordinator | Blue font |

These thresholds control the color-coded visual indicators in all grade grid views. The failing threshold is always linked to the global passing threshold (5.7.1).

#### 5.7.8 What-If Projection Settings

| Setting | Default | Configurable By |
|---------|---------|-----------------|
| Projection offset | -5 (highest score minus 5) | Coordinator |
| Student inclusion filter | Students with missing exams and room for improvement | Coordinator |
| Show projected excellence tier | Yes | Coordinator |
| Allow per-student offset override | Yes | Coordinator |

#### 5.7.9 Class Exclusion Rules

| Setting | Default | Configurable By |
|---------|---------|-----------------|
| Exclude from quality metrics | Per-class toggle (default: only Class 12) | Admin |
| Exclude from school-wide ranking | Per-class toggle (default: none excluded, but filterable) | Admin |
| Exclude from year-over-year comparison | Follows quality metrics toggle | Admin |

#### 5.7.10 Exam Period Definitions

Managed via **Settings > Academic Year Management**. Per academic year:

| Setting | Default | Configurable By |
|---------|---------|-----------------|
| Number of periods | 4 | Admin |
| Period names | Summer 11th, Summer 12th, Winter 12th, Corrections | Admin |
| Period date ranges | Admin-defined | Admin |
| Period ordering | Sequential | Admin |
| Active period | Most recent | Coordinator |
| Allow corrections period | Yes | Admin |

#### 5.7.11 Challenging Student Categories

| Setting | Default | Configurable By |
|---------|---------|-----------------|
| Category list | "מאתגרים במיוחד" (Especially challenging), "יעברו כנראה" (Will probably pass), "מעקב צמוד" (Close follow-up) | Coordinator |
| Category colors | Red, Amber, Blue | Coordinator |
| Allow custom categories | Yes | Admin |
| Maximum categories | 10 | Admin |

Coordinators can add, rename, reorder, and color-code categories to match their school's intervention workflow.

#### 5.7.12 Statistics Denominator Rules

| Setting | Default | Configurable By |
|---------|---------|-----------------|
| Primary denominator | "Quality" (excluding special education classes) | Coordinator |
| Show both denominators | Yes | Coordinator |
| Custom exclusion criteria | By class exclusion flag (5.7.9) | Admin |

The dashboard, rikuz matrix, and year-over-year comparison views all respect the selected denominator. Both values are always available — this setting controls which is shown as the primary/default.

#### Business Rules Audit

All business rule changes are logged in the audit trail (Section 8.5) with:
- Rule identifier, old value, new value
- Changed by (user), timestamp
- Reason (required for threshold changes)
- Academic year scope

Rules are versioned per academic year. Changing a rule mid-year triggers a confirmation dialog showing the impact (e.g., "This change would reclassify 12 students' excellence tiers").

---

## 6. Color System and Visual Design Language [IMPLEMENTED]

**Demo note:** All 15 background colors and 5 font colors from the spreadsheet are implemented as design tokens in `src/lib/colors.ts`. The file exports `BG_COLORS` (15 background tokens), `TEXT_COLORS` (5 font tokens), `SCORE_COLORS` (4 score conditional tokens), `RISK_COLORS` (3 risk level mappings), and `EXCELLENCE_COLORS` (6 excellence tier mappings). Helper functions `getScoreCellStyle()`, `getRiskBadgeStyle()`, `getExcellenceBadgeStyle()`, and `getWeightedAverageCellStyle()` provide ready-to-use inline style objects.

### 6.1 Background Color Mapping [IMPLEMENTED]

The Excel file uses 15 distinct background colors. The digital system translates these into a semantic design system.

| Excel Color Code | Visual | Semantic Meaning | Digital System Token | Usage |
|-----------------|--------|-----------------|---------------------|-------|
| `FFC2D69B` | Light green | On track / passing / eligible | `--status-passing` | Student row bg, tracking grid |
| `FFFFFF00` | Yellow | At risk / needs attention | `--status-at-risk` | Student row bg, tracking grid, challenging students |
| `FFD99594` | Pink/salmon | High risk / many failures | `--status-high-risk` | "4+ missing" labels, rikuz categories |
| `FFFF0000` | Bright red | Non-matriculation student | `--status-non-matric` | Column A flag bg |
| `FF92D050` | Bright green | Internal exam marker | `--component-internal` | Subject header bg for internal components |
| `FFEF31CF` | Magenta/hot pink | External exam marker | `--component-external` | Subject header bg for external components |
| `FF00B0F0` | Cyan | Score at threshold (54) | `--score-threshold-54` | Score cell bg |
| `FF8DB3E2` | Light blue | Score borderline (52-53) | `--score-threshold-52` | Score cell bg |
| `FFFFC000` | Amber/gold | Risk level 3 background | `--risk-level-3` | Risk indicator bg |
| `FFFBD4B4` | Peach/light salmon | Risk level 5 background | `--risk-level-5` | Risk indicator bg |
| `FF548DD4` | Medium blue | Exam period header | `--period-header-1` | Section dividers |
| `FFB2A1C7` | Purple/lavender | Exam period header | `--period-header-2` | Section dividers |
| `FFC4BD97` | Tan/khaki | Exam period header | `--period-header-3` | Section dividers |
| `FFC6D9F0` | Pale blue/ice | Exam period header | `--period-header-4` | Section dividers |
| `FFF2DBDB` | Very light pink/blush | Below-average weighted avg cells | `--score-below-average` | Weighted average cell bg |

### 6.2 Font Color Mapping [IMPLEMENTED]

| Excel Color Code | Visual | Semantic Meaning | Digital System Token | Usage |
|-----------------|--------|-----------------|---------------------|-------|
| `FFFF0000` | Red | Failing grade (below 55) | `--text-failing` | Score values, risk level 4-5 text |
| `FF548DD4` | Blue | Excellence (above 90) | `--text-excellence` | High score values |
| `FF92D050` | Green | Class average values | `--text-average` | Aggregate row values |
| `FFE36C09` | Orange | Risk level 2 text / cumulative % | `--text-risk-2` | Risk indicators, rikuz cumulative |
| `FF993366` | Dark magenta | Contact info / meta text | `--text-meta` | Non-data informational text |

### 6.3 Digital Design System Principles [PARTIALLY IMPLEMENTED]

The digital system must preserve the information density that makes the Excel effective while adding clarity:

1. **Color consistency.** Map the 15+4 Excel colors to a cohesive design palette. Use the same semantic meaning but with more modern, accessible color values that meet WCAG AA contrast requirements.

2. **Color as reinforcement, not sole indicator.** Always pair color with a text label, icon, or badge. This ensures accessibility for color-blind users and reduces ambiguity.

3. **Density-first design.** The grid view should aim for similar data density as the Excel -- the coordinator needs to see 30+ columns and 40+ rows at a glance. This means:
   - Compact row heights
   - Narrow column widths with tooltips for full values
   - Abbreviated headers with hover expansion
   - Horizontal scrolling with frozen student name/number columns

4. **Progressive disclosure.** Start with the dense grid (familiar to Sarit), but allow clicking any cell to expand into a detailed view with full context, history, and actions.

5. **RTL Hebrew interface.** The entire application must be right-to-left:
   - Text alignment: right
   - Grid scroll direction: right-to-left for columns (student name frozen on right)
   - Navigation: right-to-left flow
   - Charts: axis orientation may vary (numbers typically left-to-right even in RTL)

### 6.4 Risk Level Visual System [IMPLEMENTED -- 3 levels]

**Demo implementation (3 risk levels + 6 excellence tiers):**

| Level | Background | Text | Badge |
|-------|-----------|------|-------|
| 1 | Green (#C2D69B) | Black | "1" in green badge |
| 2 | Transparent | Orange (#E36C09) | "2" in orange badge |
| 3 | Amber (#FFC000) | Black | "3" in amber badge |

**Excellence tier visual system (separate badges displayed alongside risk):**

| Tier | Background | Text | Border |
|------|-----------|------|--------|
| ALEPH | Gold (#fbbf24) | Dark brown (#78350f) | Solid |
| BET | Indigo (#a5b4fc) | Dark indigo (#3730a3) | Solid |
| BORDER_BET | Light indigo (#c7d2fe) | Indigo (#4338ca) | Dashed (#4338ca) |
| GIMEL | Light purple (#ddd6fe) | Purple (#6d28d9) | Solid |
| BORDER_GIMEL | Lighter purple (#ede9fe) | Violet (#7c3aed) | Dashed (#7c3aed) |
| NONE | Transparent | Slate (#94a3b8) | None |

**Full product (5 risk levels):**

| Level | Background | Text | Icon | Badge |
|-------|-----------|------|------|-------|
| 1 | Green (#C2D69B) | Default | Checkmark | "1" in green circle |
| 2 | None | Orange (#E36C09), bold | Warning triangle | "2" in orange circle |
| 3 | Amber (#FFC000) | Default | Exclamation | "3" in amber circle |
| 4 | None | Red (#FF0000), bold | Falling trend arrow | "4" in red circle |
| 5 | Peach (#FBD4B4) | Red (#FF0000) | Double exclamation | "5" in red circle with border |

---

## 7. UX/UI Concepts

### 7.1 Navigation Structure [PARTIALLY IMPLEMENTED]

The application uses a primary navigation with four main sections, each containing sub-views.

**Demo implementation:** The demo provides a sidebar (right side in RTL) with links to: Dashboard, Students (routes to dashboard), Class pages (16 classes), Ranking, Challenging Students, Analytics (What-If Projections), and Settings (placeholder). Not all navigation items from the full spec are present.

```
[School Dashboard]                    -- School-wide overview
  |-- Eligibility Summary (Rikuz)    -- Replaces rikuz sheet
  |-- Year-over-Year Comparison      -- Replaces hashvaa sheet
  |-- Excellence Overview            -- Metzuyanut tracking
  |-- At-Risk Overview               -- School-wide risk summary
  |
[Class View]                          -- Per-class operations
  |-- Grade Grid                     -- Replaces individual class sheets
  |-- Class Summary                  -- Class-level dashboard
  |-- Class Tracking Grid            -- Student status trajectory
  |-- Class Notes                    -- Homeroom teacher notes
  |
[Student View]                        -- Individual student deep dive
  |-- Student Profile                -- Demographics, accommodations, unit levels
  |-- Grade Detail                   -- All scores across all subjects
  |-- Eligibility Status             -- Current status with missing items
  |-- Risk Assessment History        -- Risk level trajectory
  |-- Notes and Interventions        -- All notes, actions, conversations
  |-- What-If Projection             -- Individual gamification
  |
[Ranking]                             -- School-wide ranking
  |-- Weighted Average Ranking       -- Replaces miyun sheet
  |-- Subject-Level Ranking          -- Per-subject rankings
  |
[At-Risk Management]                  -- Intervention workflow
  |-- Challenging Students List      -- Replaces meategarim section
  |-- My Assigned Students           -- Per-staff filtered view
  |-- Intervention Log               -- All interventions school-wide
  |
[Analytics]                           -- Advanced analysis
  |-- What-If Projections            -- Replaces mishchuk sheet (batch)
  |-- Trend Analysis                 -- Multi-year trends
  |-- Subject Performance            -- Cross-class subject analysis
  |-- Export Center                  -- Data export tools
  |
[Settings] (Admin/Coordinator)
  |-- Business Rules Configuration    -- Thresholds, formulas, eligibility (Section 5.7)
  |-- Academic Year Management
  |-- Class Configuration
  |-- Subject and Formula Management
  |-- User Management
  |-- Data Import/Export
  |-- Audit Log
```

### 7.2 Key Screen Descriptions

#### 7.2.1 School Dashboard (Home Screen) [IMPLEMENTED]

**Purpose:** Replace the rikuz sheet with an interactive, real-time dashboard.

**Layout:**
- **Top banner:** School name, current academic year, active exam period, total student count.
- **KPI cards (horizontal row):**
  - Total students: 503
  - Full Bagrut eligible: 465 (92.4%)
  - At-risk students: [count at risk levels 2-3 in demo]
  - Excellence candidates: 174 (34.6%)
  - Trend arrow for each vs. prior period
- **Main grid (center):** The rikuz matrix -- classes as columns, eligibility categories as rows. Clickable cells for drill-down.
- **Side panel (left in RTL):** Quick access to challenging students, recent notes, pending actions.
- **Bottom section:** Mini year-over-year trend charts (line charts showing eligibility rate, honors rate, etc.).

#### 7.2.2 Class Grade Grid [IMPLEMENTED]

**Purpose:** Replace individual class Excel sheets for data entry and review.

**Layout:**
- **Header:** Class name (e.g., "כיתה יב 1 -- תשפ"ה"), homeroom teacher name, student count, period selector.
- **Grid legend ("מקרא"):** [IMPLEMENTED] A collapsible legend panel (GridLegend component) showing all visual conventions:
  - Risk levels (1-3) with color-coded badges
  - Excellence tiers (ALEPH through NONE) with badges
  - Score color rules (failing < 55, excellence 90+, borderline 52-54)
  - Column background colors (questionnaire, internal, external, final, pass/fail)
  - Accommodation abbreviations (מות, הכת, בע"פ, ע"ח)
  - Pass/fail indicators (V / X)
  The legend is collapsed by default and toggled via a "מקרא" button below the class header.
- **Grid:** Spreadsheet-like grid (TanStack Table) with:
  - **8 frozen columns** (right side in RTL, sticky positioning): Math unit level, English unit level, student number, student name, accommodations, risk level badge, excellence tier badge, weighted average
  - **Spreadsheet-style column filters** [IMPLEMENTED] on all frozen columns:
    - **Checkbox multi-select filters:** For unit levels (3/4/5), risk levels (1/2/3), excellence tiers, accommodation types
    - **Text search filter:** For student name, using substring matching
    - **Range filter (min/max):** For weighted average column
    - Each filter appears as a small funnel icon in the column header that opens a popover. Active filters are highlighted in blue.
  - Scrollable columns: All subject components organized by subject group
  - Subject group headers with internal/external color coding
  - Sofi (final score) columns highlighted
  - Weighted average column prominently positioned
- **Bottom summary rows:** [IMPLEMENTED]
  - Class average per column (green text)
  - Student count per column (exam count)
  - Failing count per column (red text)
- **Entry mode:** [NOT YET IMPLEMENTED] The demo grid is read-only. Full product: Click any cell to enter edit mode. Tab to advance. Validation on entry (0-100, or special value selection).
- **Color coding:** [IMPLEMENTED] Automatic -- scores below 52 get red text, 52-53 get light blue background (#8DB3E2) with red text, 54 gets cyan background (#00B0F0) with red text, above 90 get blue text (#548DD4).

#### 7.2.3 Student Detail View [IMPLEMENTED]

**Purpose:** Comprehensive view of a single student's Bagrut journey.

**Layout:**
- **Header card:** Student name, class, student number, unit levels (Math/English), accommodations badges, risk level badge, eligibility status.
- **Score summary table:** All subjects with internal, external, and final scores. Color-coded. Missing items highlighted.
- **Eligibility checklist:** Checklist of all requirements with pass/fail indicators. Clear visualization of what is missing.
- **Trajectory timeline:** Visual timeline showing status at each exam period (green/yellow/red dots along a horizontal line).
- **Notes and interventions:** Chronological list of all notes, actions, and conversations.
- **What-if section:** Interactive projection tool for this student.

#### 7.2.4 Challenging Students View [IMPLEMENTED]

**Purpose:** Replace the meategarim sections from the rikuz sheet.

**Layout:**
- **Three-column Kanban-style layout:**
  - Column 1: Especially Challenging (מאתגרים במיוחד)
  - Column 2: Will Probably Pass (יעברו כנראה)
  - Column 3: Close Follow-up (לטיפול צמוד)
- Each student card shows: Name, class, assigned staff, key notes, number of missing exams.
- Drag-and-drop between columns to reclassify.
- Click to expand with full detail.
- Filter by assigned staff member, class, exam period.

#### 7.2.5 Ranking View [IMPLEMENTED]

**Purpose:** Replace the miyun sheet.

**Layout:**
- **Full-width data table** with all students ranked by weighted average.
- **Column configuration:** User can show/hide columns (not all 145 columns from the Excel need to be visible simultaneously).
- **Filter bar:** Dropdowns for class, risk level, eligibility status, unit level, accommodation.
- **Search box:** Free-text search by student name.
- **Export button:** Excel, CSV, PDF options.

#### 7.2.6 What-If Projections (Gamification) [IMPLEMENTED]

**Purpose:** Replace the mishchuk sheet.

**Layout:**
- **Configuration panel:** Set projection offset (default: -5), select students to include, optionally override per-student.
- **Results table:** Two-column view -- actual vs. projected weighted average. Delta column. Projected eligibility status.
- **Highlight:** Students who would cross a threshold (failing to passing, or reaching excellence tier) are prominently marked.
- **Scenario save:** Save projections as named scenarios for comparison.

### 7.3 RTL Hebrew Interface Requirements [IMPLEMENTED]

| Requirement | Implementation |
|------------|---------------|
| Text direction | `dir="rtl"` on root element |
| Text alignment | Default right-aligned for Hebrew text; left-aligned for numbers |
| Grid layout | Student name/number frozen on the RIGHT side; columns scroll leftward |
| Navigation | Primary nav on the right side |
| Icons | Mirrored where directional (arrows, etc.) |
| Date format | Hebrew date format supported; Gregorian as secondary |
| Font selection | System Hebrew fonts (e.g., Heebo, Assistant, Rubik) with good numeric rendering |
| Input direction | Hebrew text input right-to-left; numbers left-to-right within their field |
| Charts | Generally not mirrored (x-axis left-to-right is standard even in RTL contexts) |

### 7.4 Mobile Responsiveness [NOT YET IMPLEMENTED]

While the primary use case is desktop (given the information density), the system should provide useful mobile views:

| View | Mobile Approach |
|------|----------------|
| School Dashboard | KPI cards stack vertically; rikuz matrix becomes scrollable card list |
| Class Grade Grid | Not practical on mobile; show student list with expandable rows |
| Student Detail | Full functionality on mobile -- card-based layout |
| Challenging Students | Kanban becomes vertical list with filter tabs |
| Ranking | Simplified table with essential columns; horizontal scroll |
| What-If | Functional but simplified layout |
| Alerts/Notifications | Full mobile notification support |

### 7.5 Preserving Information Density [PARTIALLY IMPLEMENTED]

The biggest UX risk is losing the "at-a-glance" capability that makes the Excel effective. Strategies to preserve this:

1. **Configurable column visibility.** Let users show/hide columns to focus on what matters.
2. **Compact mode.** A toggle that reduces row height, font size, and padding to maximize visible data.
3. **Heatmap overlays.** Apply color gradients to numeric cells so patterns pop visually without reading each number.
4. **Summary rows always visible.** Class averages and counts pinned at the bottom of the grid.
5. **Inline editing.** No modal dialogs for data entry -- edit directly in the grid cell.
6. **Keyboard shortcuts.** Full keyboard navigation for power users (Tab, arrow keys, Enter, Ctrl+S).
7. **Saved views.** Let users save custom column configurations as named views (e.g., "Math Focus", "At Risk Only", "All Subjects").

---

## 8. Non-Functional Requirements [NOT YET IMPLEMENTED -- demo is a client-side SPA with mock data]

### 8.1 Multi-School Support [NOT YET IMPLEMENTED]

The system is architected for multi-tenant deployment:

- **Data isolation:** Each school's data is fully isolated. No cross-school data access except for system admins.
- **Configuration independence:** Each school can have different subjects, formulas, class structures, and exam periods.
- **Shared subject catalog:** A master catalog of Ministry-defined subjects and questionnaire codes is maintained centrally and can be customized per school.
- **Branding:** Each school tenant can have its own name and logo displayed.
- **User management:** Users belong to a specific school. A system admin can manage multiple schools.

### 8.2 Role-Based Access Control (RBAC) [NOT YET IMPLEMENTED]

See Section 2.2 for the complete role-permission matrix. Additional requirements:

- **Fine-grained permissions.** Beyond role-level access, support per-class and per-subject restrictions.
- **Row-level security.** A homeroom teacher sees only students in their class. A counselor sees only assigned students.
- **Audit all access.** Every data read/write is logged with user identity and timestamp.
- **Session management.** Token-based authentication with configurable session timeout.
- **SSO integration.** [ASSUMPTION] Support for future SSO integration (e.g., Google Workspace used by Israeli schools).

### 8.3 Data Import/Export [NOT YET IMPLEMENTED]

#### Import

- **xlsx import from existing format.** The system must be able to import the specific Excel format analyzed (sarit-example.xlsx structure). See Section 9 for detailed migration strategy.
- **Bulk score import.** CSV or Excel upload of scores for a batch of students (e.g., after receiving Ministry results).
- **Ministry data integration.** [ASSUMPTION - Q23] Future API integration with Ministry of Education systems (Mashov, Manbas) for automatic score retrieval.

#### Export

- **Excel export.** Generate an xlsx file mirroring the original format for users who need Excel compatibility.
- **CSV export.** Standard CSV for data analysis tools.
- **PDF reports.** Formatted reports for printing and physical distribution:
  - Class report (per homeroom teacher)
  - Student report card
  - School summary report
  - Year-over-year comparison report
- **Scheduled exports.** [ASSUMPTION] Auto-generate and email reports on a schedule (e.g., after each exam period).

### 8.4 Academic Year Management [NOT YET IMPLEMENTED]

- **Year initialization.** At the start of a new academic year:
  - Create new AcademicYear record
  - Roll forward student data (students promoted from 11th to 12th grade)
  - Create new classes and assign homeroom teachers
  - Configure exam periods
  - Historical scores from previous years remain accessible
- **Mid-year operations:** Add/remove students, transfer between classes, change unit levels.
- **Year-end finalization:** Lock the academic year, generate final comparison data, archive.
- **Multi-year student tracking:** Since Bagrut exams span grades 10-12, the system should [ASSUMPTION - Q61] at minimum track 12th-grade students but architecturally support earlier grades.

### 8.5 Audit Trail [NOT YET IMPLEMENTED]

Every data modification is logged:

| Log Entry | Fields |
|-----------|--------|
| Grade change | Student, subject, questionnaire, old value, new value, changed by, timestamp, reason |
| Risk level change | Student, old level, new level, changed by, timestamp, reason |
| Status change | Student, old status, new status (e.g., active -> withdrawn), changed by, timestamp |
| Note addition | Student, note content, author, timestamp |
| Configuration change | Entity type, field, old value, new value, changed by, timestamp |
| Login/logout | User, action, IP address, timestamp |

The audit trail is immutable (append-only). It supports:
- Filtering by student, user, date range, action type
- Export for compliance purposes
- Retention: [ASSUMPTION] 7 years minimum per Israeli education data regulations

### 8.6 Performance Requirements [NOT YET IMPLEMENTED -- demo uses client-side mock data]

| Metric | Requirement |
|--------|-------------|
| Page load time | < 2 seconds for any view with up to 500 students |
| Grade entry response | < 200ms per cell (including auto-recalculation) |
| Dashboard refresh | < 3 seconds for school-wide aggregation |
| Ranking sort | < 1 second for full school (500+ students, 145 columns) |
| Concurrent users | Support 50 simultaneous users per school |
| Data volume | Support 10 years of historical data per school |
| Availability | 99.5% uptime during school hours (7:00-20:00 Israel time) |
| Import speed | Process 500-student xlsx in < 30 seconds |

### 8.7 Data Privacy and Security [NOT YET IMPLEMENTED]

- **Israeli Privacy Protection Law (חוק הגנת הפרטיות).** Student grade data is personally identifiable information (PII) and must be handled per Israeli regulations.
- **Data residency.** [ASSUMPTION] Data should be stored in data centers within Israel or a jurisdiction approved by Israeli privacy authorities.
- **Encryption.** Data encrypted at rest (AES-256) and in transit (TLS 1.3).
- **Access controls.** Role-based access as defined. No public APIs exposing student data.
- **Data minimization.** Only collect and retain data necessary for the tracking purpose.
- **Consent.** [ASSUMPTION] The school is the data controller; parental consent may be required for student/parent portal access (future phase).
- **Right to access/deletion.** Support data export per student for parent requests. Support data deletion per student where legally required.

### 8.8 Backup and Recovery [NOT YET IMPLEMENTED]

- **Automated backups.** Daily full backup, hourly incremental.
- **Point-in-time recovery.** Restore to any point within the last 30 days.
- **Backup testing.** Monthly automated restore verification.
- **Disaster recovery.** RPO (Recovery Point Objective) = 1 hour. RTO (Recovery Time Objective) = 4 hours.
- **Data export.** Users can trigger full data export at any time as an additional backup mechanism.

### 8.9 Localization [PARTIALLY IMPLEMENTED -- Hebrew RTL interface, no i18n framework]

- **Primary language:** Hebrew (RTL interface)
- **Secondary language:** [ASSUMPTION] English (for system administration and potential international schools)
- **Date/time:** Israel timezone (Asia/Jerusalem). Hebrew calendar display as primary, with Gregorian secondary.
- **Number formatting:** Standard Western numerals (not Hebrew numerals). Decimal separator: period. Thousands separator: comma.

---

## 9. Migration Path [NOT YET IMPLEMENTED -- demo uses generated mock data]

### 9.1 Migration Strategy Overview

The migration from the existing xlsx-based system to the digital platform is a critical success factor. The approach must be:

1. **Non-destructive.** The Excel file remains usable throughout migration. No data is lost.
2. **Incremental.** Migration can happen class by class, not all at once.
3. **Verifiable.** After import, the system's calculated values must match the Excel's calculated values exactly.

### 9.2 Data Import from the Analyzed xlsx Format

The import process handles the specific structure documented in the file analysis:

#### Step 1: Sheet Identification

The system scans the xlsx file and identifies:
- Class sheets (by name pattern: "N יב" where N = 1-16)
- Rikuz sheet (by name: "ריכוז")
- Hashvaa sheet (by name: "השוואה בין השנים")
- Miyun sheet (by name: "מיון ע"פ ממוצע משוקלל")
- Mishchuk sheet (by name: "מישחוק")

#### Step 2: Class Sheet Parsing (Per Class)

For each class sheet:

1. **Extract header metadata:**
   - Row 2: Class name and year
   - Row 3: Homeroom teacher name
   - Rows 8-10: Subject headers and questionnaire codes
   - Row 8: Weight percentages (internal/external)

2. **Extract student data (rows 11-42 typical):**
   - Column A: Flags (lo begrutim, be-sakana le-bagrut)
   - Columns B-C: Math/English unit levels
   - Column D: Student number (with risk level from background color)
   - Column E: Student name
   - Columns G-J: Accommodation flags
   - Column K: Weighted average (verify against recalculation)
   - Columns L onward: All subject scores

3. **Extract class summary data (rows 43-91):**
   - Class averages
   - Student counts
   - Failing counts per period
   - Status summary blocks per exam period

4. **Extract tracking grid (rows 99+):**
   - Per-period student status (from cell background colors)
   - Notes and annotations

**Class 12 special handling:**
- Different column offsets (student name in column C, number in column B)
- Fewer total columns
- "Chasam" values handled as special_value=CHASAM instead of causing errors
- Unique subject (Communications)

#### Step 3: Rikuz Sheet Import

Import the consolidated summary data:
- Per-class counts by eligibility category per exam period
- Totals and percentages
- Challenging students lists with categories and notes

This data is used for verification (cross-checking against imported class data) and for importing the challenging students workflow state.

#### Step 4: Hashvaa Sheet Import

Import year-over-year comparison data:
- Historical year data (tashpab through tashpad) as static YearComparison records
- Current year data (tashpeh) will be calculated from imported grades

#### Step 5: Verification

After import, for every student:
1. Recalculate all Sofi scores using the system's formulas
2. Compare against the Excel's Sofi values (Column S, T, U for Math; Column AU, AV, AW for English; etc.)
3. Recalculate weighted averages
4. Compare against Column K values
5. Flag any discrepancies > 0.5 for manual review

Expected discrepancies:
- Students with "chasam" or "ikuv" values (the system handles these gracefully while the Excel had errors)
- Students with manual overrides in the Excel
- Rounding differences (the system uses higher precision)

### 9.3 Handling Historical Data

- **Current year grades:** Imported from class sheets with full detail.
- **Historical period snapshots:** Imported from the tracking grid (rows 99+) and the rikuz summary blocks. These become EligibilitySnapshot records.
- **Prior year comparison data:** Imported from the hashvaa sheet as static YearComparison records.
- **[ASSUMPTION - A10] Prior year class-level detail is not available** in the current file (only aggregated comparison data). If prior-year xlsx files exist, they can be imported separately.

### 9.4 Migration Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| Pilot (1 class) | 1 week | Import one class, verify all calculations, get Sarit feedback |
| Validation | 1 week | Import remaining classes, parallel-run with Excel |
| Transition | 2 weeks | Sarit enters new data in the system instead of Excel; Excel kept as backup |
| Full adoption | Ongoing | Excel retired for data entry; export available for fallback |

### 9.5 Rollback Plan

At any point during migration:
- The Excel file remains the authoritative source
- All imported data can be wiped and re-imported
- The system can export a new xlsx in the original format if needed

---

## 10. Open Questions and Assumptions

### 10.1 Critical Questions (Must-Answer Before Building)

These questions fundamentally affect system architecture. Until answered, the noted assumptions apply.

#### Student Counts and Denominators

**Q1:** Why is the comparison sheet total (503) different from the rikuz total (509)? Does the comparison sheet exclude some students beyond class 12?
- **[ASSUMPTION]** The 6-student discrepancy is due to non-matriculation students being excluded from the quality comparison. The system will use configurable exclusion rules.

**Q2:** When calculating school-wide eligibility rates, which denominator is the "official" one?
- **[ASSUMPTION]** 503 is the "quality Bagrut" denominator (excluding Ch"M / special education). 509 is the full enrollment denominator. The system will support both and clearly label which is shown.

#### Abbreviations and Exclusions

**Q3:** What does "Ch"M" (ח"מ) stand for?
- **[ASSUMPTION]** Chinuch Meyuchad (special education), referring to Class 12. The system marks Class 12 as `is_excluded_from_quality_metrics = true`.

#### Excellence Tier Thresholds

**Q4:** What are the exact score thresholds for each excellence tier?
- **[ASSUMPTION]** Metzuyanut 1-Aleph >= 96, 1-Bet >= 90, 1-Gimel >= 85. These are configurable in the system.

**Q5:** Is excellence based solely on weighted average?
- **[ASSUMPTION]** Yes, solely on weighted average. No subject-level minimums.

**Q6:** Risk level 4 vs. 5 -- is level 5 about the lower threshold?
- **[ASSUMPTION]** Level 4 = risk of missing 1-Bet (second tier). Level 5 = risk of missing 1-Gimel (any honors). This means level 5 students are closer to losing honors entirely.

#### Risk Level Assignment

**Q7:** Are risk levels manual or rule-based?
- **[ASSUMPTION]** Primarily manual, but the system provides auto-suggestions based on configurable rules.

**Q8:** If rule-based, what is the decision matrix?
- **[ASSUMPTION]** See Section 5.4 for the proposed auto-suggestion rules. These are configurable by the coordinator.

**Q9:** How often are risk levels updated?
- **[ASSUMPTION]** After each exam period, with the ability to update at any time.

#### Eligibility Rules

**Q10:** What are the exact rules for full Bagrut eligibility?
- **[ASSUMPTION]** Pass (55+) all 7 core subjects plus meet PE, community service, and other requirements. See Section 5.2.

**Q11:** What subjects are mandatory?
- **[ASSUMPTION]** Math, History, Civics, Tanakh, Literature, Hebrew Language, English are mandatory for the weighted average. General Studies, Intro Sciences, PE, and Community Service are required for eligibility but not weighted.

**Q12:** Must a student pass their elective subject?
- **[ASSUMPTION]** At least one 5-unit elective must be completed for full Bagrut.

#### Full Bagrut Despite Missing Exam

**Q13:** What are the conditions for this category?
- **[ASSUMPTION]** Ministry policy allows full Bagrut when a non-core subject exam is incomplete under certain conditions.

**Q14:** Does it apply only to specific subjects?
- **[ASSUMPTION]** Only elective/non-core subjects.

**Q15:** How should these students be treated in statistics?
- **[ASSUMPTION]** Treated as "fully eligible" in cumulative statistics but displayed as a distinct sub-category.

#### Class 12 Nature

**Q16:** What type of class is Yud-Bet 12?
- **[ASSUMPTION]** Special education (Chinuch Meyuchad) or alternative educational track.

**Q17:** Why the different column structure?
- **[ASSUMPTION]** Fewer subjects and different administrative requirements. The system handles this through configurable class-level subject assignments.

**Q18:** Should Class 12 appear in school-wide ranking?
- **[ASSUMPTION]** Class 12 students appear in the ranking but can be filtered out. By default, the "quality" ranking view excludes them.

**Q19:** Is Communications the designated track for Class 12?
- **[ASSUMPTION]** Yes, Communications is the elective for all Class 12 students.

#### Weighted Average Variations

**Q20:** Which weighted average is official?
- **[ASSUMPTION]** The standard formula (without electives) is official for Ministry reporting. The "overall" formula (with electives) is for internal use.

**Q21:** Formula for mixed unit levels (e.g., 5-unit Math, 3-unit English)?
- **[ASSUMPTION]** The formula adjusts weights per unit level: MathUnits + EnglishUnits + 10 (for six 2-unit subjects) as the denominator.

**Q22:** Is the formula always determined by unit levels in columns B-C?
- **[ASSUMPTION]** Yes, the unit level fields determine which Sofi and which weight to use.

#### Data Sources

**Q23:** Where do external Bagrut scores come from?
- **[ASSUMPTION]** Ministry of Education website or system (e.g., Mashov/Manbas). Manual entry initially, with potential API integration in future versions.

**Q24:** Where do internal scores come from?
- **[ASSUMPTION]** Subject teachers provide them to the coordinator. Future: direct entry by subject coordinators.

**Q25:** Are questionnaire codes stable year to year?
- **[ASSUMPTION]** Yes, Ministry codes are stable but can change. The system supports code management by the administrator.

#### Accommodations

**Q26:** What does each accommodation type mean?
- **[ASSUMPTION]** See Section 3.1.6 for assumed meanings. Key point: accommodations change exam administration, not scoring formulas.

**Q27:** Do accommodations affect scoring formulas?
- **[ASSUMPTION]** No, accommodations do not change formulas.

### 10.2 Clarification Questions (Important for Accuracy)

#### Gamification

**Q28:** What is the actual purpose of the gamification sheet?
- **[ASSUMPTION]** Used for motivational conversations with students and for staff planning ("what if they improve?").

**Q29:** What determines which students appear in the gamification sheet?
- **[ASSUMPTION]** Only students with at least some completed exams and room for improvement. The digital system will make this configurable (all students, or filtered by risk level/status).

**Q30:** Is the -5 offset intentional and adjustable?
- **[ASSUMPTION]** Yes to both. Default is -5; the coordinator can adjust per simulation.

**Q31:** Who uses the "overall average including electives"?
- **[ASSUMPTION]** Internal staff tool for planning and student conversations.

#### Enhanced Section

**Q32:** What does "mugbarim" mean?
- **[ASSUMPTION]** "Enhanced" or "intensive" -- referring to 5-unit level elective subjects (megamot).

**Q33:** Are the weight percentages the internal/external weights?
- **[ASSUMPTION]** Yes, they represent the component weight split for each elective subject's final score calculation.

#### Special Values

**Q34:** What triggers a "chasam" entry?
- **[ASSUMPTION]** An administrative block preventing the student from taking that exam (prerequisite failure, registration issue, or policy decision).

**Q35:** Is "chasam" temporary or permanent?
- **[ASSUMPTION]** It can be temporary (cleared when prerequisites are met) or permanent (student exempted from that component).

**Q36:** How should "chasam" be handled in calculations?
- **[ASSUMPTION]** Excluded from calculations. The subject is not counted toward the weighted average until the barrier is cleared.

**Q37:** What does "ikuv" mean?
- **[ASSUMPTION]** A delay in receiving exam results. The score is expected but not yet available.

**Q38:** How should "ikuv" be handled in calculations?
- **[ASSUMPTION]** Treated as "pending" -- excluded from calculations until the actual score arrives. The system shows a "pending" indicator.

#### Abbreviations

**Q39:** What is "shiluv 07"?
- **[ASSUMPTION]** An integration program code. "Shiluv" means integration (for special-needs students in regular classes). "07" may be a program identifier.

**Q40:** What is "t.l. mutaemet"?
- **[ASSUMPTION]** "Tochnit Limudim Mutaemet" -- Adapted Curriculum. The student follows a modified academic program.

**Q41:** What is "bak"s"?
- **[ASSUMPTION]** Unknown abbreviation. Treated as a free-text note in the system. Awaiting clarification.

**Q42:** What is "mad"ach"?
- **[ASSUMPTION]** "Madaei HaChevra" (Social Sciences) or possibly "Madaei HaChaim" (Life Sciences). Likely refers to the subject elective with final project (avodah gamar).

**Q43:** Does "ch"m" mean Chinuch Meyuchad?
- **[ASSUMPTION]** Yes, special education. See Q3.

#### Corrections Process

**Q44:** What is the corrections process?
- **[ASSUMPTION]** Students can retake failed exams or submit additional work within a defined correction period.

**Q45:** Is there a limit on corrections?
- **[ASSUMPTION]** System-configurable. No hard limit assumed, but each correction is tracked.

**Q46:** When corrected, which score is kept?
- **[ASSUMPTION]** The higher score is kept. Both scores are stored in the audit trail.

#### Unit Level Columns

**Q47:** Do columns B-C represent Math and English unit levels?
- **[ASSUMPTION]** Yes. First number = Math, second = English.

**Q48:** Is the column placement significant?
- **[ASSUMPTION]** No, the values are what matter regardless of exact column placement. The import parser will handle both B and C.

#### Student Transfers

**Q49:** How are students who leave handled?
- **[ASSUMPTION]** Withdrawn students are excluded from the denominator in eligibility calculations. Their data is preserved with a "withdrawn" status.

**Q50:** What is "Project Hila"?
- **[ASSUMPTION]** A special program (possibly dropout prevention or alternative placement). Students transferred there are counted as "withdrawn" from the school.

**Q51:** What happens when a student gives up on full Bagrut?
- **[ASSUMPTION]** Reclassified as "non-matriculation" (lo begrutim). Excluded from eligibility percentage calculations.

#### Non-Academic Subjects

**Q52:** What do community service values (1, 3, 4) represent?
- **[ASSUMPTION]** Completion level or hours category. Value >= 1 means completed. The system tracks the value but does not include it in the weighted average.

**Q53:** Is PE formally graded?
- **[ASSUMPTION]** PE has a 0-100 grade recorded but is pass/fail for Bagrut purposes. Passing threshold is [ASSUMPTION] 55.

#### Multiple Arabic Columns

**Q54:** Why two Arabic sections in the sorting sheet?
- **[ASSUMPTION]** Different levels (3-unit vs. 5-unit) or different Arabic tracks (Modern Standard vs. Spoken). The system models them as separate subject variants if needed.

### 10.3 Nice-to-Know Questions (Future Planning)

**Q55:** Who else uses this data?
- **[ASSUMPTION]** Homeroom teachers receive class-level views. Principal sees the rikuz. Board/Ministry may receive the comparison data. The system supports all these through role-based access.

**Q56:** Are there privacy regulations?
- **[ASSUMPTION]** Yes, Israeli Privacy Protection Law applies. See Section 8.7 for compliance approach.

**Q57:** How often is the file updated?
- **[ASSUMPTION]** Major updates after each exam period (4-5 times per year). Minor updates (notes, risk levels) may happen weekly or more frequently.

**Q58:** Is there a specific workflow for challenging students?
- **[ASSUMPTION]** Sarit identifies -> discusses with Shira/Hila -> assigns follow-up -> outcomes recorded. The system codifies this workflow.

**Q59:** Are declining trends a known concern?
- **[ASSUMPTION]** Yes, based on the data showing declining eligibility and honors rates. The system's analytics features will help diagnose root causes.

**Q60:** Is the 92.4% rate final or in-progress?
- **[ASSUMPTION]** In-progress (the current year's data is still being collected). The final rate will likely be higher after summer exams.

**Q61:** Will the school track 10th/11th grade Bagrut exams?
- **[ASSUMPTION]** Not in v1, but the system architecture supports multi-grade tracking. Some Bagrut exams (e.g., Math 182/183) are taken in earlier grades and their scores appear in the 12th-grade file.

**Q62:** Would the school want student/parent access?
- **[ASSUMPTION]** Not in v1 but architecturally supported. The Student role is defined (Section 2.1) for future implementation.

### 10.4 Validated Assumptions from Analysis

The following assumptions were made during analysis and should be confirmed:

| ID | Assumption | Risk if Wrong |
|----|-----------|---------------|
| A1 | All regular class sheets follow the same column order | Data import mapping breaks for specific classes |
| A2 | Passing grade is always 55 | Some subjects/accommodations might have different thresholds |
| A3 | 30/70 is the default weight split | Weights might change by Ministry directive |
| A4 | Sarit is the sole data entry person | Need collaboration features sooner |
| A5 | Risk level encoded in Column D background color | Risk display logic incorrect |
| A6 | 4-5 exam periods per year is fixed | Missing tracking windows |
| A7 | Sorting sheet ranked by weighted average descending | Auto-sort logic needs adjustment |
| A8 | Non-matriculation students excluded from percentages | Eligibility rate calculation incorrect |
| A9 | General Studies and Intro Sciences not in weighted average | May contribute to eligibility |
| A10 | Historical comparison data is manually entered (not linked) | Need historical data import feature |
| A11 | Sofi columns are always formula-driven | Need manual override support |
| A12 | Each student takes exactly one Math/English level | Need multi-level tracking |
| A13 | Elective subjects are always 5-unit | Weighted average denominator changes |
| A14 | Comparison sheet shows exactly 4 years | Need flexible year range |

### 10.5 Data Anomalies Requiring Resolution

| # | Anomaly | Impact | Assumed Resolution |
|---|---------|--------|-------------------|
| 1 | Student moved between classes mid-year | System needs transfer tracking | StudentEnrollment junction table with date ranges |
| 2 | "Project Hila" transfer | Need withdrawal status | Student.status = WITHDRAWN with reason |
| 3 | Formula errors from "chasam" in Class 12 | System must handle non-numeric values | Grade.special_value enum; excluded from calculations |
| 4 | Student gave up on full Bagrut | Need voluntary withdrawal status | Student.bagrut_track = NON_MATRICULATION with reason |
| 5 | Extended biology track | May need subject variants | Subject model supports regular vs. extended variants |
| 6 | "megama!!" warning annotation | Need urgent free-text notes | Note entity with urgency flag |
| 7 | "shipur" (improvement) annotations | Need progress tracking | Note.note_type = STATUS_UPDATE |
| 8 | Rikuz total discrepancy (509 vs 517 vs 503) | Need clear denominator rules | Configurable exclusion rules per view |

### 10.6 Question Priority Matrix

| Priority | Question Numbers | Count | Blocking? |
|----------|-----------------|-------|-----------|
| P0 -- Architecture blockers | Q1, Q2, Q3, Q10, Q11, Q12, Q13, Q16, Q20, Q21 | 10 | Yes |
| P1 -- Feature behavior | Q4, Q5, Q6, Q7, Q8, Q9, Q14, Q15, Q17, Q18, Q19, Q22, Q34, Q35, Q36, Q37, Q38, Q47 | 18 | Partially |
| P2 -- Data accuracy | Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30, Q31, Q32, Q33, Q39, Q40, Q41, Q42, Q43, Q44, Q45, Q46, Q48, Q49, Q50, Q51, Q52, Q53, Q54 | 26 | No |
| P3 -- Future planning | Q55, Q56, Q57, Q58, Q59, Q60, Q61, Q62 | 8 | No |
| **Total** | | **62** | |

---

## Appendix X: Demo Mock Data Generation Notes

This appendix documents how the demo generates realistic mock data for 504 students across 16 classes. These details are specific to the demo implementation and are not part of the production product specification.

### X.1 Talent System for Realistic Excellence Distribution [IMPLEMENTED]

To produce a realistic distribution of excellence tiers, the mock data generator assigns a **talent level** to each student:

- **~8% of regular students** are designated as "excellent" talent (`talent: 'excellent'`).
- **Excellent students** receive correlated high scores across all subjects:
  - 10% chance of score 75-84 (occasional dip)
  - 30% chance of score 85-89
  - 60% chance of score 90-100
- **Normal students** receive the standard distribution:
  - 3% chance of score 30-51 (failing)
  - 2% chance of score 52-54 (borderline)
  - 80% chance of score 55-89 (passing)
  - 15% chance of score 90-100 (excellence)
- **Special class (class 12) students** have a separate, lower distribution regardless of talent.

The talent flag is passed consistently to all score generators (Math, English, core subjects, electives), ensuring that excellent students score high across the board rather than having randomly uncorrelated high scores.

### X.2 Missing Subjects for What-If Projections [IMPLEMENTED]

To enable realistic What-If projection scenarios, the mock data generator leaves some students with missing core subjects:

- **~18% of regular, non-excellent students** are assigned 1-3 missing core subjects (from History, Civics, Tanakh, Literature, Language -- never Math or English).
- The missing count follows a weighted distribution: 60% get 1 missing, 25% get 2, 15% get 3.
- Missing subjects are randomly selected from the 5 eligible core subjects for each student.
- Missing subjects have no grades entry at all (the subject key is absent from the student's grades record), which causes the variable-denominator formula to exclude them naturally.
- This generates a pool of students who benefit from the What-If projection engine, which projects scores for their missing subjects.

### X.3 Non-Matriculation Student Distribution [IMPLEMENTED]

Non-matriculation students are distributed across classes matching the real spreadsheet pattern:

| Class | Non-Matric Count |
|-------|-----------------|
| 1 | 1 |
| 2 | 2 |
| 4 | 1 |
| 5 | 2 |
| 6 | 1 |
| 8 | 1 |
| 10 | 1 |
| 11 | 1 |
| 13 | 2 |
| 15 | 1 |
| Total | 13 |

### X.4 Class-Specific Elective Pools [IMPLEMENTED]

Each class has a defined pool of available elective subjects based on the real spreadsheet data. Students are randomly assigned 1-3 electives from their class's pool. Class 12 has only Communications. See `CLASS_ELECTIVES` in `mock-data.ts` for the full mapping.

### X.5 Seeded Random Number Generator [IMPLEMENTED]

All randomness uses a deterministic seeded RNG (seed=42) to ensure consistent mock data across page reloads and development sessions. The RNG uses a linear congruential generator: `s = (s * 1664525 + 1013904223) & 0xffffffff`.

---

## Appendix A: Glossary of Hebrew Terms

| Hebrew | Transliteration | English |
|--------|----------------|---------|
| בגרות | Bagrut | Matriculation (exam/certificate) |
| תעודת בגרות | Teudat Bagrut | Bagrut Certificate |
| זכאות | Zakhaut | Eligibility |
| צפי | Tzafi | Forecast/Risk level |
| סיכוי | Sikui | Chance/Probability |
| סיכון | Sikun | Risk |
| מצויינות | Metzuyanut | Excellence/Honors |
| מחנכ/ת | Mechanech/et | Homeroom teacher |
| ריכוז | Rikuz | Consolidation/Summary |
| מיון | Miyun | Sorting/Ranking |
| מישחוק | Mishchuk | Gamification |
| השוואה | Hashvaa | Comparison |
| ממוצע משוקלל | Memutza Meshukall | Weighted average |
| יח"ל / יחידות לימוד | Yechal / Yechidot Limud | Study units (credit level) |
| שאלון | Shealon | Questionnaire (exam component) |
| סופי | Sofi | Final (score) |
| פנימי | Pnimi | Internal (school-based assessment) |
| חיצוני | Chitzoni | External (national exam) |
| חסם | Chasam | Barrier/Block |
| עיכוב | Ikuv | Delay |
| מותאם | Mutaam | Adapted (accommodation) |
| הכתבה | Hachtava | Dictation (accommodation) |
| בע"פ | Be'al Peh | Oral (accommodation) |
| ע"ח | Al Chet | Special accommodation |
| מאתגרים | Meategarim | Challenging (students) |
| לא בגרותי | Lo Begrutim | Non-matriculation |
| בסכנה לבגרות | Be-sakana Le-bagrut | At risk for Bagrut |
| מוגברים | Mugbarim | Enhanced (5-unit subjects) |
| מגמה | Megama | Major/Elective track |
| כיתה | Kita | Class |
| שכבה | Shichva | Grade level/cohort |
| תיקונים והשלמות | Tikunim Ve-hashlamot | Corrections and completions |
| מועד | Moed | Exam period/session |
| חורף | Choref | Winter |
| קיץ | Kayitz | Summer |
| ח"מ | Cheth Mem | [ASSUMPTION] Chinuch Meyuchad (Special Education) |

## Appendix B: Formula Quick Reference

### Subject Finals

| Subject | Formula |
|---------|---------|
| Math Sofi 3 | `Q382 * 0.40 + Q381 * 0.35 + Q182 * 0.25` |
| Math Sofi 4 | `Q481 * 0.65 + Q482 * 0.35` |
| Math Sofi 5 | `Q581 * 0.60 + Q582 * 0.40` |
| English Sofi 3 | `Oral3 * 0.20 + ModC * 0.27 + ModB * 0.26 + ModA * 0.27` |
| English Sofi 4 | `Oral4 * 0.20 + ModB * 0.27 + ModA * 0.26 + ModD * 0.27` |
| English Sofi 5 | `Oral5 * 0.20 + ModG * 0.27 + ModF * 0.26 + ModE * 0.27` |
| History | `External * 0.70 + Internal * 0.30` |
| Civics | `Exam * 0.80 + Task * 0.20` |
| Tanakh | `External * 0.70 + Internal * 0.30` |
| Literature | `External * 0.70 + Internal * 0.30` |
| Language | `External * 0.70 + Internal * 0.30` |
| Computer Science | `Comp1 * 0.70 + Comp2 * 0.30` |
| Physics | `Q371 * 0.25 + Q283 * 0.30 + Q376 * 0.15 + Q361 * 0.30` |
| Jewish Law | `Q7281 * 0.50 + Q7383 * 0.50` |
| Geography | `Q57238 * 0.40 + Q57381 * 0.60` |
| Mgmt/Economics | `Q381 * 0.70 + Q839283 * 0.30` |
| Spanish | `Q579283 * 0.40 + Q579385 * 0.60` |
| Communications | `Q56283 * 0.50 + Q56387 * 0.50` |

### Weighted Averages

| Variant | Formula |
|---------|---------|
| Standard (5/5) | `(Math5*5 + Hist*2 + Civ*2 + Tan*2 + Lit*2 + Lang*2 + Eng5*5) / 20` |
| Standard (4/4) | `(Math4*4 + Hist*2 + Civ*2 + Tan*2 + Lit*2 + Lang*2 + Eng4*4) / 18` |
| General | `(MathN*N + Hist*2 + Civ*2 + Tan*2 + Lit*2 + Lang*2 + EngM*M) / (N+M+10)` |
| Overall (with elective) | `(CoreSum + Elective*5) / (CoreDenom + 5)` |

---

*This specification is a living document. It will be updated as answers to the 62 open questions are received and as the product evolves through development iterations. All items marked [ASSUMPTION] should be validated before implementation of the corresponding feature.*

*Document version: 1.1 (Updated with implementation status)*
*Last updated: 2026-03-08*
*Author: Product Management*
*Reviewed by: (Pending)*
