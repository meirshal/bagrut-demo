import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfig } from '@/contexts/ConfigContext';
import { ThresholdsTab } from '@/components/settings/ThresholdsTab';
import { RiskRulesTab } from '@/components/settings/RiskRulesTab';
import { SubjectWeightsTab } from '@/components/settings/SubjectWeightsTab';
import { EligibilityTab } from '@/components/settings/EligibilityTab';
import { WhatIfTab } from '@/components/settings/WhatIfTab';
import { ClassExclusionsTab } from '@/components/settings/ClassExclusionsTab';
import { ExamPeriodsTab } from '@/components/settings/ExamPeriodsTab';
import { ChallengeCategoriesTab } from '@/components/settings/ChallengeCategoriesTab';
import { StatsDenominatorTab } from '@/components/settings/StatsDenominatorTab';

// ─── Main Settings Page ─────────────────────────────────────────────────────────

export function Settings() {
  const { resetToDefaults } = useConfig();

  return (
    <div dir="rtl" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">הגדרות</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ניהול הגדרות המערכת, ספים, נוסחאות וכללי חישוב
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="gap-2"
        >
          <RotateCcw className="size-4" />
          איפוס להגדרות ברירת מחדל
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="thresholds" dir="rtl">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="thresholds">ספים</TabsTrigger>
          <TabsTrigger value="formulas">נוסחאות</TabsTrigger>
          <TabsTrigger value="rules">כללים</TabsTrigger>
          <TabsTrigger value="display">תצוגה</TabsTrigger>
          <TabsTrigger value="system">מערכת</TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds">
          <ThresholdsTab />
        </TabsContent>

        <TabsContent value="formulas">
          <SubjectWeightsTab />
        </TabsContent>

        <TabsContent value="rules">
          <div className="space-y-6">
            <RiskRulesTab />
            <Separator />
            <EligibilityTab />
            <Separator />
            <StatsDenominatorTab />
          </div>
        </TabsContent>

        <TabsContent value="display">
          <div className="space-y-6">
            <WhatIfTab />
            <Separator />
            <ChallengeCategoriesTab />
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <ClassExclusionsTab />
            <Separator />
            <ExamPeriodsTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
