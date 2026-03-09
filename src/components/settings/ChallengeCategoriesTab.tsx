import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConfig } from '@/contexts/ConfigContext';

const COLOR_OPTIONS = [
  { value: '#D99594', label: 'אדום' },
  { value: '#FFC000', label: 'כתום' },
  { value: '#8DB3E2', label: 'כחול' },
  { value: '#92D050', label: 'ירוק' },
  { value: '#B2A1C7', label: 'סגול' },
] as const;

export function ChallengeCategoriesTab() {
  const { config, updateConfig } = useConfig();

  const handleLabelChange = (id: string, label: string) => {
    updateConfig({
      challengeCategories: config.challengeCategories.map((c) =>
        c.id === id ? { ...c, label } : c
      ),
    });
  };

  const handleColorChange = (id: string, color: string) => {
    updateConfig({
      challengeCategories: config.challengeCategories.map((c) =>
        c.id === id ? { ...c, color } : c
      ),
    });
  };

  const addCategory = () => {
    const newId = `category-${Date.now()}`;
    updateConfig({
      challengeCategories: [
        ...config.challengeCategories,
        { id: newId, label: '', color: '#8DB3E2' },
      ],
    });
  };

  const removeCategory = (id: string) => {
    updateConfig({
      challengeCategories: config.challengeCategories.filter((c) => c.id !== id),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>קטגוריות תלמידים מאתגרים</CardTitle>
        <CardDescription>
          הגדרת קטגוריות לסיווג תלמידים מאתגרים
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {config.challengeCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-3">
                <Label className="w-12 shrink-0 text-sm">שם</Label>
                <Input
                  value={category.label}
                  onChange={(e) =>
                    handleLabelChange(category.id, e.target.value)
                  }
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-12 shrink-0 text-sm">צבע</Label>
                <Select
                  value={category.color}
                  onValueChange={(value) =>
                    handleColorChange(category.id, value)
                  }
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-3 rounded"
                            style={{ backgroundColor: opt.value }}
                          />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 border-transparent"
                style={{ backgroundColor: category.color }}
              >
                {category.label || '...'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCategory(category.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCategory} className="gap-2">
            <Plus className="size-4" />
            הוסף קטגוריה
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
