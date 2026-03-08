# Complete Spreadsheet Inventory
## Sheifa School Bagrut Tracking System (sarit-example.xlsx)

---

## 1. Sheets/Tabs

### 20 Total Sheets

| # | Sheet Name (Hebrew) | Sheet Name (English) | Purpose | Dimensions | Rows | Cols |
|---|---------------------|---------------------|---------|------------|------|------|
| 1 | 1 יב | Yud-Bet 1 | Class 1 grade tracking | A1:CX131 | 131 | 102 |
| 2 | 2 יב | Yud-Bet 2 | Class 2 grade tracking | A1:DL147 | 147 | 116 |
| 3 | 3 יב | Yud-Bet 3 | Class 3 grade tracking | A1:CH148 | 148 | 86 |
| 4 | 4 יב | Yud-Bet 4 | Class 4 grade tracking | A1:CR127 | 127 | 96 |
| 5 | 5 יב | Yud-Bet 5 | Class 5 grade tracking | A1:DK131 | 131 | 115 |
| 6 | 6 יב | Yud-Bet 6 | Class 6 grade tracking | A1:CX136 | 136 | 102 |
| 7 | 7 יב | Yud-Bet 7 | Class 7 grade tracking | A1:DI154 | 154 | 113 |
| 8 | 8 יב | Yud-Bet 8 | Class 8 grade tracking | A1:DJ136 | 136 | 114 |
| 9 | 9 יב | Yud-Bet 9 | Class 9 grade tracking | A1:DF138 | 138 | 110 |
| 10 | 10 יב | Yud-Bet 10 | Class 10 grade tracking | A1:DA107 | 107 | 105 |
| 11 | 11 יב | Yud-Bet 11 | Class 11 grade tracking | A1:CZ138 | 138 | 104 |
| 12 | 13 יב | Yud-Bet 13 | Class 13 grade tracking | A1:DF152 | 152 | 110 |
| 13 | 14 יב | Yud-Bet 14 | Class 14 grade tracking | A1:DM144 | 144 | 117 |
| 14 | 15 יב | Yud-Bet 15 | Class 15 grade tracking | A1:DF142 | 142 | 110 |
| 15 | 16 יב | Yud-Bet 16 | Class 16 grade tracking | A1:CH115 | 115 | 86 |
| 16 | ריכוז | Rikuz (Summary) | School-wide consolidation/aggregation | B4:AN176 | 176 | 40 |
| 17 | 12 יב | Yud-Bet 12 | Special class 12 grade tracking | A1:CF66 | 66 | 84 |
| 18 | השוואה בין השנים | Hashvaa (Year Comparison) | Year-over-year comparison | C3:P23 | 23 | 16 |
| 19 | מיון ע"פ ממוצע משוקלל | Miyun (Sorting) | All students ranked by weighted avg | A4:EO528 | 528 | 145 |
| 20 | מישחוק | Mishchuk (Gamification) | What-if projections with simulated scores | A5:CE172 | 172 | 83 |

### Sheet Relationships

- Class sheets (1-11, 13-16 + 12) feed individual student grades into the Sorting sheet (miyun) and Gamification sheet (mishchuk).
- Class sheets roll up class-level summary stats into the Rikuz (summary) sheet.
- The Rikuz sheet feeds into the Year-over-Year Comparison (hashvaa) sheet.
- Class 12 is placed out of order (sheet 17, after rikuz) and tracked separately throughout.

---

## 2. Column Structure

### Standard Class Sheet Column Layout (Reference: Class 1)

| Column | Hebrew Name | Data Type | Purpose |
|--------|------------|-----------|---------|
| A | (flags) | Text | Status flags: "לא בגרותי", "בסכנה לבגרות" |
| B | יחידות לימוד | Text | Math unit level (first number) |
| C | יחידות לימוד | Text | English unit level (second number) |
| D | מספר | Integer | Student number (color-coded by risk level) |
| E-F | שם | Text (merged) | Student full name (last name + first name) |
| G | מותאם | Boolean flag | Adapted exam accommodation |
| H | הכתבה | Boolean flag | Dictation accommodation |
| I | בע"פ | Boolean flag | Oral exam accommodation |
| J | ע"ח | Boolean flag | Special accommodations |
| K | ממוצע | Calculated decimal | Weighted average (green bg header) |

**Mathematics Block (Columns L-U) -- Per-Subject with Multi-Level:**

| Column | Content | Type |
|--------|---------|------|
| L | Math 182/183 (3 units) | Score |
| M | Math 381 (3 units) | Score |
| N | Math 382 (3 units) | Score |
| O | Math 481 (4 units) | Score |
| P | Math 482 (4 units) | Score |
| Q | Math 581 (5 units) | Score |
| R | Math 582 (5 units) | Score |
| S | Math Sofi 3 (סופי 3) | Calculated |
| T | Math Sofi 4 (סופי 4) | Calculated |
| U | Math Sofi 5 (סופי 5) | Calculated |

**Core Subjects Block (Columns V-AJ) -- Standard Internal/External/Final Pattern:**

