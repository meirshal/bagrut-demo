import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/contexts/ConfigContext';

export function WhatIfTab() {
  const { config, updateConfig } = useConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>ברירות מחדל לתרחישים</CardTitle>
        <CardDescription>
          הגדרות ברירת מחדל לתצוגת &quot;מה אם&quot;
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="whatIfOffset" className="w-40 shrink-0">
              הסטת ציון ברירת מחדל
            </Label>
            <Input
              id="whatIfOffset"
              type="number"
              min={-50}
              max={50}
              className="w-24"
              value={config.whatIfDefaults.offset}
              onChange={(e) =>
                updateConfig({
                  whatIfDefaults: {
                    ...config.whatIfDefaults,
                    offset: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              id="showProjectedExcellence"
              checked={config.whatIfDefaults.showProjectedExcellence}
              onCheckedChange={(checked) =>
                updateConfig({
                  whatIfDefaults: {
                    ...config.whatIfDefaults,
                    showProjectedExcellence: checked,
                  },
                })
              }
            />
            <Label htmlFor="showProjectedExcellence">
              הצגת מצויינות צפויה
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
