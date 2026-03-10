import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useConfig } from '@/contexts/ConfigContext';
import { NaturalLanguageRules } from './NaturalLanguageRules';

export function RiskRulesTab() {
  const { config, updateConfig } = useConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>כללי סיכון</CardTitle>
        <CardDescription>הגדרת כללים לקביעת רמת סיכון תלמידים</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="natural" dir="rtl">
          <TabsList>
            <TabsTrigger value="natural">טבעי</TabsTrigger>
            <TabsTrigger value="manual">ידני</TabsTrigger>
          </TabsList>

          <TabsContent value="natural" className="pt-4">
            <NaturalLanguageRules />
          </TabsContent>

          <TabsContent value="manual" className="pt-4">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