| Columns | Subject | Internal | External | Final |
|---------|---------|----------|----------|-------|
| V-X | History (היסטוריה) | V (30%) | W (70%) | X |
| Y-AA | Civics (אזרחות) | Y (performance task 20%) | Z (exam 80%) | AA |
| AB-AD | Tanakh (תנ"ך) | AB (30%) | AC (70%) | AD |
| AE-AG | Literature (ספרות) | AE (30%) | AF (70%) | AG |
| AH-AJ | Language (לשון) | AH (30%) | AI (70%) | AJ |

**English Block (Columns AK-AW) -- Multi-Module:**

| Column | Content |
|--------|---------|
| AK | Module A (16381) |
| AL | Module B (16383) |
| AM | Module C (16382) |
| AN | Module D (16483) |
| AO | Module E (16471) |
| AP | Module F (16583) |
| AQ | Module G (16582) |
| AR | Oral 3 units (בע"פ 3 יח"ל) |
| AS | Oral 4 units (בע"פ 4 יח"ל) |
| AT | Oral 5 units (בע"פ 5 יח"ל) |
| AU | English Sofi 3 | Calculated |
| AV | English Sofi 4 | Calculated |
| AW | English Sofi 5 | Calculated |

**Non-Weighted Subjects (Columns AX-AZ):**

| Column | Content |
|--------|---------|
| AX | General Studies score 1 (השכלה כללית) |
| AY | General Studies score 2 |
| AZ | Introduction to Sciences (מבוא למדעים) |

**Elective Subjects Block (varies per class, Columns BA onward):**

| Columns | Subject | Components |
|---------|---------|------------|
| BA-BD | Computer Science (מדעי המחשב) | 899381, 899373, Sofi 5, 883589 |
| BE-BG | Jewish Law (חוק"ש תושב"ע) | 7383, 7281, Sofi 5 |
| BH-BL | Physics (פיזיקה) | 361, 376, 283, 371, Sofi 5 |
| BM-BO | Geography (גאוגרפיה) | 57381, 57238, Sofi 5 |
| BP-BR | Management/Economics (מנהל וכלכלה) | 839283, 381, Sofi 5 |
| BS-BU | Spanish (ספרדית) | 579385, 579283, Sofi 5 |
| BV | Mada"ch Final Project (מד"ח ע. גמר) | Single score |
| BW | Music Recital (מוזיקה רסיטל) | Single score |
| BX | Physical Education (חנ"ג) | 0-100 score |
| BY | Community Service (מעורבות חברתית) | Typically 3-4 |

### Column Grouping Pattern

Each graded subject follows one of these patterns:
- **Internal/External/Final** (3 columns): For standard 30/70 subjects (History, Tanakh, Literature, Language)
- **Performance Task/Exam/Final** (3 columns): For Civics (20/80)
- **Multi-Questionnaire + Sofi** (variable columns): For Math (7 score + 3 Sofi), English (7 modules + 3 oral + 3 Sofi)
- **Multi-Component + Sofi** (variable): For Physics (4 + 1), Social Sciences, etc.
- **Two-Component + Sofi** (3 columns): For Geography, Spanish, Jewish Law, etc.
- **Single Score** (1 column): For General Studies, PE, Community Service, Music Recital, Final Projects

### Global vs Per-Subject Columns

- **Global (per student):** A (flags), B-C (unit levels), D (number), E-F (name), G-J (accommodations), K (weighted average)
- **Per-subject:** All remaining columns from L onward, grouped by subject

### Class 12 Column Differences

| Feature | Regular Classes | Class 12 |
|---------|----------------|----------|
| Student name | Column E-F | Column C-D (merged C9:D10) |
| Student number | Column D | Column B |
| Total columns | 86-117 | 84 |
| Unique subject | (varies) | Communications (תקשורת) in AX-BA area |
| English Module E code | 16471 | 16481 |

---

## 3. Row Types

### Header Rows (Rows 1-10)

| Row | Content | Purpose |
|-----|---------|---------|
| 1 | "צפי" (Tzafi) label | Risk level system title |
| 2 | Class name + academic year (e.g., "כיתה יב 1 - תשפ"ה") | Class identification; risk level legend starts (R2-X2 area) |
| 3 | Homeroom teacher name (מחנכ/ת) | Teacher identification; risk levels legend continued |
| 4-6 | Subject abbreviation legend (English, Math, Hebrew Language) | Score threshold markers and color legend |
| 7 | School contact info (sheifa10@walla.com, www.sheifa.co.il, 050-5343804, fax 08-9457692) + "מוגברים" (Enhanced) section header | School metadata + enhanced subject weights header |
| 8 | Internal/external weight percentages per subject | Formula weight reference (e.g., "30% / 70%") |
| 9-10 | Subject headers with exam questionnaire codes (שאלונים) | Column header labels for data entry |

### Student Data Rows (Rows 11-~42)

- One row per student (16-40 students per class)
- Contains all score data, accommodation flags, unit levels, weighted average
- Color-coded by risk level (background on student number cell)
- Row count varies: smallest class has 13 students (class 12), largest has 40 (class 3)

### Class Average Row (Row ~43)

- Formula: `=AVERAGE(K11:K42)` for each grade column
- Font color: `FF92D050` (green) for class average values
- Provides mean score per subject/component for the class

### Student Count Row (Row ~44)

- Formula: `=COUNT(S11:S42)` for each grade column
- Shows how many students have scores in each column

### Failing Count Rows (Rows ~45-49)

- Count of students scoring below passing (55) in each exam period
- Multiple rows for different exam period snapshots

### Status Summary Sections (Rows ~53-91)

- Four time-period snapshots with eligibility breakdown
- Each snapshot block contains:
  - Category labels (no missing exams, 1 missing, 2 missing, 3 missing, 4 missing, more than 4)
  - Count per category
  - Percentage per category
  - Cumulative percentages
  - Total row with `=SUM()` formula

### Student-by-Student Tracking Grid (Rows ~99-131)

- Three sets of columns, one per historical time period
- Each set has: student number (color-coded bg), student name, notes column
- Color coding: green = on track, yellow = at risk, red = failing/non-matric
- Allows longitudinal trajectory viewing per student

---

## 4. Subjects

### Core/Mandatory Subjects (7 subjects in weighted average)

| # | Hebrew Name | English | Unit Levels | Questionnaire Codes | Weight Pattern |
|---|-----------|---------|-------------|---------------------|----------------|
| 1 | מתמטיקה | Mathematics | 3, 4, 5 | 182/183, 381, 382, 481, 482, 581, 582 | Multi-level weighted (see formulas) |
| 2 | היסטוריה | History | 2 | Internal + External | 30% / 70% |
| 3 | אזרחות | Civics | 2 | מטלת ביצוע + מבחן | 20% / 80% |
| 4 | תנ"ך | Tanakh (Bible) | 2 | Internal + External | 30% / 70% |
| 5 | ספרות | Literature | 2 | Internal + External | 30% / 70% |
| 6 | לשון | Hebrew Language | 2 | Internal + External | 30% / 70% |
| 7 | אנגלית | English | 3, 4, 5 | Modules A-G + Oral (7 written + 3 oral) | Multi-module weighted (see formulas) |

### Non-Weighted Required Subjects (4 subjects)

| # | Hebrew Name | English | Notes |
|---|-----------|---------|-------|
| 8 | השכלה כללית | General Studies | Single/dual score columns |
| 9 | מבוא למדעים | Introduction to Sciences | Single score column |
| 10 | חנ"ג | Physical Education | 0-100 score |
| 11 | מעורבות חברתית | Community Service | Score typically 1-4, hours-based |

### Elective/Major Subjects (מגמות) -- 20+ subjects

| # | Hebrew Name | English | Exam Codes | Found in Classes | Weight Pattern |
|---|-----------|---------|------------|-----------------|----------------|
| 12 | מדעי המחשב | Computer Science | 899381, 899373/899371/899271, 883589 | Multiple | 70%/30% (or 76%/24% variant) |
| 13 | פיזיקה | Physics | 361, 376, 283, 371 | Multiple | 30%/15%/30%/25% |
| 14 | כימיה | Chemistry | Varies | 2, 5, 7, 8, 9, 10, 11, 13, 15 | Standard |
| 15 | ביולוגיה | Biology | Multiple + ע. גמר (final project) | 2, 5, 6, 7, 8, 9, 13, 14, 15 | Standard + project |
| 16 | גאוגרפיה | Geography | 57381, 57238 | 1, others | 60%/40% |
| 17 | מנהל וכלכלה | Management and Economics | 839283, 381 | Multiple | 30%/70% |
| 18 | מדעי החברה | Social Sciences | 281, 283, 273, 189 | 4, 7, 8, 13, 14 | Multi-component |
| 19 | חוק"ש תושב"ע | Jewish Law / Oral Torah | 7383, 7281 | Multiple | 50%/50% |
| 20 | ספרדית | Spanish | 579385, 579283 | 1, others | 60%/40% |
| 21 | ערבית | Arabic | Multiple codes | 5, 6, 7, 8, 9, 13, 14, 15, 16 | Standard |
| 22 | איטלקית | Italian | Varies | 15 | Standard |
| 23 | צרפתית | French | Varies | 5, 6, 13 | Standard |
| 24 | סינית | Chinese | Varies | 8, 11 | Standard |
| 25 | פילוסופיה | Philosophy | Varies | 8 | Standard |
| 26 | קולנוע | Film/Cinema | 61387, 61283 | 2, others | Standard |
| 27 | מדעי הרפואה | Medical Sciences | 802381, 802283 | 2, others | Standard |
| 28 | תנ"ך מורחב | Extended Bible Studies | Varies | 2, 5, 7, 10, 11, 13, 14 | Standard |
| 29 | תקשורת | Communications | 56387, 56283 | 12 only | 50%/50% |
| 30 | מד"ח ע. גמר | Mada"ch Final Project | Single score | Various | N/A |
| 31 | מוזיקה רסיטל | Music Recital | Single score | 1, others | N/A |
| 32 | מוזיקה | Music | Multiple codes | 10, others | Standard |
| 33 | מחול | Dance | Multiple codes | 10 | Standard |
| 34 | תאטרון | Theater | Multiple codes | 11 | Standard |
| 35 | ביולוגיה ע. גמר | Biology Final Project | Single score | Various | N/A |

### English Module Structure (Most Complex Subject)

| Module | Exam Code | Unit Level | Weight in Sofi |
|--------|-----------|-----------|----------------|
| A | 16381 | 3 יח"ל | 0.27 in Sofi 3 |
| B | 16383 | 3 יח"ל | 0.26 in Sofi 3 |
| C | 16382 | 3 יח"ל | 0.27 in Sofi 3 |
| D | 16483 | 4 יח"ל | 0.27 in Sofi 4 |
| E | 16471 (regular) / 16481 (class 12) | 4 יח"ל | 0.27 in Sofi 5 |
| F | 16583 | 5 יח"ל | 0.26 in Sofi 5 |
| G | 16582 | 5 יח"ל | 0.27 in Sofi 5 |
| Oral 3 | בע"פ 3 יח"ל | 3 יח"ל | 0.20 in Sofi 3 |
| Oral 4 | בע"פ 4 יח"ל | 4 יח"ל | 0.20 in Sofi 4 |
| Oral 5 | בע"פ 5 יח"ל | 5 יח"ל | 0.20 in Sofi 5 |

### Mathematics Questionnaire Progression

| Code | Unit Level | Weight in Sofi |
|------|-----------|----------------|
| 182/183 | 3 יח"ל | 0.25 in Sofi 3 |
| 381 | 3 יח"ל | 0.35 in Sofi 3 |
| 382 | 3 יח"ל | 0.40 in Sofi 3 |
| 481 | 4 יח"ל | 0.65 in Sofi 4 |
| 482 | 4 יח"ל | 0.35 in Sofi 4 |
| 581 | 5 יח"ל | 0.60 in Sofi 5 |
| 582 | 5 יח"ל | 0.40 in Sofi 5 |

---

## 5. Color Coding

### Background Colors (15 distinct colors)

| # | Hex Code | Visual Description | Semantic Meaning | Where Used |
|---|----------|-------------------|-----------------|-----------|
| 1 | `FFC2D69B` | Light green | On track / passing / eligible; Risk level 1 bg | Student number column (D), tracking grid cells |
| 2 | `FFFFFF00` | Yellow | At risk / needs attention | Student rows, tracking grid, "3 exams missing" label, challenging students |
| 3 | `FFD99594` | Pink/salmon | High risk / 4+ corrections needed | "4 exams missing" and "more than 4" labels, rikuz "5+ failing" rows |
| 4 | `FFFF0000` | Bright red | Non-matriculation student (לא בגרותי) | Column A flag background |
| 5 | `FF92D050` | Bright green | Internal exam subject marker (פנימי) | Subject headers for internal components (History, Civics, Literature), "ממוצע" column header |
| 6 | `FFEF31CF` | Magenta/hot pink | External exam subject marker (חיצוני) | Subject headers (Tanakh specifically) |
| 7 | `FF00B0F0` | Cyan / light blue | Score at threshold (54) -- barely passing | English Sofi 3 cells with value around 54 |
| 8 | `FF8DB3E2` | Sky blue / lighter blue | Score borderline (52-53) -- near failing | Score cells in the 52-53 range |
| 9 | `FFFFC000` | Amber/gold/orange | Risk level 3 background (סיכון גבוה / High risk) | Risk legend (W4 area), student risk indicators |
| 10 | `FFFBD4B4` | Peach/light salmon | Risk level 5 background (סיכון גבוה למצויינות 1 ג) | Risk legend (W6 area), student risk indicators |
| 11 | `FF548DD4` | Medium blue | Exam period row marker / section divider | Time period section headers in class sheets |
| 12 | `FFB2A1C7` | Purple/lavender | Exam period row marker / section divider | Time period section dividers |
| 13 | `FFC4BD97` | Tan/khaki | Exam period row marker / section divider | Time period section dividers |
| 14 | `FFC6D9F0` | Pale blue/ice blue | Exam period row marker / section divider | Time period section dividers |
| 15 | `FFF2DBDB` | Very light pink/blush | Below-average weighted average | Column K (weighted average) for students with lower scores |

### Font Colors (5 distinct colors)

| # | Hex Code | Visual Description | Semantic Meaning | Where Used |
|---|----------|-------------------|-----------------|-----------|
| 1 | `FFFF0000` | Red | Failing grades (below 55) | Individual exam scores; risk level 4 and 5 text |
| 2 | `FF548DD4` | Blue | Excellence indicator (scores above 90) | High-scoring cells in legend and data |
| 3 | `FF92D050` | Green | Class average values | Row 43 average formulas, final subject score averages |
| 4 | `FFE36C09` | Orange | Risk level 2 indicator; cumulative percentage markers | Risk legend (W3), rikuz cumulative percentages |
| 5 | `FF993366` | Dark magenta/mauve | School contact information text | Row 7 contact info across class sheets |

### Conditional Color Rules (Score-Based)

| Score Range | Background Treatment | Font Treatment |
|------------|---------------------|----------------|
| Below 52 | Default | Red font (`FFFF0000`) -- failing |
| 52-53 | Light blue bg (`FF8DB3E2`) | Red font (`FFFF0000`) -- borderline failing |
| 54 | Cyan bg (`FF00B0F0`) | Red font (`FFFF0000`) -- barely below threshold |
| 55 and above | Default | Default -- passing |
| 90 and above | Default | Blue font (`FF548DD4`) -- excellence indicator |

### Color Legend Location in Each Class Sheet

Embedded in header area (approximately cells R2-X6 and AB5-AH4):

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

## 6. Formulas & Calculations

### 6.1 Mathematics Final Scores (Sofi)

**Sofi 3 (3-unit level):**
```
=N{row}*0.4 + M{row}*0.35 + L{row}*0.25
```
Where L=182/183, M=381, N=382

**Sofi 4 (4-unit level):**
```
=O{row}*0.65 + P{row}*0.35
```
Where O=481, P=482

**Sofi 5 (5-unit level):**
```
=Q{row}*0.6 + R{row}*0.4
```
Where Q=581, R=582

### 6.2 Standard 30/70 Subject Finals

**History:**
```
=W{row}*0.7 + V{row}*0.3
```

**Tanakh:**
```
=AC{row}*0.7 + AB{row}*0.3
```

**Literature:**
```
=AF{row}*0.7 + AE{row}*0.3
```

**Hebrew Language:**
```
=AI{row}*0.7 + AH{row}*0.3
```

### 6.3 Civics Final (Special 80/20)

```
=Z{row}*0.8 + Y{row}*0.2
```
Where Y=performance task (מטלת ביצוע), Z=exam (מבחן)

### 6.4 English Final Scores (Sofi)

**Sofi 3 (3-unit level):**
```
=AT{row}*0.2 + AM{row}*0.27 + AL{row}*0.26 + AK{row}*0.27
```
Where AK=Module A, AL=Module B, AM=Module C, AT=Oral 3

**Sofi 4 (4-unit level) -- Class 12 variant:**
```
=AP{row}*0.2 + AL{row}*0.27 + AK{row}*0.26 + AJ{row}*0.27
```

**Sofi 5 (5-unit level):**
```
=AT{row}*0.2 + AQ{row}*0.27 + AP{row}*0.26 + AO{row}*0.27
```
Where AO=Module E, AP=Module F, AQ=Module G, AT=Oral 5

### 6.5 Elective Subject Finals

**Computer Science:** `=BB{row}*0.3 + BA{row}*0.7` (or 24%/76% variant)

**Physics:** `=BK{row}*0.25 + BJ{row}*0.3 + BI{row}*0.15 + BH{row}*0.3`
Where BH=361, BI=376, BJ=283, BK=371

**Jewish Law:** `=BF{row}*0.5 + BE{row}*0.5`

**Geography:** `=BN{row}*0.4 + BM{row}*0.6`

**Management/Economics:** `=BQ{row}*0.7 + BP{row}*0.3`

**Spanish:** `=BT{row}*0.4 + BS{row}*0.6`

**Communications (Class 12 only):** `=AY{row}*0.5 + AX{row}*0.5`

### 6.6 Weighted Average (ממוצע משוקלל)

**For 5-unit Math + 5-unit English (most common):**
```
=(U{row}*5 + X{row}*2 + AA{row}*2 + AD{row}*2 + AG{row}*2 + AJ{row}*2 + AW{row}*5) / 20
```

**For 4-unit Math + 4-unit English:**
```
=(T{row}*4 + X{row}*2 + AA{row}*2 + AD{row}*2 + AG{row}*2 + AJ{row}*2 + AV{row}*4) / 18
```

**Demo note:** The demo uses a **variable denominator** that skips subjects the student has not yet been graded on. If a core subject's final score is missing or zero, its units are excluded from both the numerator and denominator. This matches the gamification sheet's approach (section 6.8) rather than the standard class sheet formula above, which always includes all 7 core subjects in the denominator.

**General rule:** Denominator = MathUnits + 2+2+2+2+2 + EnglishUnits

| Math Level | English Level | Denominator |
|-----------|--------------|-------------|
| 5 | 5 | 20 |
| 5 | 4 | 19 |
| 5 | 3 | 18 |
| 4 | 4 | 18 |
| 4 | 3 | 17 |
| 3 | 5 | 18 |
| 3 | 4 | 17 |
| 3 | 3 | 16 |

### 6.7 Aggregation Formulas

**Class Average:** `=AVERAGE(K11:K42)` (per grade column)

**Student Count:** `=COUNT(S11:S42)` (per grade column)

**Rikuz Category Total:** `=SUM(G7:U7)` (sum across all classes for a category)

**Rikuz Percentage:** `=V7/V13` (category count / total students)

**Rikuz Cumulative:**
```
W7 = V7/V13                 (% no missing exams)
X7 = W7 + W8                (cumulative: 0 or 1 missing)
Y7 = X7 + W9                (cumulative: 0, 1, or 2 missing)
Z7 = Y7 + W10               (cumulative: 0-3 missing)
```

**Year-over-Year Rates:** `=E7/E6` (eligible / total)

### 6.8 Gamification-Specific Formulas

**Projected score:**
```
=O{row}-5     (highest score minus 5 as conservative projection)
```

**Variable-denominator average:**
```
=(AU*5 + AH*2 + AE*2 + AB*2 + Y*2 + V*2 + S*5) / AV
```
Where AV = "מתוך יחידות" (dynamically calculated unit total per student)

**Overall average including elective:**
```
=(AU*5 + AH*2 + AE*2 + AB*2 + Y*2 + V*2 + S*5 + BB*5) / (AV+5)
```

### 6.9 Eligibility Determination Logic

**Passing threshold:** 55 (standard Bagrut passing grade)

**Eligibility requires:**
1. Pass (55+) all 7 mandatory core subjects (Math, History, Civics, Tanakh, Literature, Language, English)
2. Complete PE, Community Service, General Studies, Intro to Sciences
3. At least one 5-unit elective passed

**"Full Bagrut despite missing exam"** -- Ministry policy allows eligibility when one non-core subject exam is incomplete

### 6.10 Risk Level Assignment Logic (Tzafi)

| Level | Hebrew | Condition |
|-------|--------|-----------|
| 1 (סיכוי גבוה) | High chance | 0 failing/missing exams, weighted avg >= 85 |
| 2 (סיכון) | Risk | 0-1 failing, weighted avg < 85 |
| 3 (סיכון גבוה) | High risk | 2+ failing/missing exams |
| 4 (סיכון מצויינות 1 ב) | Risk to Excellence 1-Bet | 0-1 failing, weighted avg 86-89 (near 90 threshold) |
| 5 (סיכון גבוה למצויינות 1 ג) | Risk to Excellence 1-Gimel | 0-1 failing, weighted avg 81-84 (near 85 threshold) |

**Demo note:** The demo consolidates the 5 risk levels into 3: Level 1 (on track), Level 2 (risk, 1 failure), Level 3 (high risk, 2+ failures). Spreadsheet levels 4 and 5, which tracked proximity to excellence thresholds, are not represented as risk levels in the demo -- instead, that concern is handled by the excellence tier system (see section 6.11).

Primarily manually assigned by coordinator, based on:
- Number of missing/failing exams
- Proximity to passing thresholds (52-54 range)
- Historical trajectory across exam periods
- For levels 4-5, proximity to excellence thresholds

### 6.11 Excellence Tiers (Metzuyanut)

| Tier | Hebrew | Threshold |
|------|--------|-----------|
| Metzuyanut 1-Aleph | מצויינות 1 א | Weighted average >= 96 |
| Metzuyanut 1-Bet | מצויינות 1 ב | Weighted average >= 90 |
| Metzuyanut 1-Gimel | מצויינות 1 ג | Weighted average >= 85 |

**Demo note:** The demo adds two "border" tiers not present in the spreadsheet: `BORDER_BET` (weighted avg 86-89, within Gimel but close to the Bet threshold) and `BORDER_GIMEL` (weighted avg 81-84, close to the Gimel threshold). These map to the spreadsheet's risk levels 4 and 5 respectively -- the spreadsheet tracked these students via the risk system, while the demo tracks them via the excellence tier system instead. Full demo tier breakdown: ALEPH (96+), BET (90-95), BORDER_BET (86-89), GIMEL (85), BORDER_GIMEL (81-84), NONE (below 81).

### 6.12 Special Values in Score Cells

| Value | Hebrew | Meaning | Formula Impact |
|-------|--------|---------|---------------|
| חסם | chasam | Barrier -- student blocked from exam | Causes #VALUE! errors in formulas |
| עיכוב | ikuv | Delay -- score pending | Excluded from calculations |
| (blank) | empty | Exam not yet taken | Excluded from calculations |

---

## 7. Summary Statistics (Rikuz)

### Sheet Structure (B4:AN176)

The rikuz sheet contains 6 major sections, one per exam period snapshot, plus challenging students subsections.

### Section 1: After Summer 2023 (Rows 4-18) -- "לאחר קיץ תשפ"ג"

**Row headers:** Classes labeled as "יא" (11th grade, since that was their grade at the time)
**Categories tracked (exam-missing based):**
- לא חסרות בחינות (No missing exams)
- צריך להשלים בחינה אחת (Need to complete one exam)
- חסרות 2 בחינות (Missing 2 exams)
- חסרות 3 בחינות (Missing 3 exams) [Yellow bg]
- חסרות 4 בחינות (Missing 4 exams) [Pink bg]
- חסרות יותר מ 4 בחינות (Missing more than 4 exams) [Pink bg]

**Actual data:**
- 331 students (66.7%) with no missing exams
- 443 (89.3%) with 0-1 missing (cumulative)
- 470 (94.8%) with 0-2 missing
- 484 (97.6%) with 0-3 missing
- Total: 496 regular + 13 Class 12 = 509

### Section 2: Report Card Grades Semester 1 (Rows 21-36) -- "ציוני תעודה מחצית א"

**Categories tracked (failure-count based):**
- ללא נכשלים (No failures)
- נכשל 1 או חסרה בחינה (1 failure or missing exam)
- 2 נכשלים (2 failures)
- 3 נכשלים (3 failures)
- 4 נכשלים (4 failures)
- 5 ויותר נכשלים (5+ failures) [Pink bg]

**Actual data:**
- 182 students (36%) with no failures
- 340 (67.3%) with 0-1 failures (cumulative)
- 403 (79.8%) with 0-2
- 449 (88.9%) with 0-3

### Section 3: After Summer 2024 (Rows 38-66) -- "לאחר קיץ תשפ"ד"

Same failure-count structure as Section 2. Uses "יב" (12th grade) labels. Includes challenging students subsection.

### Section 4: After Winter 2025 (Rows 70-97) -- "לאחר חורף תשפ"ה"

Same failure-count structure. Includes challenging students subsection.

### Section 5: After Winter 2025 + Corrections (Rows 99-135) -- "לאחר חורף תשפ"ה + תיקונים והשלמות"

Same failure-count structure. Includes challenging students subsection.

### Section 6: After Summer 2025 / Projected (Rows 138-176) -- "לאחר קיץ תשפ"ה"

**Categories (exam-missing based, final):**
- לא חסרות בחינות (No missing exams)
- בגרות מלאה למרות מקצוע חסר (Full Bagrut despite missing subject)
- צריך להשלים בחינה אחת (Need to complete one exam)
- חסרות 2 בחינות (Missing 2 exams)
- חסרות 3 בחינות (Missing 3 exams) [Yellow bg]
- שלושה שאלונים לתיקון / השלמה (3 questionnaires to correct)
- ארבעה שאלונים לתיקון / השלמה (4 questionnaires)

**Projected final data:**
- 455 students (90.5%) with no missing exams
- 465 (92.4%) with full Bagrut (including "despite missing subject")
- 486 (96.6%) cumulative through one additional exam needed
- Total: 503 students

### Cumulative Percentage Calculation Pattern

For each section:
```
Column W: Raw percentage per category (count / total)
Column X: Cumulative through 2nd category [Bold]
Column Y: Cumulative through 3rd category [Orange font]
Column Z: Cumulative through 4th category [Orange font]
```

Same pattern repeated with Class 12 included (columns AD-AH).

### Class 12 Separation in Rikuz

- Column AC: Class 12 data (tracked separately throughout)
- Column AD: Combined total (regular classes + class 12)
- Columns G-U: Individual regular class columns
- Column V: Regular class total

### Three Categorization Schemes Used

| Scheme | When Used | Categories |
|--------|-----------|-----------|
| Exam-missing | After summer periods, final projection | 0 missing, 1 missing, 2 missing, 3 missing, 4 missing, 4+ missing |
| Failure-count | Mid-year snapshots (semester grades, post-winter) | 0 failures, 1 failure, 2 failures, 3 failures, 4 failures, 5+ failures |
| Questionnaire-based | Correction-focused views | 0 questionnaires to correct, 1, 2, 3, 4, many |

### Challenging Students Subsections (within Rikuz)

Located at approximately rows 50-60, 80-92, 120-135 (one per exam period section).

**Header:** "מאתגרים במיוחד (לבדוק אפשרות לשיחה עם שרית)" [Red font]
"Especially challenging (check possibility for conversation with Sarit)"

**Three-column layout:**

| Column K | Column P | Column T |
|----------|----------|----------|
| מאתגרים במיוחד (Especially challenging) | יעברו כנראה (Will probably pass) | לטיפול צמוד של שירה ומחנכי הכיתה (Close follow-up by Shira and homeroom teachers) |

**Sample entries:**
- בן ארי רם אשר -- Especially challenging -- "ניגש ללשון" (Taking Language exam)
- פינקלקראוט בר שלמה -- Especially challenging -- "ניגש לתנ"ך בחורף + משלים עכשיו היסטוריה"
- גבע ליאת -- Especially challenging -- "לא מתפקדת" (Not functioning)
- בצלאל עידו -- Will probably pass -- [Yellow bg]
- המר רומי -- Close follow-up -- "שיפור" (Improvement)
- לוי-קופלמן יותם -- Close follow-up -- "לא מתפקד - עוד שיחה אצל הילה"

---

## 8. Year-over-Year Comparison (Hashvaa)

### Sheet Structure (C3:P23)

Header: "תעודת בגרות איכותית (לא כולל ח"מ)" -- Quality Bagrut Certificate (not including special education)

### Years Tracked

| Column | Hebrew Year | Gregorian |
|--------|-----------|-----------|
| E | תשפ"ב | 2021-2022 |
| F | תשפ"ג | 2022-2023 |
| G | תשפ"ד | 2023-2024 |
| H | תשפ"ה | 2024-2025 |

### Metrics with Actual Values

| Metric (Hebrew) | Metric (English) | תשפ"ב | תשפ"ג | תשפ"ד | תשפ"ה |
|-----------------|------------------|--------|--------|--------|--------|
| מספר התלמידים בשכבה | Total students | 582 | 532 | 532 | 503 |
| מספר התלמידים עם זכאות מלאה | Full Bagrut eligible | 562 | 515 | 515 | 465 |
| אחוז עם זכאות מלאה | Eligibility rate | 96.6% | 96.8% | 96.8% | 92.4% |
| תלמידים שסיימו 4 יח"ל באנגלית | English 4-unit count | 63 | 66 | 62 | 56 |
| אחוז מכלל השכבה (4 יח"ל אנגלית) | English 4-unit % | 10.8% | 12.4% | 11.7% | 11.1% |
| תלמידים שסיימו 5 יח"ל באנגלית | English 5-unit count | 499 | 456 | 450 | 414 |
| אחוז מכלל השכבה (5 יח"ל אנגלית) | English 5-unit % | 85.7% | 85.7% | 84.6% | 82.3% |
| תלמידים שסיימו 4 יח"ל במתמטיקה | Math 4-unit count | 183 | 164 | 174 | 147 |
| אחוז מכלל השכבה (4 יח"ל מתמטיקה) | Math 4-unit % | 31.4% | 30.8% | 32.7% | 29.2% |
| תלמידים שסיימו 5 יח"ל במתמטיקה | Math 5-unit count | 242 | 191 | 197 | 170 |
| אחוז מכלל השכבה (5 יח"ל מתמטיקה) | Math 5-unit % | 41.6% | 35.9% | 37.0% | 33.8% |
| תלמידים שסיימו כמצטיינים | Honors students count | 255 | 197 | 196 | 174 |
| אחוז מכלל השכבה (מצטיינים) | Honors % | 43.8% | 37.0% | 36.8% | 34.6% |

---

## 9. Sorting/Ranking Sheet (Miyun)

### Structure (A4:EO528, 528 rows, 145 columns)

Largest sheet in the workbook. Contains ALL students across all classes, sorted by weighted average descending.

### Column Layout

**Identifying columns:**
- A: Class identifier (e.g., "יב 1")
- B: Student number within class
- C-D: Unknown / may be blank
- E-F: Student name (merged)
- G: Adapted exam (מותאם)
- H: Dictation (הכתבה)
- I: Oral exam (בע"פ)
- J: Special accommodations (ע"ח)

**Core subjects (K-AV):** Same order as class sheets (Math, History, Civics, Tanakh, Literature, Language, English)

**Extended elective subjects (AW-EL):**
- AW-AX: General Studies
- AY: Intro to Sciences
- AZ-BE: Computer Science
- BF-BH: Geography
- BI-BK: Italian
- BL-BO: Biology
- BP-BS: Chemistry
- BT-BX: Physics
- BY-CA: Management/Economics
- CB-CK: Social Sciences
- CL-CO: Arabic
- CP-CS: Physical Education
- CT-CV: Spanish
- CW-CY: Jewish Law
- CZ-DB: Film/Cinema
- DC-DF: Medical Sciences
- DG-DJ: Arabic (second variant)
- DK-DM: French
- DN-DP: Chinese
- DQ-DS: Philosophy
- DT: Mada"ch Final Project
- DU: Music Recital
- DV: Biology Final Project
- DW-DZ: Dance
- EA-ED: Music
- EE-EG: Theater
- EH-EJ: Extended Bible Studies
- EK: Physical Education (duplicate)
- EL: Community Service

---

## 10. Gamification Sheet (Mishchuk)

### Structure (A5:CE172, 172 rows, 83 columns)

Mirrors sorting sheet but with projected/simulated scores for pending exams.

### Key Columns

- Column A: Class identifier (e.g., "יב 1", "יב 5")
- Column B: Student number (green bg for passing students)
- Column AV: "מתוך יחידות" (Out of units) -- variable denominator per student
- Column AW: "ממוצע" (Average) -- weighted average using variable denominator
- Column AY: "ממוצע כולל" (Overall average) -- includes elective subjects

### Projection Method

Projects scores for unfinished exams using: student's best actual score minus 5 points (`=O7-5`).

### Subjects Tracked

All core subjects plus: Computer Science, Jewish Law, Physics, Social Sciences, PE, Medical Sciences, Geography, Management/Economics, Film/Cinema.

### Differences from Sorting Sheet

| Feature | Sorting (מיון) | Gamification (מישחוק) |
|---------|---------------|----------------------|
| Scores | Actual only | Includes projected "gamified" scores |
| Average formula | Fixed denominator | Variable denominator (מתוך יחידות) |
| Elective inclusion | Listed separately | "Overall average" includes electives |
| Student count | ~528 rows | ~172 rows (subset) |
| Purpose | Rank by actual performance | Planning/motivation tool |

---

## 11. Special Features

### 11.1 Accommodation Flags (התאמות)

Four boolean flags per student (columns G-J):

| Flag | Hebrew | Meaning |
|------|--------|---------|
| מותאם | Adapted | Modified exam version |
| הכתבה | Dictation | Someone reads/writes for student |
| בע"פ | Oral | Oral exam instead of written |
| ע"ח | Special | Other special accommodations |

### 11.2 Notes/Comments

- **Column A flags:** "לא בגרותי/ת" (non-matriculation, feminine/masculine), "בסכנה לבגרות" (at risk for Bagrut)
- **Tracking grid notes column:** Free-text annotations per student per time period (e.g., "ניגש ללשון", "לא מתפקד/ת", "שיפור")
- **Challenging students notes:** Action items and status (e.g., "לשיחה עם שרית", "בבדיקה לגבי 30% היסטוריה")

### 11.3 Class-Level Information

- **Class name + year:** Row 2 (e.g., "כיתה יב 1 - תשפ"ה")
- **Homeroom teacher (מחנכ/ת):** Row 3 (e.g., "דוד שרוני" for class 1, "ספי ברוך" for class 12)
- **School contact:** Row 7 (sheifa10@walla.com, www.sheifa.co.il, 050-5343804, fax 08-9457692) in dark magenta font

### 11.4 Student Numbering

- **Column D (regular classes) / Column B (class 12):** Sequential student number within the class
- **Color-coded by risk level:** The student number cell background carries the risk level color

### 11.5 Unit Level Display

- **Columns B-C:** Display format like "5  5" or "5  3" or "4  3"
- First number = Math unit level (3/4/5)
- Second number = English unit level (3/4/5)
- Common combinations: "5 5", "5 3", "5 4", "4 3", "4 4"

### 11.6 Excellence Tracking

- Risk levels 4 and 5 specifically track students at risk of missing excellence tiers
- Honors students counted in year-over-year comparison (255 -> 197 -> 196 -> 174)
- Blue font (`FF548DD4`) applied to scores above 90

### 11.7 Non-Matriculation Student Tracking

Students flagged with bright red (`FFFF0000`) background in Column A with text "לא בגרותי" or "לא בגרותית":
- Class 1: 1 student
- Class 2: 2 students
- Class 4: 1 student
- Class 5: 2 students
- Class 6: 1 student
- Class 8: 1 student
- Class 10: 1 student
- Class 11: 1 student
- Class 13: 2 students
- Class 15: 1 student
- Others as applicable

### 11.8 At-Risk Annotations

Students with "בסכנה לבגרות" in Column A:
- Highlighted with yellow background
- Receive action items in challenging students section
- Closely monitored across exam periods

### 11.9 Staff References

| Name | Hebrew | Role | Context |
|------|--------|------|---------|
| Sarit | שרית | Bagrut coordinator / VP Academics | Primary user; challenging students flagged for her attention |
| Shira | שירה | Counselor or VP | Assigned close follow-up of challenging students |
| Hila | הילה | Principal or counselor | Escalation point for non-functioning students |
| David Shroni | דוד שרוני | Homeroom teacher | Class 1 |
| Safi Baruch | ספי ברוך | Homeroom teacher | Class 12 |

### 11.10 Time Period Tracking (5 Exam Period Snapshots)

| # | Hebrew | English | Calendar Period |
|---|--------|---------|----------------|
| 1 | לאחר קיץ תשפ"ג | After summer 2023 | ~Aug 2023 |
| 2 | לאחר קיץ תשפ"ד | After summer 2024 | ~Aug 2024 |
| 3 | לאחר חורף תשפ"ה | After winter 2025 | ~Feb 2025 |
| 4 | לאחר חורף תשפ"ה + תיקונים והשלמות | After winter 2025 + corrections | ~Mar 2025 |
| 5 | לאחר קיץ תשפ"ה / לאחר מועד קיץ תשפ"ה | After summer 2025 (projected) | ~Jul 2025 |

### 11.11 Enhanced Subjects Weight Table (מוגברים)

Found in row 8, showing internal/external weights for 5-unit elective subjects:

| Subject | Weights |
|---------|---------|
| Computer Science | 76% / 24% (also has 100% single component) |
| Jewish Law | 50% / 50% |
| Physics | 30% / 15% / 30% / 25% |
| Geography | 60% / 40% |
| Management/Economics | 30% / 70% |
| Spanish | 60% / 40% |

### 11.12 Class Sizes

| Class | Students | Notes |
|-------|----------|-------|
| יב 1 | 32 | Standard |
| יב 2 | 35 | Largest variety of subjects |
| יב 3 | 40 | Largest class |
| יב 4 | 31 | |
| יב 5 | 33 | |
| יב 6 | 30 | |
| יב 7 | 39 | |
| יב 8 | 36 | |
| יב 9 | 35 | |
| יב 10 | 23 | Smallest regular class |
| יב 11 | 31 | |
| יב 13 | 39 | |
| יב 14 | 38 | |
| יב 15 | 38 | |
| יב 16 | 16 | Second smallest regular |
| יב 12 | 13 | Special class |
| **Total** | **~509** | |

### 11.13 Arabic Major Designation

Some classes (particularly 15, 16) have students with "מגמת ערבית" (Arabic major) designation, indicating a specific educational track.

### 11.14 "Chasam" Error Handling

Class 12 contains "חסם" (barrier) text entries in score cells (e.g., K13, K17) that cause `#VALUE!` formula errors because the formula expects numeric input:
```
P13 = #VALUE!   (because K13 contains text "חסם" instead of a number)
```

### 11.15 Class 12 Special Characteristics

- 13 students (smallest class)
- Different column structure (name in C, number in B)
- Unique subject: Communications (תקשורת)
- Many more empty/missing score cells than regular classes
- Placed out of order in workbook (sheet 17, after rikuz)
- Tracked separately in rikuz (column AC)
- Excluded from quality metrics in year-over-year comparison (ח"מ = חינוך מיוחד / special education)
- English Module E uses code 16481 instead of 16471
