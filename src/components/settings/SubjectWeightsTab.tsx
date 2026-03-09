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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useConfig } from '@/contexts/ConfigContext';

export function SubjectWeightsTab() {
  const { config, updateConfig } = useConfig();

  const handleUnitsChange = (subjectId: string, units: number) => {
    updateConfig({
      weightedAvgSubjects: config.weightedAvgSubjects.map((s) =>
        s.subjectId === subjectId ? { ...s, units } : s
      ),
    });
  };

  const handleIncludedChange = (subjectId: string, included: boolean) => {
    updateConfig({
      weightedAvgSubjects: config.weightedAvgSubjects.map((s) =>
        s.subjectId === subjectId ? { ...s, included } : s
      ),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>מקצועות לממוצע משוקלל</CardTitle>
          <CardDescription>
            המקצועות והיחידות שנכללים בחישוב הממוצע המשוקלל
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מקצוע</TableHead>
                <TableHead className="w-28">יחידות</TableHead>
                <TableHead className="w-24">נכלל</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.weightedAvgSubjects.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell className="font-medium">{subject.label}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      className="w-20"
                      value={subject.units}
                      onChange={(e) =>
                        handleUnitsChange(subject.subjectId, Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      size="lg"
                      checked={subject.included}
                      onCheckedChange={(checked) =>
                        handleIncludedChange(subject.subjectId, checked)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>מכנה משתנה</CardTitle>
          <CardDescription>
            האם לחשב ממוצע רק ממקצועות שיש בהם ציון (מכנה משתנה) או מכל המקצועות
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Switch
              size="lg"
              id="variableDenominator"
              checked={config.variableDenominator}
              onCheckedChange={(checked) =>
                updateConfig({ variableDenominator: checked })
              }
            />
            <Label htmlFor="variableDenominator">
              {config.variableDenominator ? 'מכנה משתנה (פעיל)' : 'מכנה קבוע'}
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
