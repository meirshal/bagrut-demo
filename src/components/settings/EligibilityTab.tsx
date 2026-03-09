import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/contexts/ConfigContext';

const CORE_SUBJECTS = [
  { id: 'math', label: 'מתמטיקה' },
  { id: 'history', label: 'היסטוריה' },
  { id: 'civics', label: 'אזרחות' },
  { id: 'tanakh', label: 'תנ"ך' },
  { id: 'literature', label: 'ספרות' },
  { id: 'language', label: 'לשון' },
  { id: 'english', label: 'אנגלית' },
] as const;

export function EligibilityTab() {
  const { config, updateConfig } = useConfig();

  const toggleMandatory = (subjectId: string, checked: boolean) => {
    const current = config.eligibilityRules.mandatorySubjects;
    const updated = checked
      ? [...current, subjectId]
      : current.filter((id) => id !== subjectId);
    updateConfig({
      eligibilityRules: {
        ...config.eligibilityRules,
        mandatorySubjects: updated,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>כללי זכאות</CardTitle>
        <CardDescription>דרישות לזכאות לתעודת בגרות</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Mandatory subjects */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">מקצועות חובה</Label>
            <div className="space-y-2">
              {CORE_SUBJECTS.map((subject) => (
                <div key={subject.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`mandatory-${subject.id}`}
                    checked={config.eligibilityRules.mandatorySubjects.includes(
                      subject.id
                    )}
                    onCheckedChange={(checked) =>
                      toggleMandatory(subject.id, checked === true)
                    }
                  />
                  <Label htmlFor={`mandatory-${subject.id}`}>{subject.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Require elective */}
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              id="requireElective"
              checked={config.eligibilityRules.requireElective}
              onCheckedChange={(checked) =>
                updateConfig({
                  eligibilityRules: {
                    ...config.eligibilityRules,
                    requireElective: checked,
                  },
                })
              }
            />
            <Label htmlFor="requireElective">דרישת בחירה</Label>
          </div>

          {/* Full despite missing */}
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              id="fullDespiteMissing"
              checked={config.eligibilityRules.fullDespiteMissing}
              onCheckedChange={(checked) =>
                updateConfig({
                  eligibilityRules: {
                    ...config.eligibilityRules,
                    fullDespiteMissing: checked,
                  },
                })
              }
            />
            <Label htmlFor="fullDespiteMissing">
              בגרות מלאה למרות בחינה חסרה
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
