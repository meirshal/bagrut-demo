# Questions for Sarit -- Bagrut Tracking System

**Prepared:** 2026-03-05
**Context:** These questions arise from analyzing the `sarit-example.xlsx` workbook used by Sheifa School to track ~503 students' Bagrut progress. They are organized by criticality for building a replacement digital product.

**Total questions: 62**

---

## Section 1: Critical Questions (Must-Answer Before Building)

These questions fundamentally affect how we architect the system. We cannot proceed to build without clear answers.

---

### 1.1 Student Count Discrepancy

The data contains three different total student counts:
- **496** students in the rikuz sheet (regular classes only, excluding class 12)
- **509** students in the rikuz sheet (including class 12's 13 students: 496 + 13)
- **503** students in the comparison sheet (hashvaa)

**Q1:** Why is the comparison sheet total (503) different from the rikuz total (509)? Does the comparison sheet exclude some students beyond just class 12? Are the 6 missing students the "non-matriculation" (la begrutim) students, or students who left mid-year (like the student who "left abroad in January 2024" or the student who "left Blich in 11th grade")?

**Q2:** When calculating school-wide eligibility rates, which denominator is the "official" one reported to the Ministry of Education? Is it 503, 509, or some other number?

---

### 1.2 "Ch"M" (ח"מ) Exclusion

The year-over-year comparison sheet header reads "Quality Bagrut Certificate (not including Ch"M)" -- "teudat bagrut eichoatit (lo colel ch"m)".

**Q3:** What does the abbreviation "ch"m" (ח"מ) stand for? Our best guess is "chinuch meyuchad" (special education) -- meaning class 12. Is that correct? If so, does this mean class 12 students are excluded from all official quality metrics reported externally?

---

### 1.3 Risk Levels 4 and 5 -- Excellence Tiers

The file defines:
- Level 4: "sikun metzuyanut 1 bet" (risk to excellence tier 1-Bet)
- Level 5: "sikun gavoha le-metzuyanut 1 gimel" (high risk to excellence tier 1-Gimel)

**Q4:** What are the exact score thresholds for each excellence tier (Metzuyanut 1-Aleph, 1-Bet, 1-Gimel)? Are these official Ministry of Education definitions, or are they Sheifa-specific?

**Q5:** Is the excellence designation based solely on the weighted average, or does it also require minimum scores in specific subjects (e.g., minimum 5-unit Math)?

**Q6:** We notice that risk level 4 pertains to "1-Bet" and level 5 to "1-Gimel". Since Gimel is a lower tier than Bet, does this mean level 5 is actually about students at risk of missing the *lower* excellence threshold? In other words, is level 4 "might miss top honors" while level 5 is "might miss any honors at all"?

---

### 1.4 Risk Level Assignment -- Manual or Rule-Based?

**Q7:** Are risk levels (1-5) assigned manually by Sarit based on professional judgment, or are there specific rules/thresholds? For example, does "2 failing exams = risk level 3" automatically, or is it case-by-case?

**Q8:** If rule-based, please provide the complete decision matrix (e.g., "0 failing + weighted average above 90 = level 4 if below 95" etc.).

**Q9:** How often are risk levels updated? After every exam period? Or continuously as new information arrives?

---

### 1.5 Eligibility Rules

**Q10:** What are the exact rules for full Bagrut eligibility? Is it simply "pass (55+) in all mandatory subjects" or are there additional requirements (minimum unit count, community service completion, physical education pass, etc.)?

**Q11:** What subjects are absolutely mandatory for Bagrut eligibility? We see the core seven (Math, History, Civics, Tanakh, Literature, Language, English) plus General Studies, Introduction to Sciences, Physical Education, and Community Service. Are ALL of these required?

**Q12:** Must a student pass their elective/major subject (megama) to receive a Bagrut certificate, or only the core subjects?

---

### 1.6 "Full Bagrut Despite a Missing Exam" (bagrut mela lemrot bchina chasera)

