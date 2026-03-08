# Sheifa School Bagrut Tracking System -- Comprehensive File Analysis

**Source File:** `/Users/meir/Downloads/sarit-example.xlsx`
**Extracted Data:** `/Users/meir/.a5c/processes/sarit-xlsx-extracted.json`
**Analysis Date:** 2026-03-05
**Academic Year Tracked:** Tashpeh (2024-2025)

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Sheet Structure](#2-sheet-structure)
3. [Data Model](#3-data-model)
4. [Subject Taxonomy](#4-subject-taxonomy)
5. [Scoring System](#5-scoring-system)
6. [Color Coding System](#6-color-coding-system)
7. [Risk Level System](#7-risk-level-system)
8. [Time Period Tracking](#8-time-period-tracking)
9. [Summary/Aggregation Logic](#9-summaryaggregation-logic)
10. [Year-over-Year Comparison](#10-year-over-year-comparison)
11. [Gamification Sheet](#11-gamification-sheet)
12. [Sorting/Ranking Sheet](#12-sortingranking-sheet)
13. [Special Sections](#13-special-sections)
14. [Key Formulas](#14-key-formulas)
15. [Class 12 Differences](#15-class-12-differences)
16. [Workflow](#16-workflow)

---

## 1. Product Overview

### What Is This Product?

This Excel workbook is a **manually-maintained Bagrut (Israeli Matriculation Exam) tracking system** used by Sheifa School (school contact: sheifa10@walla.com, website: www.sheifa.co.il, phone: 050-5343804, fax: 08-9457692). It serves as the school's central tool for monitoring and managing the 12th-grade (Yud-Bet) matriculation examination process for the academic year Tashpeh (2024-2025).

### Who Uses It?

- **Primary user:** "Sarit" -- likely the school's Bagrut coordinator or VP for academics
- **Secondary users:** Homeroom teachers (mechanchim), school administration, subject coordinators
- **Referenced staff:** "Shira" (appears in challenging students section), "Hila" (appears as escalation contact for problem cases), individual homeroom teachers listed per class (e.g., "David Shroni" for class 1, "Safi Baruch" for class 12)

### What Problem Does It Solve?

The Israeli Bagrut examination system is extraordinarily complex. Students take exams across 7+ mandatory and elective subjects, each with multiple questionnaires (exam components), across multiple exam periods spanning 2-3 years (grades 10-12). Each subject has internal (school-assessed) and external (national exam) components with different weighting rules. Passing thresholds, eligibility calculations, and "excellence" (Metzuyanut) levels all need tracking.

This workbook provides:
1. **Per-student, per-subject grade tracking** across all exam components
2. **Automatic calculation** of weighted final scores per subject
3. **Overall weighted average** calculation for each student
4. **Risk assessment** via a 5-level color-coded system (Tzafi)
5. **Longitudinal tracking** of student status across 4-5 exam periods
6. **School-level aggregation** showing class-by-class and total eligibility rates
7. **Year-over-year comparison** of school performance
8. **Identification of at-risk students** ("challenging students") with action items
9. **Ranking** of all students by weighted average across the entire school

### Scale

- **~503 students** in the current academic year (509 per rikuz sheet, 503 per comparison sheet)
- **16 regular 12th-grade classes** (Yud-Bet 1-11, 13-16) with 16-40 students each
- **1 special class** (Yud-Bet 12) with 13 students
- **20+ subjects** tracked
- **~40,000+ data cells** across 20 sheets

---

## 2. Sheet Structure

### Overview of All 20 Sheets

The workbook contains 20 sheets organized as follows:

| # | Sheet Name | Purpose | Dimensions | Rows | Cols |
|---|-----------|---------|------------|------|------|
| 1 | Yud-Bet 1 (1 יב) | Class 1 grade tracking | A1:CX131 | 131 | 102 |
| 2 | Yud-Bet 2 (2 יב) | Class 2 grade tracking | A1:DL147 | 147 | 116 |
| 3 | Yud-Bet 3 (3 יב) | Class 3 grade tracking | A1:CH148 | 148 | 86 |
| 4 | Yud-Bet 4 (4 יב) | Class 4 grade tracking | A1:CR127 | 127 | 96 |
| 5 | Yud-Bet 5 (5 יב) | Class 5 grade tracking | A1:DK131 | 131 | 115 |
| 6 | Yud-Bet 6 (6 יב) | Class 6 grade tracking | A1:CX136 | 136 | 102 |
| 7 | Yud-Bet 7 (7 יב) | Class 7 grade tracking | A1:DI154 | 154 | 113 |
| 8 | Yud-Bet 8 (8 יב) | Class 8 grade tracking | A1:DJ136 | 136 | 114 |
| 9 | Yud-Bet 9 (9 יב) | Class 9 grade tracking | A1:DF138 | 138 | 110 |
| 10 | Yud-Bet 10 (10 יב) | Class 10 grade tracking | A1:DA107 | 107 | 105 |
| 11 | Yud-Bet 11 (11 יב) | Class 11 grade tracking | A1:CZ138 | 138 | 104 |
| 12 | Yud-Bet 13 (13 יב) | Class 13 grade tracking | A1:DF152 | 152 | 110 |
| 13 | Yud-Bet 14 (14 יב) | Class 14 grade tracking | A1:DM144 | 144 | 117 |
| 14 | Yud-Bet 15 (15 יב) | Class 15 grade tracking | A1:DF142 | 142 | 110 |
| 15 | Yud-Bet 16 (16 יב) | Class 16 grade tracking | A1:CH115 | 115 | 86 |
| 16 | Rikuz (ריכוז) | Summary/Consolidation | B4:AN176 | 176 | 40 |
| 17 | Yud-Bet 12 (12 יב) | Special class 12 | A1:CF66 | 66 | 84 |
| 18 | Hashvaa (השוואה בין השנים) | Year-over-year comparison | C3:P23 | 23 | 16 |
| 19 | Miyun (מיון ע"פ ממוצע משוקלל) | Sorting by weighted average | A4:EO528 | 528 | 145 |
| 20 | Mishchuk (מישחוק) | Gamification | A5:CE172 | 172 | 83 |

### Sheet Relationships

```
Class Sheets (1-16 + 12)
    |
    |--- Individual student grades feed into ----> Sorting Sheet (מיון)
    |                                              (all students ranked by weighted avg)
    |
    |--- Individual student grades feed into ----> Gamification Sheet (מישחוק)
    |                                              (projected scores with simulated improvements)
    |
    |--- Class-level summary stats roll up to ---> Summary Sheet (ריכוז)
    |                                              (eligibility counts, failing counts, etc.)
    |
    |--- Summary Sheet feeds into -----> Year-over-Year Comparison (השוואה)
                                         (multi-year trends)
```

### Class Sheet Layout (Standard Structure)

Each of the 15 regular class sheets follows this layout:

**Header Section (Rows 1-10):**
- Row 1: Tzafi (צפי) label
- Row 2: Class name + year (e.g., "כיתה יב 1 - תשפ"ה"), risk level legend
- Row 3: Homeroom teacher name (מחנכ/ת), risk levels continued
- Row 4-6: Subject abbreviation legend (English, Math, Hebrew Language), score threshold markers
- Row 7: School contact information, "Enhanced" (מוגברים) section header
- Row 8: Internal/external weight percentages per subject
- Row 9-10: Subject headers with exam codes (questionnaire numbers)

**Student Grade Section (Rows 11-~42):**
- One row per student
- Column A: Notes/flags (e.g., "בסכנה לבגרות" = at risk for matriculation, "לא בגרותי" = non-matriculation)
- Column B-C: Unit levels (e.g., "5  5" or "5  3" indicating Math/English unit levels)
- Column D: Student number
- Column E: Student name
- Columns F onward: Subject grades, formulas, and final scores

**Class Average Row (Row ~43):**
- Average formulas for each grade column (e.g., `=AVERAGE(K11:K42)`)
- Font color FF92D050 (green) for class average values

**Count Row (Row ~44):**
- COUNT formulas showing how many students have scores in each column

**Failing Count Rows (Rows ~45-49):**
- Counts of students scoring below passing in each exam period

**Status Summary Sections (Rows ~53-91):**
- Four time-period snapshots with eligibility breakdown
- Each snapshot: count of students by number of missing/failing exams, percentages

**Student-by-Student Tracking Grid (Rows ~99-131):**
- Three columns per time period
- Student number + name + color-coded status (green=passing, yellow=at risk, red=failing)
- Notes column with annotations (e.g., "בסכנה לבגרות")

---

## 3. Data Model

### Entities and Relationships

```
School (Sheifa)
  |
  +-- Academic Year (תשפ"ב, תשפ"ג, תשפ"ד, תשפ"ה)
  |     |
  |     +-- Grade Level (שכבה): 12th grade (יב)
  |           |
  |           +-- Class (כיתה): 1-16 (no class 12 in regular numbering)
  |           |     |
  |           |     +-- Homeroom Teacher (מחנכ/ת)
  |           |     +-- Students (תלמידים): ~23-40 per class
  |           |     +-- Class Size Total
  |           |
  |           +-- Special Class 12: 13 students, different structure
  |
  +-- Subject (מקצוע)
  |     |
  |     +-- Subject Name (Hebrew)
  |     +-- Exam Type: Internal (פנימי) / External (חיצוני)
  |     +-- Unit Level (יחידות לימוד): 3, 4, or 5
  |     +-- Questionnaire Codes (שאלונים): e.g., 182/183, 381, 382...
  |     +-- Component Weights (internal %, external %)
  |
  +-- Student (תלמיד/ה)
  |     |
  |     +-- Name
  |     +-- Class Assignment
  |     +-- Math Unit Level (3/4/5)
  |     +-- English Unit Level (3/4/5)
  |     +-- Accommodations: מותאם (adapted), הכתבה (dictation), בע"פ (oral), ע"ח (special accommodations)
  |     +-- Risk Level (צפי): 1-5
  |     +-- Status per Exam Period
  |     +-- Weighted Average
  |     +-- Special Flags: "לא בגרותי" (non-matriculation), "בסכנה לבגרות" (at risk)
  |
  +-- Grade (ציון)
  |     |
  |     +-- Student
  |     +-- Subject
  |     +-- Questionnaire Code
  |     +-- Score (0-100)
  |     +-- Component Type: Internal (30%) or External (70%)
  |     +-- Final Score (calculated)
  |
  +-- Exam Period (מועד)
  |     |
  |     +-- Period Name (e.g., "לאחר קיץ תשפ"ג")
  |     +-- Student Status at this point
  |     +-- Number of missing exams
  |
  +-- Risk Assessment (צפי)
        |
        +-- Level (1-5)
        +-- Description
        +-- Color Code
```

### Key Relationships

1. **Student <-> Class**: Each student belongs to exactly one class (1:N)
2. **Student <-> Subject**: Many-to-many; each student takes multiple subjects, tracked by grades per questionnaire
3. **Student <-> Exam Period**: Each student has a status snapshot at each exam period
4. **Subject <-> Questionnaires**: Each subject has 1-7 questionnaire codes
5. **Grade <-> Formula**: Final subject scores are computed via internal/external weight formulas
6. **Class <-> Summary**: Each class's data aggregates into the summary sheet

---

## 4. Subject Taxonomy

### Complete Subject List

#### Core/Mandatory Subjects

| Hebrew Name | English Translation | Exam Questionnaire Codes | Unit Levels | Internal/External | Color |
|------------|-------------------|------------------------|-------------|-------------------|-------|
| מתמטיקה | Mathematics | 182/183, 381, 382, 481, 482, 581, 582 | 3, 4, 5 | Various per level | None (default) |
| היסטוריה | History | Internal (30) + External (70) | 2 | 30%/70% | Green (FF92D050) - Internal |
| אזרחות | Civics | מטלת ביצוע + מבחן | 2 | Performance task + exam | Green (FF92D050) - Internal |
| תנ"ך | Bible/Tanakh | Internal (30) + External (70) | 2 | 30%/70% | Magenta (FFEF31CF) - External |
| ספרות | Literature | Internal (30) + External (70) | 2 | 30%/70% | Green (FF92D050) - Internal |
| לשון | Hebrew Language | Internal (30) + External (70) | 2 | 30%/70% | None (default) |
| אנגלית | English | Modules A-G (see below) + oral | 3, 4, 5 | Complex multi-module | None (default) |
| השכלה כללית | General Studies | Single score columns | - | - | - |
| מבוא למדעים | Introduction to Sciences | Single score | - | - | - |
| חנ"ג | Physical Education | Single score (pass/fail style, 0-100) | - | - | - |
| מעורבות חברתית | Community Service | Score (typically 3-4) | - | Hours-based | - |

#### Elective/Major Subjects (מגמות)

| Hebrew Name | English Translation | Exam Codes | Found in Classes |
|------------|-------------------|------------|-----------------|
| מדעי המחשב | Computer Science | 899381, 899373 (or 899371, 899271) + 883589 | Multiple classes |
| פיזיקה | Physics | 361, 376, 283, 371 | Multiple classes |
| כימיה | Chemistry | Exam codes vary | Classes 2, 5, 7, 8, 9, 10, 11, 13, 15 |
| ביולוגיה | Biology | Multiple codes + ע. גמר (final project) | Classes 2, 5, 6, 7, 8, 9, 13, 14, 15 |
| גאוגרפיה | Geography | 57381, 57238 | Class 1, others |
| מנהל וכלכלה | Management and Economics | 839283, 381 | Multiple classes |
| מדעי החברה | Social Sciences | 281, 283, 273, 189 | Classes 4, 7, 8, 13, 14 |
| חוק"ש תושב"ע | Jewish Law / Oral Torah | 7383, 7281 | Multiple classes |
| ספרדית | Spanish | 579385, 579283 | Class 1, others |
| ערבית | Arabic | Multiple codes | Classes 5, 6, 7, 8, 9, 13, 14, 15, 16 |
| איטלקית | Italian | Codes vary | Class 15 |
| צרפתית | French | Codes vary | Classes 5, 6, 13 |
| סינית | Chinese | Codes vary | Classes 8, 11 |
| פילוסופיה | Philosophy | Codes vary | Class 8 |
| קולונוע | Film/Cinema | 61387, 61283 | Classes 2, others |
| מדעי הרפואה | Medical Sciences | 802381, 802283 | Class 2, others |
| תנ"ך מורחב | Extended Bible Studies | Codes vary | Classes 2, 5, 7, 10, 11, 13, 14 |
| תקשורת | Communications | 56387, 56283 | Class 12 only |
| מד"ח ע. גמר | Mada"ch Final Project | Single score | Various |
| מוזיקה רסיטל | Music Recital | Single score | Class 1, others |
| מוזיקה | Music | Multiple codes | Class 10, others |
| מחול | Dance | Multiple codes | Class 10 |
| תאטרון | Theater | Multiple codes | Class 11 |
| ביולוגיה ע. גמר | Biology Final Project | Single score | Various |

### English Module Structure

English is the most complex subject with 7 written modules (A-G) plus oral components:

| Module | Exam Code | Level | Notes |
|--------|----------|-------|-------|
| A | 16381 | 3 יח"ל | Basic module |
| B | 16383 | 3 יח"ל | Basic module |
| C | 16382 | 3 יח"ל | Basic module |
| D | 16483 | 4 יח"ל | Intermediate module |
| E | 16471 (regular) / 16481 (class 12) | 4 יח"ל | Intermediate module |
| F | 16583 | 5 יח"ל | Advanced module |
| G | 16582 | 5 יח"ל | Advanced module |
| Oral 3 | בע"פ 3 יח"ל | 3 יח"ל | Oral exam for 3-unit level |
| Oral 4 | בע"פ 4 יח"ל | 4 יח"ל | Oral exam for 4-unit level |
| Oral 5 | בע"פ 5 יח"ל | 5 יח"ל | Oral exam for 5-unit level |

### Mathematics Questionnaire Progression

| Code | Level | Weight in Formula |
|------|-------|------------------|
| 182/183 | 3 יח"ל | 0.25 in "Sofi 3" formula |
| 381 | 3 יח"ל | 0.35 in "Sofi 3" formula |
| 382 | 3 יח"ל | 0.40 in "Sofi 3" formula |
| 481 | 4 יח"ל | 0.65 in "Sofi 4" formula |
| 482 | 4 יח"ל | 0.35 in "Sofi 4" formula |
| 581 | 5 יח"ל | 0.60 in "Sofi 5" formula |
| 582 | 5 יח"ל | 0.40 in "Sofi 5" formula |

---

## 5. Scoring System

### General Scoring Principle

Most subjects use a **30% internal / 70% external** weighting system:

```
Final Score = (Internal Score * 0.3) + (External Score * 0.7)
```

Where:
- **Internal (פנימי)** = School-based assessment (מטלת ביצוע / performance task)
- **External (חיצוני)** = National Bagrut examination score

### Subject-Specific Scoring Formulas

#### Standard 30/70 Subjects (History, Tanakh, Literature, Language)

```
History Final:    =W*0.7 + V*0.3    (W=external, V=internal/30%)
Tanakh Final:     =AC*0.7 + AB*0.3
Literature Final: =AF*0.7 + AE*0.3
Language Final:   =AI*0.7 + AH*0.3
```

#### Civics (אזרחות) -- Special Case

Civics uses 80% exam + 20% performance task:
```
Civics Final: =Z*0.8 + Y*0.2    (Z=exam, Y=performance task)
```

#### Mathematics -- Multi-Level

Math has three final scores depending on the student's level:

**Sofi 3 (סופי 3) -- 3 Unit Level:**
```
=N*0.4 + M*0.35 + L*0.25
```
Where L=182/183, M=381, N=382

**Sofi 4 (סופי 4) -- 4 Unit Level:**
```
=O*0.65 + P*0.35
```
Where O=481, P=482

**Sofi 5 (סופי 5) -- 5 Unit Level:**
```
=Q*0.6 + R*0.4
```
Where Q=581, R=582

#### English -- Multi-Module

**Sofi 3 (סופי 3) -- 3 Unit Level:**
```
=AT*0.2 + AM*0.27 + AL*0.26 + AK*0.27
```
Where AK=Module A, AL=Module B, AM=Module C, AT=Oral 3

**Sofi 4 (סופי 4) -- 4 Unit Level (in class 12):**
```
=AP*0.2 + AL*0.27 + AK*0.26 + AJ*0.27
```

**Sofi 5 (סופי 5) -- 5 Unit Level:**
```
=AT*0.2 + AQ*0.27 + AP*0.26 + AO*0.27
```
Where AO=Module E, AP=Module F, AQ=Module G, AT=Oral 5

#### Computer Science (מדעי המחשב)

```
Final 5: =BB*0.3 + BA*0.7    (or =BB*0.24 + BA*0.76)
```
With a third component (883589) in some classes.

#### Physics (פיזיקה)

```
Final 5: =BK*0.25 + BJ*0.3 + BI*0.15 + BH*0.3
```
Where BH=361, BI=376, BJ=283, BK=371

#### Jewish Law (חוק"ש תושב"ע)

```
Final 5: =BF*0.5 + BE*0.5
```
Equal 50/50 weighting between two components.

#### Geography (גאוגרפיה)

```
Final 5: =BN*0.4 + BM*0.6
```

#### Management and Economics (מנהל וכלכלה)

```
Final 5: =BQ*0.7 + BP*0.3    (standard 30/70 pattern)
```

#### Spanish (ספרדית)

```
Final 5: =BT*0.4 + BS*0.6
```

#### Communications / Tikshooret (תקשורת) -- Class 12 only

```
Final 5: =AY*0.5 + AX*0.5
```

### Weighted Average Formula

The weighted average (ממוצע משוקלל) aggregates a student's final scores across all subjects with differential weighting based on unit counts:

**For 5-unit Math, 5-unit English students (most common):**
```
=(U*5 + X*2 + AA*2 + AD*2 + AG*2 + AJ*2 + AW*5) / 20
```

Where:
- U = Math Final 5 (weight: 5)
- X = History Final (weight: 2)
- AA = Civics Final (weight: 2)
- AD = Tanakh Final (weight: 2)
- AG = Literature Final (weight: 2)
- AJ = Language Final (weight: 2)
- AW = English Final 5 (weight: 5)
- Total weights: 5+2+2+2+2+2+5 = 20

**For 4-unit Math, 4-unit English students:**
```
=(T*4 + X*2 + AA*2 + AD*2 + AG*2 + AJ*2 + AV*4) / 18
```

Where:
- T = Math Final 4 (weight: 4)
- AV = English Final 4 (weight: 4)
- Total weights: 4+2+2+2+2+2+4 = 18

**Key principle:** The unit level of Math and English determines the weight. 5-unit subjects get weight 5, 4-unit subjects get weight 4. Core subjects (History, Civics, Tanakh, Literature, Language) each get weight 2.

### Gamification Sheet Enhanced Formula

The Gamification sheet uses a slightly different formula that also includes elective subject scores:

**Standard average (ממוצע):**
```
=(AU*5 + AH*2 + AE*2 + AB*2 + Y*2 + V*2 + S*5) / AV
```
Where AV = "מתוך יחידות" (total unit count for that student, typically 20)

**Overall average including elective (ממוצע כולל):**
```
=(AU*5 + AH*2 + AE*2 + AB*2 + Y*2 + V*2 + S*5 + BB*5) / (AV+5)
```
This adds the elective 5-unit subject score (e.g., Computer Science) with weight 5.

### Passing Threshold

- **55** = Standard passing grade for Bagrut exams
- **52-53** = Highlighted in lighter blue (FF8DB3E2) as borderline -- flagged for attention
- **54** = Highlighted in light blue (FF00B0F0) as right at threshold -- still flagged
- Scores below 55 with red font (FFFF0000) indicate failing grades

---

## 6. Color Coding System

### Background Colors -- Complete Mapping

| Color Code | Visual Description | Meaning | Where Used |
|-----------|-------------------|---------|-----------|
| `FFC2D69B` | Light green | Student on track / passing / eligible for Bagrut | Student number column (D), tracking grid cells |
| `FFFFFF00` | Yellow | At risk / needs attention / to check | Student rows, tracking grid, "3 exams missing" label, challenging students |
| `FFD99594` | Pink/salmon | High risk / 4+ corrections needed, many failing exams | "4 exams missing" and "more than 4" labels in class sheets, "5+ failing" in rikuz |
| `FFFF0000` | Bright red | Non-matriculation student (לא בגרותי) | Column A flag for students deemed non-matriculation track |
| `FF92D050` | Bright green | Internal exam subject marker (פנימי); also class average font | Subject headers (History, Civics, Literature), "ממוצע" column header |
| `FFEF31CF` | Magenta/hot pink | External exam subject marker (חיצוני) | Subject headers (Tanakh specifically) |
| `FF00B0F0` | Light blue / cyan | Score at threshold (54) -- barely passing, high risk | English Sofi 3 cells with value around 54 |
| `FF8DB3E2` | Lighter blue / sky blue | Score threshold marker (52-53) -- borderline failing | Score cells in the 52-53 range |
| `FFFFC000` | Amber/orange | Risk level 3 background (סיכון גבוה / High risk) | Risk legend (W4 area), student risk indicators |
| `FFFBD4B4` | Peach/light salmon | Risk level 5 background (סיכון גבוה למצויינות 1 ג) | Risk legend (W6 area) |
| `FF548DD4` | Medium blue | Exam period row marker | Time period section headers in class sheets |
| `FFB2A1C7` | Purple/lavender | Exam period row marker | Time period section dividers |
| `FFC4BD97` | Tan/khaki | Exam period row marker | Time period section dividers |
| `FFC6D9F0` | Pale blue/ice blue | Exam period row marker | Time period section dividers |
| `FFF2DBDB` | Very light pink / blush | Weighted average cells (typically below-average students) | Column K (weighted average) for students with lower scores |

### Font Colors -- Complete Mapping

| Color Code | Visual Description | Meaning | Where Used |
|-----------|-------------------|---------|-----------|
| `FFFF0000` | Red | Failing grades (below 55 passing threshold) | Individual exam scores, risk level 4 and 5 text |
| `FF548DD4` | Blue | Scores above 90 (excellence indicator) | High-scoring cells in the legend and data |
| `FF92D050` | Green | Class average values | Row 43 average formulas, final subject score averages |
| `FFE36C09` | Orange | Risk level 2 indicator; also used for cumulative percentage markers in rikuz | Risk legend (W3), rikuz cumulative percentages |
| `FF993366` | Dark magenta/mauve | School contact information text | Row 7 contact info across class sheets |

### Color Legend Location

Each class sheet has an embedded legend in the header area (approximately cells R2-X6 and AB5-AH4):

```
R2: "לתקן" (To correct)          V2: [green bg] "1" = סיכוי גבוה
R3: "זהירות!!!" (Caution!)       W3: [orange font] "2" = סיכון
R4: "לבדוק" (To check)           W4: [amber bg] "3" = סיכון גבוה
R5: "ניגשים בחורף" (Taking winter) W5: [red font] "4" = סיכון מצויינות 1 ב
R6: "ניגשים בקיץ" (Taking summer)  W6: [peach bg, red font] "5" = סיכון גבוה למצויינות 1 ג

AG3: [light blue bg, red font] "52-53"
AH3: [cyan bg, red font] "54"
AK3: [green bg] "פנימי" (Internal)
AK4: [magenta bg] "חיצוני" (External)
AB5: [red font] "ציון נכשל" (Failing grade)
AB6: [blue font] "ציון מעל 90" (Score above 90)
```

---

## 7. Risk Level System (צפי)

### The Five Risk Levels

| Level | Hebrew | English | Background | Font | Meaning |
|-------|--------|---------|-----------|------|---------|
| 1 | סיכוי גבוה | High chance (of full Bagrut) | `FFC2D69B` (green) | Default | Student is on track to receive full Bagrut certificate with no issues |
| 2 | סיכון | Risk | None | `FFE36C09` (orange), bold | Student has some risk -- may have 1 failing score or borderline grades needing attention |
| 3 | סיכון גבוה | High risk | `FFFFC000` (amber) | Default | Student is at significant risk -- multiple failures or missing exams likely |
| 4 | סיכון מצויינות 1 ב | Risk to excellence "1 Bet" | None | `FFFF0000` (red), bold | Student is at risk of NOT achieving "Metzuyanut" (excellence/honors) level "1 Bet" |
| 5 | סיכון גבוה למצויינות 1 ג | High risk to excellence "1 Gimel" | `FFFBD4B4` (peach) | `FFFF0000` (red) | Student is at high risk of NOT achieving "Metzuyanut" (excellence/honors) level "1 Gimel" |

### Understanding Metzuyanut (מצויינות) in the Israeli Education Context

In the Israeli Bagrut system, "Metzuyanut" (excellence/honors) on the Bagrut certificate comes in tiers:

- **מצויינות 1 א (Metzuyanut 1 Aleph)**: Highest distinction -- weighted average above a high threshold (typically 96+)
- **מצויינות 1 ב (Metzuyanut 1 Bet)**: Second-tier distinction -- weighted average above a slightly lower threshold (typically 90+)
- **מצויינות 1 ג (Metzuyanut 1 Gimel)**: Third-tier distinction -- weighted average meeting the baseline honors threshold

The risk levels 4 and 5 specifically track students who are CLOSE to achieving excellence honors but are at risk of falling short. This is significant because excellence designations on the Bagrut certificate carry weight in university admissions and scholarship eligibility.

### Risk Level Assignment Logic

Risk levels appear to be manually assigned by Sarit based on:
1. Number of missing/failing exams
2. Proximity to passing thresholds (52-54 range)
3. Student's historical trajectory across exam periods
4. Whether the student needs corrections or additional exams
5. For levels 4-5, proximity to excellence thresholds

The risk level is stored in Column D (student number column) via background color, and sometimes in Column A with text annotations.

---

## 8. Time Period Tracking

### The Five Exam Period Snapshots

The file tracks student progress across 4-5 time points, corresponding to the Israeli academic calendar's Bagrut exam sessions:

| # | Hebrew | English | Calendar Period | Notes |
|---|--------|---------|----------------|-------|
| 1 | לאחר קיץ תשפ"ג | After summer 2023 | ~Aug 2023 | Earliest snapshot; students were in 10th/11th grade |
| 2 | לאחר קיץ תשפ"ד | After summer 2024 | ~Aug 2024 | Post 11th-grade summer exams |
| 3 | לאחר חורף תשפ"ה | After winter 2025 | ~Feb 2025 | Post 12th-grade winter exam session |
| 4 | לאחר חורף תשפ"ה + תיקונים והשלמות | After winter 2025 + corrections/completions | ~Mar 2025 | After corrections submitted and graded |
| 5 | לאחר קיץ תשפ"ה / לאחר מועד קיץ תשפ"ה | After summer 2025 | ~Jul 2025 (projected) | Final exam period -- includes projections |

### Class Sheet Status Summary Structure

Each class sheet contains 4 status summary blocks (one per historical exam period) structured as:

**For "After Summer" periods (using questionnaire-based counting):**
```
Row Header: "לאחר קיץ תשפ"ד"
- אין שאלונים לתיקון (No questionnaires to correct) -- Count + %
- שאלון אחד לתיקון / השלמה (One questionnaire to correct) -- Count + %
- שני שאלונים לתיקון / השלמה (Two questionnaires to correct) -- Count + %
- שלושה שאלונים לתיקון / השלמה (Three questionnaires) -- [Yellow bg] Count + %
- ארבעה שאלונים לתיקון / השלמה (Four questionnaires) -- [Pink bg] Count + %
- שאלונים רבים לתיקון / השלמה (Many questionnaires) -- [Pink bg] Count + %
Total: =SUM(counts)
```

**For "After Summer - Final" period (using exam-based counting):**
```
Row Header: "לאחר מועד קיץ תשפ"ה"
- בגרות מלאה (Full Bagrut) -- Count + %
- בגרות מלאה למרות בחינה חסרה (Full Bagrut despite missing exam) -- Count + %
- חסרה בחינה (Missing one exam) -- Count + %
- חסרות 2 בחינות (Missing 2 exams) -- Count + %
- חסרות 3 בחינות (Missing 3 exams) -- Count + %
- חסרות 4 בחינות (Missing 4 exams) -- Count + %
- חסרות יותר מ 4 בחינות (Missing more than 4 exams) -- Count + %
Total: =SUM(counts)
```

### Cumulative Percentages

Each summary block calculates cumulative percentages showing what proportion of students are at or above each threshold:

```
L54 = F54/F61   (% with full Bagrut)
M54 = L54+L55   (% with full Bagrut including "despite missing exam")
N54 = M54+L56   (% cumulative through "missing one exam")
```

### Student-by-Student Tracking Grid

The bottom section of each class sheet (starting around row 99) provides a detailed color-coded grid showing every student's status at each time period:

```
Columns D-J: לאחר קיץ תשפ"ג (After summer 2023)
  D: Student number [color-coded background]
  E: Student name [may have yellow bg if at risk]
  J: Notes (e.g., "בסכנה לבגרות")

Columns K-Q: לאחר קיץ תשפ"ד (After summer 2024)
  K: Student number [color-coded background]
  L: Student name
  Q: Notes

Columns R-X: לאחר חורף תשפ"ה (After winter 2025)
  R: Student number [color-coded background]
  S: Student name
```

**Color coding in the tracking grid:**
- Green (`FFC2D69B`): Student is on track / no failing exams at that point
- Yellow (`FFFFFF00`): Student has some issues / at risk
- Red (`FFFF0000`): Student is non-matriculation / many failures
- No color: Default / nominal

**Example of student trajectory:**
```
Student: אהרון שחר (Aharon Shachar)
- After summer 2023: Green (1) -- on track
- After summer 2024: Yellow (1) -- developed issues
- After winter 2025: Yellow (1) -- still at risk
```

This longitudinal view enables Sarit and the homeroom teachers to see which students are improving, which are declining, and where intervention is needed.

---

## 9. Summary/Aggregation Logic (ריכוז Sheet)

### Sheet Structure

The ריכוז (Rikuz / Consolidation) sheet (dimensions B4:AN176) provides school-wide aggregation across five major time-period sections:

#### Section 1: After Summer 2023 (Rows 4-18) -- "לאחר קיץ תשפ"ג"

Structure:
- Row headers: Classes (יא 1 through יא 16) -- note these use "Yud-Aleph" (11th grade) labels because that was their grade at the time
- Column AC: Class 12 (separate)
- Column AD: Total (classes + class 12)
- Categories tracked:
  - לא חסרות בחינות (No missing exams)
  - צריך להשלים בחינה אחת (Need to complete one exam)
  - חסרות 2 בחינות (Missing 2 exams)
  - חסרות 3 בחינות (Missing 3 exams) -- [Yellow bg]
  - חסרות 4 בחינות (Missing 4 exams) -- [Pink bg]
  - חסרות יותר מ 4 בחינות (Missing more than 4 exams) -- [Pink bg]
- Totals per class: `=SUM(G7:G12)` etc.
- Grand total: `=SUM(G7:U7)` for each category
- Percentage: `=V7/V13` (category count / total students)

#### Cumulative Percentages (Columns X-Z, AF-AH)

The rikuz calculates cascading cumulative percentages:

```
W7  = V7/V13                    (% no missing exams)
X7  = W7 + W8                   (cumulative: 0 or 1 missing) [Bold]
Y7  = X7 + W9                   (cumulative: 0, 1, or 2 missing) [Orange font]
Z7  = Y7 + W10                  (cumulative: 0-3 missing) [Orange font]
```

Same pattern with class 12 included (columns AD-AH).

**Actual values from the data (After summer 2023):**
- 331 students (66.7%) with no missing exams
- 443 (89.3%) with 0-1 missing
- 470 (94.8%) with 0-2 missing
- 484 (97.6%) with 0-3 missing
- Total: 496 students (without class 12) / 509 (with class 12)

#### Section 2: Report Card Grades Semester 1 (Rows 21-36) -- "ציוני תעודה מחצית א"

Different categorization based on current semester grades (failing counts):

- ללא נכשלים (No failures): Count per class
- נכשל 1 או חסרה בחינה (1 failure or missing exam)
- 2 נכשלים (2 failures)
- 3 נכשלים (3 failures)
- 4 נכשלים (4 failures)
- 5 ויותר נכשלים (5+ failures) -- [Pink bg]

**Actual values (Semester 1 grades):**
- 182 students (36%) with no failures
- 340 (67.3%) with 0-1 failures
- 403 (79.8%) with 0-2 failures
- 449 (88.9%) with 0-3 failures

#### Section 3: After Summer 2024 (Rows 38-66) -- "לאחר קיץ תשפ"ד"

Same structure as Section 2 with same failure-count categories. Now uses "Yud-Bet" (12th grade) class labels. Includes a "challenging students" subsection.

#### Section 4: After Winter 2025 (Rows 70-97) -- "לאחר חורף תשפ"ה"

Same failure-count structure. Includes its own "challenging students" subsection.

#### Section 5: After Winter 2025 + Corrections (Rows 99-135) -- "לאחר חורף תשפ"ה + תיקונים והשלמות"

Same failure-count structure. Includes challenging students subsection.

#### Section 6: After Summer 2025 / Projected (Rows 138-176) -- "לאחר קיץ תשפ"ה"

Uses exam-missing categories (not failure counts):
- לא חסרות בחינות (No missing exams)
- בגרות מלאה למרות מקצוע חסר (Full Bagrut despite missing subject)
- צריך להשלים בחינה אחת (Need to complete one exam)
- חסרות 2 בחינות (Missing 2 exams)
- חסרות 3 בחינות (Missing 3 exams) -- [Yellow bg]
- שלושה שאלונים לתיקון / השלמה (3 questionnaires to correct)
- ארבעה שאלונים לתיקון / השלמה (4 questionnaires)

**Projected final values:**
- 455 students (90.5%) with no missing exams
- 465 (92.4%) with full Bagrut (including "despite missing subject")
- 486 (96.6%) cumulative through one additional exam needed
- 503 total students

### Class 12 Separation

Throughout the rikuz sheet, Class 12 is tracked separately in column AC, then combined with the rest in column AD. This enables the school to see:
1. Performance of regular classes (Columns G-U, total in V)
2. Performance of the special class 12 (Column AC)
3. Combined school performance (Column AD)

This separation exists because Class 12 has a different educational track and smaller size (13 students).

---

## 10. Year-over-Year Comparison (השוואה בין השנים)

### Sheet Structure

The comparison sheet (dimensions C3:P23) is a compact 4-year trend analysis with the header "תעודת בגרות איכותית (לא כולל ח"מ)" (Quality Bagrut Certificate, not including special ed).

### Years Tracked

| Column | Hebrew Year | Gregorian Year |
|--------|-----------|---------------|
| E | תשפ"ב | 2021-2022 |
| F | תשפ"ג | 2022-2023 |
| G | תשפ"ד | 2023-2024 |
| H | תשפ"ה | 2024-2025 |

### Metrics Tracked

| Metric | Hebrew | E (תשפ"ב) | F (תשפ"ג) | G (תשפ"ד) | H (תשפ"ה) |
|--------|--------|-----------|-----------|-----------|-----------|
| Total students | מספר התלמידים בשכבה | 582 | 532 | 532 | 503 |
| Full Bagrut eligible | מספר התלמידים עם זכאות מלאה | 562 | 515 | 515 | 465 |
| Eligibility rate | אחוז עם זכאות מלאה | 96.6% | 96.8% | 96.8% | 92.4% |
| English 4-unit | תלמידים שסיימו 4 יח"ל באנגלית | 63 | 66 | 62 | 56 |
| English 4-unit % | אחוז מכלל השכבה | 10.8% | 12.4% | 11.7% | 11.1% |
| English 5-unit | תלמידים שסיימו 5 יח"ל באנגלית | 499 | 456 | 450 | 414 |
| English 5-unit % | אחוז מכלל השכבה | 85.7% | 85.7% | 84.6% | 82.3% |
| Math 4-unit | תלמידים שסיימו 4 יח"ל במתמטיקה | 183 | 164 | 174 | 147 |
| Math 4-unit % | אחוז מכלל השכבה | 31.4% | 30.8% | 32.7% | 29.2% |
| Math 5-unit | תלמידים שסיימו 5 יח"ל במתמטיקה | 242 | 191 | 197 | 170 |
| Math 5-unit % | אחוז מכלל השכבה | 41.6% | 35.9% | 37.0% | 33.8% |
| Honors students | תלמידים שסיימו כמצטיינים | 255 | 197 | 196 | 174 |
| Honors % | אחוז מכלל השכבה | 43.8% | 37.0% | 36.8% | 34.6% |

### Key Trends Visible

1. **Declining total enrollment**: 582 -> 503 (13.6% decrease over 4 years)
2. **Declining eligibility rate**: 96.6% -> 92.4% (notable drop in current year)
3. **Declining 5-unit Math participation**: 41.6% -> 33.8%
4. **Declining honors rate**: 43.8% -> 34.6%
5. **Relatively stable English 5-unit**: ~85% -> 82.3%

These trends suggest the school may be facing challenges maintaining academic performance standards, which adds urgency to the tracking tool's purpose.

---

## 11. Gamification Sheet (מישחוק)

### Sheet Structure

The Gamification sheet (dimensions A5:CE172, 172 rows, 83 columns) mirrors the sorting sheet but with a critical difference: it includes **projected/simulated scores** for students who haven't yet taken certain exams.

### Key Distinguishing Features

1. **Column A**: Contains the class identifier (e.g., "יב 1", "יב 5") for each student
2. **Column B**: Student number (with green background for passing students)
3. **Column AV**: "מתוך יחידות" (Out of units) -- the denominator for the weighted average, reflecting how many units the student has completed
4. **Column AW**: "ממוצע" (Average) -- weighted average using the variable denominator
5. **Column AY**: "ממוצע כולל" (Overall average) -- weighted average including elective subjects

### Gamification Formula

The gamification sheet appears to simulate what grades students would achieve if they scored 5 points below their best exam on remaining questionnaires:

```
=O7-5    (projecting a score 5 points below their highest)
```

This "minus 5" pattern appears for projected scores, creating a conservative but optimistic projection.

**Average formula with variable denominator:**
```
AW = (AU*5 + AH*2 + AE*2 + AB*2 + Y*2 + V*2 + S*5) / AV
```

**Overall average including elective:**
```
AY = (AU*5 + AH*2 + AE*2 + AB*2 + Y*2 + V*2 + S*5 + BB*5) / (AV+5)
```

### Purpose

The gamification sheet serves as a **"what-if" scenario tool** that shows:
- What each student's weighted average would be if they complete all remaining exams
- How much room for improvement exists
- Which students, with realistic effort, could reach excellence thresholds
- The impact of elective subject performance on overall averages

### Subjects Tracked in Gamification

The gamification sheet includes all the core subjects plus these electives (based on column headers):
- מדעי המחשב (Computer Science)
- חוק"ש תושב"ע (Jewish Law)
- פיזיקה (Physics)
- מדעי החברה (Social Sciences)
- חנ"ג (Physical Education)
- מדעי הרפואה (Medical Sciences)
- גאוגרפיה (Geography)
- מנהל וכלכלה (Management and Economics)
- קולונוע (Film/Cinema)

### Difference from Sorting Sheet

| Feature | Sorting Sheet (מיון) | Gamification Sheet (מישחוק) |
|---------|---------------------|---------------------------|
| Scores | Actual exam scores only | Includes projected "gamified" scores |
| Average formula | Fixed denominator based on level | Variable denominator (מתוך יחידות) |
| Elective inclusion | All subjects listed separately | "Overall average" column includes electives |
| Projected scores | None | Uses "score - 5" projection for missing exams |
| Number of students | ~528 rows | ~172 rows (subset -- likely only students with projectable data) |
| Primary purpose | Ranking by actual performance | Motivational/planning tool for improvement |

---

## 12. Sorting/Ranking Sheet (מיון ע"פ ממוצע משוקלל)

### Sheet Structure

The sorting sheet (dimensions A4:EO528, 528 rows, 145 columns) is the largest sheet in the workbook. It contains ALL students across all classes, sorted by their weighted average score.

### Column Layout

The sorting sheet replicates the same column structure as the class sheets but with all subjects represented for the entire school:

**Identifying columns:**
- Column A: Class identifier (e.g., "יב 1")
- Column B: Student number within class
- Columns C-D: Unknown / may be blank
- Columns E-F: Student name (merged)
- Column G: Adapted exam (מותאם)
- Column H: Dictation (הכתבה)
- Column I: Oral exam (בע"פ)
- Column J: Special accommodations (ע"ח)

**Core subjects (same order as class sheets):**
- Columns K-T: Mathematics (all questionnaire codes)
- Columns U-W: History
- Columns X-Z: Civics
- Columns AA-AC: Tanakh
- Columns AD-AF: Literature
- Columns AG-AI: Language
- Columns AJ-AV: English (all modules)

**Elective subjects (extended):**
- Columns AW-AX: General Studies
- Column AY: Introduction to Sciences
- Columns AZ-BE: Computer Science
- Columns BF-BH: Geography
- Columns BI-BK: Italian
- Columns BL-BO: Biology
- Columns BP-BS: Chemistry
- Columns BT-BX: Physics
- Columns BY-CA: Management and Economics
- Columns CB-CK: Social Sciences
- Columns CL-CO: Arabic
- Columns CP-CS: Physical Education
- Columns CT-CV: Spanish
- Columns CW-CY: Jewish Law
- Columns CZ-DB: Film/Cinema
- Columns DC-DF: Medical Sciences
- Columns DG-DJ: Arabic (second variant)
- Columns DK-DM: French
- Columns DN-DP: Chinese
- Columns DQ-DS: Philosophy
- Column DT: Mada"ch Final Project
- Column DU: Music Recital
- Column DV: Biology Final Project
- Columns DW-DZ: Dance
- Columns EA-ED: Music
- Columns EE-EG: Theater
- Columns EH-EJ: Extended Bible Studies
- Column EK: Physical Education (duplicate)
- Column EL: Community Service

### Purpose

The sorting sheet allows Sarit to:
1. **Rank all ~500 students** from highest to lowest weighted average
2. **Identify top performers** across the entire school
3. **Compare students across different classes** taking the same subjects
4. **Spot patterns** in subject performance school-wide
5. **Determine honors eligibility** across the full student body

### Key Characteristics

- Students appear to be pre-sorted (or manually sorted) by weighted average descending
- Each row maintains the class identifier so the student's home class is always visible
- The sheet serves as a "flat view" of all data that normally lives in separate class sheets
- All 30+ possible subjects have dedicated columns, even though most students only take 7-10

---

## 13. Special Sections

### Challenging Students (מאתגרים במיוחד)

Found in the ריכוז sheet at multiple exam period sections (approximately rows 50-60, 80-92, 120-135). Each instance follows this structure:

**Header:**
```
"מאתגרים במיוחד (לבדוק אפשרות לשיחה עם שרית)"
"Especially challenging (check possibility for conversation with Sarit)"
```
[Red font]

**Three-column layout:**

| Column K | Column P | Column T |
|----------|----------|----------|
| "מאתגרים במיוחד" (Especially challenging) | "יעברו כנראה:" (Will probably pass:) | "לטיפול צמוד של שירה ומחנכי הכיתה" (For close follow-up by Shira and homeroom teachers) |

**Example entries:**

| Student | Category | Notes |
|---------|----------|-------|
| בן ארי רם אשר | Especially challenging | "ניגש ללשון" (Taking Language exam) |
| פינקלקראוט בר שלמה | Especially challenging | "ניגש לתנ"ך בחורף + משלים עכשיו היסטוריה, בבדיקה לגבי 30% היסטוריה" |
| אסאילוב ברוך | Especially challenging | "לשיחה עם שרית" (For conversation with Sarit) |
| חסדאי אופיר | Especially challenging | [Yellow bg] |
| גבע ליאת | Non-functioning | "לא מתפקדת" (Not functioning) |
| בצלאל עידו | Probably will pass | [Yellow bg] |
| פרסמן ניצן | Probably will pass | |
| אלפי-אהרון סול אן | Probably will pass | * |
| המר רומי | Close follow-up | "שיפור" (Improvement) |
| דהן לירז | Close follow-up | "בק"ס" (abbreviation) |
| לוי-קופלמן יותם | Close follow-up | "לא מתפקד - עוד שיחה אצל הילה" (Not functioning - another conversation at Hila's) |
| זיו גבריאל | Close follow-up | "אין בעיה" (No problem) |
| אמיר אריאל | Close follow-up | "לא ניגשה למתמטיקה 381 בחורף. ניגשה בחורף ללשון - לשיחה עם הילה" |
| תמם ליאן | Close follow-up | "לשיחה אצל הילה" (For conversation at Hila's) |

### Non-Matriculation Students (לא בגרותי)

Students flagged with `FFFF0000` (red) background in Column A with the text "לא בגרותי" (non-matriculation) or "לא בגרותית" (feminine form). These students are on a non-academic track and are essentially excluded from the Bagrut eligibility statistics. Found across multiple classes:
- Class 1: 1 student (e.g., צדקה רום)
- Class 2: 2 students
- Class 4: 1 student
- Class 5: 2 students
- Class 6: 1 student
- Class 8: 1 student
- Class 10: 1 student
- Class 11: 1 student
- Class 13: 2 students
- Class 15: 1 student
- And others

### At-Risk Annotations (בסכנה לבגרות)

Some students have the text "בסכנה לבגרות" (at risk for Bagrut) in Column A. These are students who ARE on the academic track but are in danger of not achieving full Bagrut eligibility. These students receive:
- Yellow background highlighting
- Action items in the challenging students section
- Close monitoring across exam periods

### Staff References

| Name | Role | Context |
|------|------|---------|
| שרית (Sarit) | Bagrut coordinator / VP Academics | Primary user; challenging students flagged for her attention |
| שירה (Shira) | Staff member (likely counselor or VP) | Assigned close follow-up of challenging students |
| הילה (Hila) | Staff member (likely principal or counselor) | Escalation point for non-functioning students |
| Individual homeroom teachers per class | מחנכ/ת | Listed in row 3 of each class sheet (e.g., דוד שרוני for class 1, ספי ברוך for class 12) |

### Arabic Major Designation (מגמת ערבית)

Some classes (particularly classes 15, 16) have students with a "מגמת ערבית" (Arabic major) designation, indicating a specific educational track focusing on Arabic language studies.

---

## 14. Key Formulas

### Complete Formula Catalog

#### Weighted Average (ממוצע משוקלל)

**5-unit Math + 5-unit English:**
```excel
=(U{row}*5 + X{row}*2 + AA{row}*2 + AD{row}*2 + AG{row}*2 + AJ{row}*2 + AW{row}*5) / 20
```

**4-unit Math + 4-unit English:**
```excel
=(T{row}*4 + X{row}*2 + AA{row}*2 + AD{row}*2 + AG{row}*2 + AJ{row}*2 + AV{row}*4) / 18
```

#### Mathematics Finals

**Sofi 3:**
```excel
=N{row}*0.4 + M{row}*0.35 + L{row}*0.25
```

**Sofi 4:**
```excel
=O{row}*0.65 + P{row}*0.35
```

**Sofi 5:**
```excel
=Q{row}*0.6 + R{row}*0.4
```

#### Standard 30/70 Subjects

**History:**
```excel
=W{row}*0.7 + V{row}*0.3
```

**Civics (80/20):**
```excel
=Z{row}*0.8 + Y{row}*0.2
```

**Tanakh:**
```excel
=AC{row}*0.7 + AB{row}*0.3
```

**Literature:**
```excel
=AF{row}*0.7 + AE{row}*0.3
```

**Language:**
```excel
=AI{row}*0.7 + AH{row}*0.3
```

#### English Finals

**Sofi 3 (3 יח"ל):**
```excel
=AT{row}*0.2 + AM{row}*0.27 + AL{row}*0.26 + AK{row}*0.27
```

**Sofi 4 (4 יח"ל) -- used in gamification/class 12:**
```excel
=AP{row}*0.2 + AL{row}*0.27 + AK{row}*0.26 + AJ{row}*0.27
```

**Sofi 5 (5 יח"ל):**
```excel
=AT{row}*0.2 + AQ{row}*0.27 + AP{row}*0.26 + AO{row}*0.27
```

#### Elective Subject Finals

**Computer Science:**
```excel
=BB{row}*0.3 + BA{row}*0.7
```

**Physics:**
```excel
=BK{row}*0.25 + BJ{row}*0.3 + BI{row}*0.15 + BH{row}*0.3
```

**Jewish Law (תושב"ע):**
```excel
=BF{row}*0.5 + BE{row}*0.5
```

**Geography:**
```excel
=BN{row}*0.4 + BM{row}*0.6
```

**Management and Economics:**
```excel
=BQ{row}*0.7 + BP{row}*0.3
```

**Spanish:**
```excel
=BT{row}*0.4 + BS{row}*0.6
```

**Communications (Class 12):**
```excel
=AY{row}*0.5 + AX{row}*0.5
```

#### Aggregation Formulas

**Class Average:**
```excel
=AVERAGE(K11:K42)    (for any subject column)
```

**Student Count:**
```excel
=COUNT(S11:S42)      (count of students with scores)
```

**Rikuz Totals:**
```excel
=SUM(G7:U7)          (sum across all classes for a category)
```

**Rikuz Percentages:**
```excel
=V7/V13              (category count / total)
```

**Rikuz Cumulative:**
```excel
=W7+W8               (no missing + 1 missing)
=X7+W9               (previous + 2 missing)
```

**Year-over-Year:**
```excel
=E7/E6               (eligible / total)
```

#### Gamification-Specific

**Projected score:**
```excel
=O{row}-5            (highest score minus 5 as conservative projection)
```

**Variable-denominator average:**
```excel
=(AU*5+AH*2+AE*2+AB*2+Y*2+V*2+S*5)/AV
```
Where AV = dynamically calculated unit total per student.

**Overall average with elective:**
```excel
=(AU*5+AH*2+AE*2+AB*2+Y*2+V*2+S*5+BB*5)/(AV+5)
```

---

## 15. Class 12 Differences

### Overview

Class 12 (Yud-Bet 12) is fundamentally different from the other 15 regular classes:

| Feature | Regular Classes (1-11, 13-16) | Class 12 |
|---------|------------------------------|----------|
| Size | 23-40 students | 13 students |
| Sheet dimensions | ~130-154 rows, 86-117 cols | 66 rows, 84 cols |
| Homeroom teacher | Various | ספי ברוך (Safi Baruch) |
| Placement in workbook | Sheets 1-15 (in order) | Sheet 17 (out of order, after ריכוז) |
| Column layout | Standard | Slightly modified (fewer columns) |
| Unique subjects | Various electives | תקשורת (Communications) with codes 56387/56283 |
| Student numbering | Column D, rows 11-42 | Column B, rows 11-23 |

### Structural Differences

1. **Column shift**: Student names are in Column C (not E), student numbers in Column B (not D)
2. **Merged cell for name**: C9:D10 merged for "שם" header (vs E9:F10 in regular sheets)
3. **Fewer total columns**: 84 vs 86-117 in regular sheets
4. **No weighted average column**: The "ממוצע" column appears absent or differently placed
5. **Communications subject**: Only class 12 has תקשורת columns (AX-BA area with codes 56387, 56283)
6. **Module E code difference**: English Module E uses code 16481 instead of 16471

### "Chasam" (חסם) Entries

Class 12 is notable for having "חסם" (barrier/block) entries in exam score cells (e.g., cell K13, K17). These appear with yellow background and indicate that the student was blocked from taking that particular exam questionnaire, possibly due to prerequisites or administrative reasons. This causes formula errors:

```
P13 = #VALUE!    (because K13 contains text "חסם" instead of a number)
Formula: =K13*0.4+J13*0.35+I13*0.25
```

### Many Missing Exams

Class 12 students generally have far more empty cells (missing exam scores) than regular class students. Many students have scores for only a handful of subjects. For example:
- Student 1 (איתן נועם): Only has scores for General Studies (55), Physical Education (40), Community Service (1) -- almost entirely blank
- Student 4 (דניאל אופק): Only has Literature (85/45), General Studies (60), PE (50)
- Most students are missing English module scores entirely

### Separate Tracking in ריכוז

In the rikuz sheet, Class 12 consistently appears in a separate column (AC) rather than being grouped with the regular classes (columns G-U). Its data is then added to a combined total (column AD = V + AC).

### Implications for Product Design

The Class 12 differences suggest:
1. This is likely a special-education, integration, or alternative-track class
2. The tracking needs are different (fewer subjects, more individual attention)
3. The weighted average formula may need a completely different denominator
4. "חסם" handling needs special logic (not just empty cells)
5. The system needs to support variable column layouts per class or class type

---

## 16. Workflow

### Day-to-Day Usage Pattern

Based on the file structure and data patterns, this is how the workbook appears to be used:

#### Data Entry Flow

1. **After each exam period** (summer/winter), Sarit receives official Bagrut scores from the Ministry of Education
2. **Scores are manually entered** into each class sheet in the appropriate questionnaire column
3. **Formulas automatically calculate** final subject scores and weighted averages
4. **Color coding is manually applied** to student rows based on risk assessment
5. **Status summary sections** are updated with counts of students by category

#### Update Cycle

```
Timeline of a typical academic year:

Sep-Nov:  New year begins. Previous year's data is baseline.
          Class sheets populated with student names, class assignments.
          Historical scores from previous exam periods already present.

Dec-Jan:  Winter exam session approaches.
          "ניגשים בחורף" (Taking winter exams) noted for specific students.
          Semester 1 grades entered into rikuz "ציוני תעודה מחצית א" section.

Feb-Mar:  Winter exam results arrive.
          "לאחר חורף תשפ"ה" sections updated.
          Risk assessments revised.
          Challenging students section updated with action items.

Mar-Apr:  Corrections and completions processed.
          "לאחר חורף תשפ"ה + תיקונים והשלמות" section updated.
          Student tracking grid colors updated.

May-Jun:  Summer exam session approaches.
          "ניגשים בקיץ" (Taking summer exams) noted.
          Gamification sheet updated with projections.

Jul-Aug:  Summer exam results arrive.
          "לאחר קיץ תשפ"ה" sections updated.
          Final Bagrut eligibility determined.
          Year-over-year comparison sheet updated.
          Sorting sheet finalized.

Sep:      Final wrap-up. Non-eligible students identified.
          Data serves as historical reference for next year's planning.
```

#### Who Updates When

| Person | What They Update | When |
|--------|-----------------|------|
| Sarit | All class sheets, rikuz, sorting, gamification, year comparison | After each exam period |
| Sarit | Risk levels (צפי), color coding | After reviewing new scores |
| Sarit | Challenging students section | During status meetings |
| Homeroom teachers | May provide input on student status | Via meetings with Sarit |
| Shira / Hila | Do not directly edit; receive reports and provide follow-up | After challenging students identified |

#### Key Operational Questions the Tool Answers

1. **"How many students will get full Bagrut?"** -- rikuz cumulative percentages
2. **"Which students need intervention right now?"** -- challenging students section
3. **"Which class is performing worst?"** -- rikuz per-class breakdown
4. **"How does this year compare to previous years?"** -- comparison sheet
5. **"Who are our top students?"** -- sorting sheet
6. **"What would grades look like if struggling students improve?"** -- gamification sheet
7. **"Which subjects have the most failures?"** -- failing count rows in class sheets
8. **"Is student X improving or declining?"** -- tracking grid color changes over time

#### Pain Points of the Current Manual Process

1. **Massive manual data entry**: ~500 students x 20+ subjects x multiple exam periods
2. **Error-prone formulas**: "חסם" entries causing #VALUE! errors
3. **Color coding is manual**: Every risk assessment color must be hand-applied
4. **No real-time updates**: Data is stale between update cycles
5. **Difficult to maintain consistency**: Column layouts vary slightly between class sheets
6. **Class 12 requires separate handling**: Different structure adds complexity
7. **No automated alerts**: At-risk students must be identified by visual scanning
8. **Limited collaboration**: Single Excel file creates versioning challenges
9. **No audit trail**: Changes cannot be tracked or attributed
10. **Scaling challenge**: Adding subjects, classes, or exam periods requires restructuring columns

---

## Appendix A: Sheet-by-Sheet Class Sizes

| Class | Students | Sheet Rows | Notes |
|-------|----------|------------|-------|
| יב 1 | 32 | 131 | Standard |
| יב 2 | 35 | 147 | Largest variety of subjects |
| יב 3 | 40 | 148 | Largest class |
| יב 4 | 31 | 127 | |
| יב 5 | 33 | 131 | |
| יב 6 | 30 | 136 | |
| יב 7 | 39 | 154 | |
| יב 8 | 36 | 136 | |
| יב 9 | 35 | 138 | |
| יב 10 | 23 | 107 | Smallest regular class |
| יב 11 | 31 | 138 | |
| יב 13 | 39 | 152 | |
| יב 14 | 38 | 144 | |
| יב 15 | 38 | 142 | |
| יב 16 | 16 | 115 | Second smallest regular |
| יב 12 | 13 | 66 | Special class |
| **Total** | **~509** | | |

## Appendix B: Column Mapping Reference (Class Sheet 1)

| Column | Content | Notes |
|--------|---------|-------|
| A | Flags | "לא בגרותי", "בסכנה לבגרות" |
| B | Unit levels | "5  5", "5  3", "4  3" (Math/English) |
| C | Additional unit info | |
| D | Student number | Color-coded by risk |
| E | Student name | |
| F | (merged with E) | |
| G | Adapted (מותאם) | Accommodation flag |
| H | Dictation (הכתבה) | Accommodation flag |
| I | Oral (בע"פ) | Accommodation flag |
| J | Special (ע"ח) | Accommodation flag |
| K | Weighted average (ממוצע) | Green bg header, formula |
| L | Math 182/183 | 3-unit questionnaire |
| M | Math 381 | 3-unit questionnaire |
| N | Math 382 | 3-unit questionnaire |
| O | Math 481 | 4-unit questionnaire |
| P | Math 482 | 4-unit questionnaire |
| Q | Math 581 | 5-unit questionnaire |
| R | Math 582 | 5-unit questionnaire |
| S | Math Sofi 3 | Formula: N*0.4+M*0.35+L*0.25 |
| T | Math Sofi 4 | Formula: O*0.65+P*0.35 |
| U | Math Sofi 5 | Formula: Q*0.6+R*0.4 |
| V | History 30% (internal) | Green bg header |
| W | History 70% (external) | |
| X | History Final | Formula: W*0.7+V*0.3 |
| Y | Civics Performance Task | Green bg header |
| Z | Civics Exam | |
| AA | Civics Final | Formula: Z*0.8+Y*0.2 |
| AB | Tanakh 30% (internal) | Magenta bg header |
| AC | Tanakh 70% (external) | |
| AD | Tanakh Final | Formula: AC*0.7+AB*0.3 |
| AE | Literature 30% (internal) | Green bg header |
| AF | Literature 70% (external) | |
| AG | Literature Final | Formula: AF*0.7+AE*0.3 |
| AH | Language 30% (internal) | |
| AI | Language 70% (external) | |
| AJ | Language Final | Formula: AI*0.7+AH*0.3 |
| AK | English Module A (16381) | |
| AL | English Module B (16383) | |
| AM | English Module C (16382) | |
| AN | English Module D (16483) | |
| AO | English Module E (16471) | |
| AP | English Module F (16583) | |
| AQ | English Module G (16582) | |
| AR | English Oral 3 יח"ל | |
| AS | English Oral 4 יח"ל | |
| AT | English Oral 5 יח"ל | |
| AU | English Sofi 3 | Formula: AT*0.2+AM*0.27+AL*0.26+AK*0.27 |
| AV | English Sofi 4 | |
| AW | English Sofi 5 | Formula: AT*0.2+AQ*0.27+AP*0.26+AO*0.27 |
| AX | General Studies (score 1) | |
| AY | General Studies (score 2) | |
| AZ | Introduction to Sciences | |
| BA-BD | Computer Science | 899381, 899373, Sofi 5, 883589 |
| BE-BG | Jewish Law (תושב"ע) | 7383, 7281, Sofi 5 |
| BH-BL | Physics | 361, 376, 283, 371, Sofi 5 |
| BM-BO | Geography | 57381, 57238, Sofi 5 |
| BP-BR | Management/Economics | 839283, 381, Sofi 5 |
| BS-BU | Spanish | 579385, 579283, Sofi 5 |
| BV | Mada"ch Final Project | |
| BW | Music Recital | |
| BX | Physical Education (חנ"ג) | 0-100 |
| BY | Community Service (מעורבות) | Typically 3-4 |

## Appendix C: Enhanced Subjects Weight Table (מוגברים)

Found in row 8 of class sheets, showing internal/external weights for 5-unit elective subjects:

| Subject Area | Weight 1 | Weight 2 | Weight 3 | Weight 4 | Notes |
|-------------|----------|----------|----------|----------|-------|
| Computer Science | 76% / 24% | | | | Also has 100% single component |
| Jewish Law | 50% / 50% | | | | Equal weighting |
| Physics | 30% / 15% / 30% / 25% | | | | 4-component weighting |
| Geography | 60% / 40% | | | | |
| Management/Economics | 30% / 70% | | | | Standard pattern |
| Spanish | 60% / 40% | | | | |

---

*This document serves as the authoritative reference for understanding the Sheifa School Bagrut Tracking System and is intended to guide the design and development of a replacement digital product.*
