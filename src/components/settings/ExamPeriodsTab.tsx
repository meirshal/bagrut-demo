import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function ExamPeriodsTab() {
  const { config, updateConfig } = useConfig();

  const handleNameChange = (id: string, name: string) => {
    updateConfig({
      examPeriods: config.examPeriods.map((p) =>
        p.id === id ? { ...p, name } : p
      ),
    });
  };

  const handleShortNameChange = (id: string, shortName: string) => {
    updateConfig({
      examPeriods: config.examPeriods.map((p) =>
        p.id === id ? { ...p, shortName } : p
      ),
    });
  };

  const addPeriod = () => {
    const newId = `period-${Date.now()}`;
    updateConfig({
      examPeriods: [
        ...config.examPeriods,
        { id: newId, name: '', shortName: '' },
      ],
    });
  };

  const removePeriod = (id: string) => {
    updateConfig({
      examPeriods: config.examPeriods.filter((p) => p.id !== id),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>מועדי בחינות</CardTitle>
        <CardDescription>תקופות הבחינות המוגדרות במערכת</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {config.examPeriods.map((period) => (
            <div key={period.id} className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3">
                <Label className="w-16 shrink-0 text-sm">שם</Label>
                <Input
                  value={period.name}
                  onChange={(e) => handleNameChange(period.id, e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-16 shrink-0 text-sm">קיצור</Label>
                <Input
                  value={period.shortName}
                  onChange={(e) =>
                    handleShortNameChange(period.id, e.target.value)
                  }
                  className="w-28"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePeriod(period.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addPeriod} className="gap-2">
            <Plus className="size-4" />
            הוסף תקופה
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
