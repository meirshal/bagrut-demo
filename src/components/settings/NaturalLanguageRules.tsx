import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useConfig } from '@/contexts/ConfigContext';
import type { RiskRuleSet } from '@/types/risk-rules';
import { RulePreview } from './RulePreview';

export function NaturalLanguageRules() {
  const { config, updateConfig } = useConfig();
  const [prompt, setPrompt] = useState(config.riskRules.naturalLanguagePrompt ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRuleSet, setGeneratedRuleSet] = useState<RiskRuleSet | null>(
    config.riskRules.generatedRuleSet ?? null,
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedRuleSet(null);

    try {
      const response = await fetch('/api/generate-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `שגיאה ${response.status}`);
      }

      const data = (await response.json()) as RiskRuleSet;
      setGeneratedRuleSet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בלתי צפויה');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (ruleSet: RiskRuleSet) => {
    updateConfig({
      riskRules: {
        ...config.riskRules,
        mode: 'natural',
        naturalLanguagePrompt: prompt,
        generatedRuleSet: ruleSet,
      },
    });
  };

  const handleCancel = () => {
    setGeneratedRuleSet(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>כללים בשפה טבעית</CardTitle>
          <CardDescription>
            תארו את כללי הסיכון בעברית חופשית — המערכת תתרגם אותם לכללים מובנים
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            dir="rtl"
            rows={5}
            placeholder="למשל: תלמיד עם 2 כישלונות או יותר הוא בסיכון גבוה (רמה 3). תלמיד עם כישלון אחד וממוצע מתחת ל-65 גם כן סיכון גבוה. תלמיד עם כישלון אחד הוא בסיכון (רמה 2). כל השאר תקינים."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div
              dir="rtl"
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? 'מעבד...' : 'יצירת כללים'}
          </Button>
        </CardContent>
      </Card>

      {generatedRuleSet && (
        <RulePreview
          ruleSet={generatedRuleSet}
          onApprove={handleApprove}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
