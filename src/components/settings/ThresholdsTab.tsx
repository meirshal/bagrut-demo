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
import { SCORE_COLORS } from '@/lib/colors';

const EXCELLENCE_FIELDS = [
  { key: 'aleph' as const, label: 'מצויינות 1-א', min: 90, max: 100 },
  { key: 'bet' as const, label: 'מצויינות 1-ב', min: 85, max: 100 },
  { key: 'borderBet' as const, label: 'גבול מצויינות 1-ב', min: 80, max: 100 },
  { key: 'gimel' as const, label: 'מצויינות 1-ג', min: 75, max: 100 },
  { key: 'borderGimel' as const, label: 'גבול מצויינות 1-ג', min: 70, max: 100 },
] as const;

const SCORE_COLOR_FIELDS = [
  { key: 'failingBelow' as const, label: 'כושל מתחת ל', color: SCORE_COLORS.failing },
  { key: 'borderlineLow' as const, label: 'גבולי תחתון', color: SCORE_COLORS.borderline52 },
  { key: 'borderlineHigh' as const, label: 'גבולי עליון', color: SCORE_COLORS.borderline54 },
  { key: 'excellenceAbove' as const, label: 'מצויינות מעל', color: SCORE_COLORS.excellence },
] as const;

export function ThresholdsTab() {
  const { config, updateConfig } = useConfig();

  return (
    <div className="space-y-4">
      {/* Passing Threshold */}
      <Card>
        <CardHeader>
          <CardTitle>ציון עובר</CardTitle>
          <CardDescription>ציון מינימלי לעבירה במקצוע בגרות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Label htmlFor="passingThreshold">סף עובר</Label>
            <Input
              id="passingThreshold"
              type="number"
              min={0}
              max={100}
              className="w-24"
              value={config.passingThreshold}
              onChange={(e) =>
                updateConfig({ passingThreshold: Number(e.target.value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Excellence Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>ספי הצטיינות</CardTitle>
          <CardDescription>ספי ציון לדרגות מצויינות א, ב, ג</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {EXCELLENCE_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <Label htmlFor={`excellence-${field.key}`} className="w-40 shrink-0">
                  {field.label}
                </Label>
                <Input
                  id={`excellence-${field.key}`}
                  type="number"
                  min={field.min}
                  max={field.max}
                  className="w-24"
                  value={config.excellenceTiers[field.key]}
                  onChange={(e) =>
                    updateConfig({
                      excellenceTiers: {
                        ...config.excellenceTiers,
                        [field.key]: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Colors */}
      <Card>
        <CardHeader>
          <CardTitle>צבעי ציונים</CardTitle>
          <CardDescription>ספי ציון לצביעה אוטומטית בטבלה</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SCORE_COLOR_FIELDS.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <div
                  className="size-5 shrink-0 rounded border"
                  style={{ backgroundColor: field.color }}
                />
                <Label htmlFor={`scoreColor-${field.key}`} className="w-32 shrink-0">
                  {field.label}
                </Label>
                <Input
                  id={`scoreColor-${field.key}`}
                  type="number"
                  min={0}
                  max={100}
                  className="w-24"
                  value={config.scoreColors[field.key]}
                  onChange={(e) =>
                    updateConfig({
                      scoreColors: {
                        ...config.scoreColors,
                        [field.key]: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