This category appears in both class sheets and the rikuz sheet and applies to a meaningful number of students.

**Q13:** What are the exact conditions under which a student can receive full Bagrut despite having a missing exam? Is this a Ministry of Education policy or a school-level determination?

**Q14:** Does this apply only to specific subjects (e.g., electives)? Can a student get full Bagrut despite missing a core subject exam?

**Q15:** In the rikuz, this category is counted as a separate row below "full Bagrut" but is included in the cumulative percentage. Should our system treat these students as "fully eligible" or as "conditionally eligible"?

---

### 1.7 Class 12 -- Nature and Handling

**Q16:** What type of class is Yud-Bet 12? Is it special education (chinuch meyuchad), integration (shiluv), an alternative educational track, or something else?

**Q17:** Why does class 12 have a different column structure (student names in column C instead of E, fewer total columns)?

**Q18:** Should class 12 students appear in the school-wide sorting/ranking sheet (miyun), or should they always be tracked separately?

**Q19:** Class 12 has "Communications" (tikshooret) as its main elective, which no other class has. Is this the designated track for this class? Do all class 12 students take Communications?

---

### 1.8 Weighted Average Formula Variations

We found at least three different weighted average formulas:
1. Standard (class sheets): `(Math*5 + History*2 + Civics*2 + Tanakh*2 + Lit*2 + Lang*2 + English*5) / 20`
2. For 4-unit students: Same but with weight 4 for Math/English, dividing by 18
3. Gamification sheet: Includes elective subjects and uses a variable denominator

**Q20:** Which weighted average is the "official" one used for university admissions and honors determination? Is the elective subject included or not?

**Q21:** For students with mixed unit levels (e.g., 5-unit Math, 3-unit English), is there a different formula? The file shows "5 3", "5 4", "4 3" combinations in columns B-C.

**Q22:** We found some students with "K11" formula `=(T11*4+X11*2+AA11*2+AD11*2+AG11*2+AJ11*2+AV11*4)/18` using Sofi 4 for both Math and English. Is the formula always determined by the unit levels in columns B-C, or can it vary?

---

### 1.9 Data Sources and Entry

**Q23:** Where do external Bagrut exam scores come from? Are they downloaded from a Ministry of Education website (e.g., Mashov, Manbas), received as paper reports, emailed, or obtained from another system?

**Q24:** Where do internal (pnimi) scores come from? Are they provided by subject teachers, the homeroom teacher, or pulled from the school's grade management system?

**Q25:** Are the exam questionnaire codes (e.g., 16381, 899373, 57238) official Ministry of Education codes? Can we rely on them being stable year to year?

---

### 1.10 Accommodations System

The file tracks four types of accommodations in columns G-J: "mutaam" (adapted), "hachtava" (dictation), "be'al peh" (oral), and "al chet" (on account of / special accommodation).

**Q26:** What does each accommodation type mean specifically?
- "mutaam" (adapted) -- does this mean the student takes a modified version of the exam?
- "hachtava" (dictation) -- does this mean someone reads the exam to the student?
- "be'al peh" (oral) -- is this an oral exam instead of written?
- "al chet" (special accommodations) -- what specific accommodations does this cover?

**Q27:** Do accommodated students take different exam questionnaires (different codes), or the same questionnaires with different conditions? Does this affect the scoring formula at all?

---

## Section 2: Clarification Questions (Important for Accuracy)

These questions affect feature behavior, edge cases, and business rules but do not fundamentally change the architecture.

---

### 2.1 Gamification Sheet (mishchuk)

**Q28:** What is the actual purpose of the gamification sheet? Is it used for motivational conversations with students ("if you improve by 5 points, here's your average"), for staff planning, or for some other purpose?

**Q29:** The gamification sheet has ~172 rows while the sorting sheet has ~528. What determines which students appear in the gamification sheet? Is it only students with room for improvement, students at specific risk levels, or some other criterion?

