import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useConfig } from '@/contexts/ConfigContext';

export function RiskRulesTab() {
  const { config, updateConfig } = useConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>כללי סיכון</CardTitle>
        <CardDescription>ספי כשלונות לקביעת רמת סיכון</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label htmlFor="highRiskFailures" className="w-48 shrink-0">
              כישלונות לסיכון גבוה
            </Label>
            <Input
              id="highRiskFailures"
              type="number"
              min={0}
              max={20}
              className="w-24"
              value={config.riskRules.highRiskFailures}
              onChange={(e) =>
                updateConfig({
                  riskRules: {
                    ...config.riskRules,
                    highRiskFailures: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="riskFailures" className="w-48 shrink-0">
              כישלונות לסיכון
            </Label>
            <Input
              id="riskFailures"
              type="number"
              min={0}
              max={20}
              className="w-24"
              value={config.riskRules.riskFailures}
              onChange={(e) =>
                updateConfig({
                  riskRules: {
                    ...config.riskRules,
                    riskFailures: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="escalationAvg" className="w-48 shrink-0">
              סף ממוצע להסלמה
            </Label>
            <Input
              id="escalationAvg"
              type="number"
              min={0}
              max={100}
              className="w-24"
              value={config.riskRules.escalationAvgBelow}
              onChange={(e) =>
                updateConfig({
                  riskRules: {
                    ...config.riskRules,
                    escalationAvgBelow: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
