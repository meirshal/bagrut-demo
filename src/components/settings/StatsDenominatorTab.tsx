import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useConfig } from '@/contexts/ConfigContext';
import type { ConfigState } from '@/contexts/ConfigContext';

const OPTIONS: {
  value: ConfigState['statsDenominator'];
  title: string;
  description: string;
}[] = [
  {
    value: 'quality',
    title: 'איכות',
    description: 'חישוב סטטיסטיקות ללא כיתות חינוך מיוחד',
  },
  {
    value: 'all',
    title: 'כולל הכל',
    description: 'חישוב סטטיסטיקות כולל כל התלמידים ללא החרגות',
  },
];

export function StatsDenominatorTab() {
  const { config, updateConfig } = useConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>מכנה סטטיסטיקות</CardTitle>
        <CardDescription>
          האם לחשב סטטיסטיקות על בסיס תלמידי איכות בלבד או כל התלמידים
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateConfig({ statsDenominator: option.value })}
              className={`rounded-lg border-2 p-4 text-start transition-colors ${
                config.statsDenominator === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <div className="text-sm font-semibold">{option.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