**Q30:** The "minus 5" projection formula (e.g., `=O7-5`) -- is this intentional? The logic seems to be "project that the student scores 5 points below their best score on remaining exams." Is this the correct interpretation? Can Sarit adjust the projection offset (e.g., -3 or -10 instead of -5)?

**Q31:** The gamification sheet includes an "overall average" (memutza colel) that adds elective subjects. Who uses this number and for what decisions?

---

### 2.2 Enhanced Section (mugbarim)

In class sheet row 7-8, there is a "mugbarim" header (cell BA7) with percentage weights below it (e.g., 76/24, 50/50, 30/15/30/25).

**Q32:** What does "mugbarim" mean in this context? Our best guesses: (a) "enhanced" subjects meaning 5-unit level subjects, (b) subjects with extended exam time accommodation, (c) "intensive" track subjects. Which is correct?

**Q33:** The weight percentages under "mugbarim" -- are these the internal/external component weights for each elective subject, or do they represent something else?

---

### 2.3 "Chasam" (Barrier)

In class 12, cells K13, K17, K22, and K23 contain the text "chasam" (barrier) with yellow highlighting, causing #VALUE! errors in downstream formulas.

**Q34:** What exactly triggers a "chasam" entry? Is it an administrative block (the student cannot take that exam), a prerequisite failure (must pass X before taking Y), or something else?

**Q35:** When a student has "chasam", does this mean they will never take that exam, or is it temporary? If temporary, what clears the barrier?

**Q36:** Should the system handle "chasam" by excluding the subject from the weighted average calculation, or by treating it as 0, or by flagging it for special handling?

---

### 2.4 "Ikuv" (Delay)

We found "ikuv" (delay) entries in several cells (e.g., AO19 in class 1, N41 in class 3, AO21 and BF21 in class 15), sometimes with yellow highlighting and sometimes with red font.

**Q37:** What does "ikuv" mean? Is it a delay in receiving exam results, a delay in the student taking the exam (deferred to next period), or something else?

**Q38:** When "ikuv" appears in a score cell, how should it be handled in calculations? Should we treat it as "pending" (exclude from average until resolved) or as something else?

---

### 2.5 Abbreviations and Special Terms

**Q39:** What is "shiluv 07" (integration 07)? We see it in Column A for specific students and in the tracking grid with red highlighting. Does the "07" refer to a specific integration program, a classification code, or a year?

**Q40:** What is "t.l. mutaemet" (adapted t.l.)? We see this notation for specific students across exam periods. Does "t.l." stand for "tochnit limudim" (curriculum) meaning the student has an adapted curriculum?

**Q41:** What is "bak"s"? This appears in the challenging students section next to a student name. Does it stand for "ba-kuf-samech" (some kind of service/program)?

**Q42:** What exactly is "mad"ach" (appears as "mad"ach a. gmar")? We assume this is an abbreviation for a subject -- possibly "mada'ei ha-chevra" (social sciences) or "madaei ha-chaim" (life sciences). Which is it?

**Q43:** In the comparison sheet header, the abbreviation "ch"m" appears. We assumed "chinuch meyuchad" (special education). Is this correct?

---

### 2.6 Corrections Process (tikunim ve-hashlamot)

**Q44:** What is the "corrections and completions" process? Does a student request to retake an exam they failed, submit additional work, or appeal a grade?

**Q45:** Is there a limit on how many corrections a student can request? Is there a deadline?

**Q46:** When a correction is applied, does the new score replace the old one, or is the higher of the two kept?

---

### 2.7 Columns B-C Values

Values like "5 5", "5 3", "5 4", "4 3" appear in columns B and C of class sheets.

**Q47:** We assume these represent Math and English unit levels respectively (e.g., "5 5" = 5-unit Math and 5-unit English). Is this correct? Which number is Math and which is English?

