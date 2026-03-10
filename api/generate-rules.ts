import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// ── Vercel AI Gateway ──────────────────────────────────────────────
const gateway = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

const model = gateway('openai/gpt-4o-mini');

// ── Zod schema matching RiskRuleSet ────────────────────────────────
const RuleConditionSchema = z.object({
  field: z.enum([
    'weightedAverage',
    'failureCount',
    'eligibilityStatus',
    'mathUnitLevel',
    'englishUnitLevel',
    'subjectGrade',
  ]),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte']),
  value: z.union([z.number(), z.string()]),
  subjectId: z.union([z.string(), z.null()]),
});

const RiskRuleSetSchema = z.object({
  rules: z.array(
    z.object({
      riskLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      label: z.string(),
      conditions: z.array(RuleConditionSchema),
    }),
  ),
  defaultRiskLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

// ── System prompt ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a rule-generation assistant for an Israeli Bagrut (matriculation exam) tracking system.
Your job is to convert natural-language Hebrew descriptions of risk classification policies into structured JSON rule sets.

## Available Fields

| Field              | Type    | Description                                                    |
|--------------------|---------|----------------------------------------------------------------|
| weightedAverage    | number  | Student's weighted average score, range 0–100                  |
| failureCount       | number  | Count of core subjects where the student scored below 55 (0–7) |
| eligibilityStatus  | string  | One of: FULL_BAGRUT, MISSING_1, MISSING_2, MISSING_3, MISSING_4_PLUS |
| mathUnitLevel      | number  | Math unit level: 3, 4, or 5                                    |
| englishUnitLevel   | number  | English unit level: 3, 4, or 5                                 |
| subjectGrade       | number  | Grade in a specific subject (requires subjectId)               |

## Core Subject IDs

| Subject ID  | Hebrew Name |
|-------------|-------------|
| math        | מתמטיקה      |
| history     | היסטוריה     |
| civics      | אזרחות       |
| tanakh      | תנ"ך         |
| literature  | ספרות        |
| language    | לשון         |
| english     | אנגלית       |

## Valid Operators

| Operator | Meaning                |
|----------|------------------------|
| eq       | Equal to               |
| neq      | Not equal to           |
| gt       | Greater than           |
| gte      | Greater than or equal  |
| lt       | Less than              |
| lte      | Less than or equal     |

## Rule Evaluation

- Rules are evaluated top-to-bottom; the **first match wins**.
- Each rule has one or more conditions (AND logic — all conditions must be true).
- If no rule matches, the defaultRiskLevel applies.
- riskLevel 1 = most at-risk, 2 = moderate risk, 3 = low risk / safe.
- Labels should be in **Hebrew**.

## Examples

**Input:** "תלמידים עם ממוצע מתחת ל-50 הם בסיכון גבוה, מתחת ל-70 סיכון בינוני, השאר בסדר"
**Output:**
{
  "rules": [
    { "riskLevel": 1, "label": "סיכון גבוה — ממוצע נמוך מאוד", "conditions": [{ "field": "weightedAverage", "operator": "lt", "value": 50 }] },
    { "riskLevel": 2, "label": "סיכון בינוני — ממוצע מתחת ל-70", "conditions": [{ "field": "weightedAverage", "operator": "lt", "value": 70 }] }
  ],
  "defaultRiskLevel": 3
}

**Input:** "מי שנכשל ב-3 מקצועות או יותר זה דחוף, נכשל ב-1-2 זה בינוני"
**Output:**
{
  "rules": [
    { "riskLevel": 1, "label": "סיכון גבוה — 3+ כישלונות", "conditions": [{ "field": "failureCount", "operator": "gte", "value": 3 }] },
    { "riskLevel": 2, "label": "סיכון בינוני — 1-2 כישלונות", "conditions": [{ "field": "failureCount", "operator": "gte", "value": 1 }] }
  ],
  "defaultRiskLevel": 3
}

Generate valid rules that faithfully represent the user's intent. Always output Hebrew labels.`;

// ── Vercel Serverless Handler ──────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "prompt" field' });
      return;
    }

    const result = await generateObject({
      model,
      schema: RiskRuleSetSchema,
      system: SYSTEM_PROMPT,
      prompt,
    });

    res.json(result.object);
  } catch (error) {
    console.error('Error generating rules:', error);
    res.status(500).json({
      error: 'Failed to generate rules',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