**Q48:** When these values appear in column B vs column C, does the column matter? We see "5 5" in C12 for student 2, and "5 3" in B13 for student 3. Is the column placement significant?

---

### 2.8 Student Transfers and Departures

We found several special student situations:
- "Left abroad - January 2024" (azav le-chul)
- "Left Blich in 11th grade - was removed on 24.3.2024"
- "Transferred to Project Hila in March 25"
- "Transferred from Yud-Bet 11" (student who moved between classes)
- "Gave up on elective and on full Bagrut certificate"

**Q49:** When a student leaves mid-year, are they removed from the total count or kept in with zeros? How does this affect eligibility percentage calculations?

**Q50:** What is "Project Hila"? Is it a special program within the school, an external placement, or a dropout prevention initiative? How are students transferred there counted in Bagrut statistics?

**Q51:** When a student "gives up on elective and full Bagrut," what happens to them in the system? Are they reclassified as "lo begrutim" (non-matriculation)?

---

### 2.9 Community Service and Physical Education

**Q52:** Community service (me'oravut chevratit) shows values of 1, 3, or 4. What do these numbers represent? Are they hours categories (e.g., 1=did minimum, 4=exceeded requirements)? Are they pass/fail equivalents? What value constitutes "passing"?

**Q53:** Physical education (chinuch gufani / chanag) shows values from 40-100 that look like regular grades. Is PE a formally graded Bagrut subject, or is it pass/fail with a grade recorded for reference only?

---

### 2.10 Multiple Arabic Columns in Sorting Sheet

The sorting sheet has two separate Arabic sections (columns CL-CO and DG-DJ).

**Q54:** Why are there two distinct Arabic sections? Do they represent different levels (3-unit vs 5-unit), different types of Arabic (Modern Standard vs Spoken), or something else entirely?

---

## Section 3: Assumptions We Made (Validate These)

For each assumption, we note what we assumed and why, so Sarit can confirm or correct.

---

### A1: Column Order Consistency
**Assumed:** All 15 regular class sheets follow the same column order (A=flags, B-C=unit levels, D=student number, E=name, F=merged with E, G-J=accommodations, K=weighted average, L-R=Math, S-U=Math finals, V-X=History, Y-AA=Civics, AB-AD=Tanakh, AE-AG=Literature, AH-AJ=Language, AK-AW=English, AX-AY=General Studies, AZ=Intro Sciences, BA+ =electives).
**Why:** Verified in class 1 data; spot-checked a few other classes.
**Risk if wrong:** If column order varies between classes, our data import mapping will break for specific classes.

### A2: Passing Grade is Always 55
**Assumed:** The universal passing threshold for Bagrut exams is 55 across all subjects.
**Why:** Red font formatting is applied to scores below 55; threshold color coding at 52-54 range.
**Risk if wrong:** Some subjects or accommodated students might have different thresholds.

### A3: 30/70 is the Default Weight Split
**Assumed:** Most subjects use 30% internal / 70% external weighting, with documented exceptions (Civics: 80/20, Jewish Law: 50/50, etc.).
**Why:** Confirmed from formulas in the extracted data.
**Risk if wrong:** Weights might change year-to-year based on Ministry directives.

### A4: Sarit is the Sole Data Entry Person
**Assumed:** Only Sarit enters and maintains data in this workbook. Other staff (Shira, Hila, homeroom teachers) receive information from it but do not edit it.
**Why:** The file structure and single-user workflow patterns suggest one editor.
**Risk if wrong:** If multiple people edit, we need collaboration features, access control, and conflict resolution.

### A5: Risk Level Colors in Column D
**Assumed:** Risk level is encoded as the background color of the student number cell in column D, using the colors defined in the legend (green=1, no color with orange font=2, amber=3, no bg with red font=4, peach bg with red font=5).
**Why:** Consistent with the legend and the data patterns observed.
**Risk if wrong:** If risk levels are also stored elsewhere or derived differently, our display logic will be incorrect.

### A6: Exam Period Structure is Fixed
**Assumed:** There are always exactly 4-5 exam periods per academic year: after summer (Yud-Aleph), after summer (Yud-Bet), after winter (Yud-Bet), after winter + corrections, and after summer (final).
**Why:** Consistent across all class sheets.
**Risk if wrong:** If additional exam periods exist (e.g., "moed bet" retakes), we might miss tracking windows.

### A7: The Sorting Sheet Rank Order
**Assumed:** Students in the sorting sheet are ordered by weighted average (descending), and this ordering is manually maintained or manually triggered via Excel's sort function.
**Why:** The sheet name says "miyun al pi memutza meshukall" (sorting by weighted average).
**Risk if wrong:** If the sort includes other criteria (e.g., first by class, then by average), our auto-sort logic needs adjustment.

### A8: Non-Matriculation Students are Excluded from Percentages
**Assumed:** Students marked "lo begrutim" (non-matriculation, red background in column A) are excluded from the eligibility percentage calculations in the rikuz.
**Why:** The totals don't seem to include all students in every class, and some students have red markings indicating they are on a different track.
**Risk if wrong:** If they ARE included in the denominator, it artificially lowers the school's eligibility rate.

### A9: General Studies and Intro to Sciences are Not Weighted
**Assumed:** "Haskalah klalit" (General Studies) and "Mavo le-madaim" (Introduction to Sciences) have scores recorded but are NOT included in the weighted average formula.
**Why:** These subjects do not appear in any weighted average formula we found.
**Risk if wrong:** They might contribute to eligibility requirements even if not to the average.

### A10: The Comparison Sheet Data for Previous Years is Static
**Assumed:** The values for years tashpab (2021-22), tashpag (2022-23), and tashpad (2023-24) in the comparison sheet are manually entered final numbers, not linked to other files or sheets.
**Why:** No cross-file references were found; only the current year's percentages use formulas (=H7/H6).
**Risk if wrong:** If historical data should be auto-populated from archived workbooks, we need a historical data import feature.

### A11: "Sofi" Columns are Always Formula-Driven
**Assumed:** Columns labeled "sofi 3", "sofi 4", "sofi 5" (final scores per unit level) are always calculated via formula and never manually overridden.
**Why:** Every "sofi" cell we examined had a formula.
**Risk if wrong:** If Sarit sometimes manually types a final score to override the formula (e.g., after a correction), we need to support manual overrides.

### A12: Each Student Takes Exactly One Math Level and One English Level
**Assumed:** A student has scores for either 3-unit OR 4-unit OR 5-unit Math (not multiple levels), and similarly for English.
**Why:** The unit level indicator in columns B-C shows a single pair.
**Risk if wrong:** Some students might upgrade from 3-unit to 4-unit mid-stream, requiring tracking of both levels.

### A13: Elective Subjects are Always 5-Unit Level
**Assumed:** All elective/major subjects (megamot) tracked under "mugbarim" are 5-unit level subjects.
**Why:** Every elective's final score column is labeled "sofi 5".
**Risk if wrong:** If some electives can be 3-unit or 4-unit, the weighted average denominator logic changes.

### A14: The Year-over-Year Comparison Only Tracks 4 Years
**Assumed:** The comparison sheet always shows exactly 4 academic years (the current plus 3 prior).
**Why:** The sheet has exactly 4 year columns.
**Risk if wrong:** If the school wants to see longer trends (5+years), we need a flexible comparison range.

---

## Section 4: Nice-to-Know Questions

These questions help us plan future features, understand the broader context, and prepare for scale.

---

### 4.1 Stakeholders and Access

**Q55:** Who else besides Sarit uses this data? Do homeroom teachers receive copies of their class sheet? Does the principal see the rikuz? Is there a board or Ministry reporting requirement?

**Q56:** Are there privacy regulations governing student grade data in Israel that we need to comply with? Can a teacher see grades for students not in their class?

---

### 4.2 Update Frequency and Workflow

**Q57:** How often is the file updated -- daily, weekly, after each exam period, or in batches? During peak periods (after exam results arrive), how many hours does data entry take?

**Q58:** Is there a specific workflow for the challenging students section? For example: Sarit identifies the students -> meets with Shira -> Shira follows up with homeroom teachers -> outcomes are recorded. Is this accurate?

---

### 4.3 Year-over-Year Trends

**Q59:** The data shows declining metrics across all tracked dimensions (eligibility rate: 96.6% -> 92.4%, honors: 43.8% -> 34.6%, 5-unit Math: 41.6% -> 33.8%). Is this a known concern at the school level? Does the school have targets for these metrics?

**Q60:** For the current year (tashpeh), the 92.4% eligibility rate is noticeably lower than the prior three years (~96.7%). Is this because the year is still in progress (more students will pass by summer), or is there a genuine decline?

---

### 4.4 Future Expansion

**Q61:** Does the school plan to track 10th and 11th grade Bagrut exams in the same way, or is this system exclusively for 12th grade? Some exam scores (like Math 182/183) are taken in earlier grades.

**Q62:** Would the school want to share individual student dashboards with students/parents, or is this strictly an internal staff tool?

---

## Appendix: Data Anomalies Found in JSON

During analysis of the extracted JSON data, we identified several anomalies that need clarification regardless of the questions above:

### Anomaly 1: Student Moved Between Classes
A student "Shabbat Tal" appears with annotation "transferred from Yud-Bet 11" in the tracking grid of another class. This suggests mid-year class transfers happen.
- **Impact:** The system needs to handle student transfers between classes without losing historical data.

### Anomaly 2: "Project Hila" Transfer
A student "Avishar Gali Hadar" (student #39) has the annotation "transferred to Project Hila in March 25" with red background. This appears in both the main class data and the tracking grid.
- **Impact:** Need to understand what "Project Hila" is and how transferred students should be counted.

### Anomaly 3: Formula Errors in Class 12
Four students (K13, K17, K22, K23) in class 12 have "chasam" text values causing #VALUE! errors in the math final score formulas (P13, P17, P22, P23).
- **Impact:** The system must gracefully handle non-numeric values in score cells.

### Anomaly 4: "Gave Up on Elective and Full Bagrut"
Student #19 in what appears to be class 7 (ref A29) has the annotation "viter al megama ve-al t bagrut mela" (gave up on elective and on full Bagrut certificate).
- **Impact:** Students can actively decline to pursue full Bagrut -- the system needs a "voluntarily withdrawn from Bagrut track" status distinct from "failed."

### Anomaly 5: Extended Biology Track
A student has the annotation "yesh megama murhevet biologia" (has extended major in biology). This suggests some students have an enhanced version of their elective.
- **Impact:** The system may need to distinguish between regular and extended versions of elective subjects.

### Anomaly 6: "Elective!!" Warning
In the tracking grid, one cell contains just "megama!!" (elective!!) as a warning annotation, suggesting an urgent issue with that student's elective subject.
- **Impact:** The system needs a way to flag free-text urgent notes per student.

### Anomaly 7: "Improvement" Annotations
The word "shipur" (improvement) appears in the challenging students section next to students in the "close follow-up" category.
- **Impact:** Progress notes and improvement tracking need to be part of the system.

### Anomaly 8: rikuz Total Discrepancy
The rikuz sheet shows 517 as a total in some sections (rows using `=SUM(AD41:AD46)` for the "after summer 2024" section), while the initial section shows 509. The comparison sheet says 503.
- **Impact:** Need clarity on why totals differ across sections -- is it because students enrolled/left during the year, or because different sections count differently?

---

*This document should be reviewed by Sarit (or the person who maintains the Bagrut tracking workbook) before product development proceeds. Answers to Critical Questions (Section 1) are blocking for architecture decisions.*
