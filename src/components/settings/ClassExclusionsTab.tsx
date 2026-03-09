import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useConfig } from '@/contexts/ConfigContext';

const CLASSES = Array.from({ length: 16 }, (_, i) => ({
  id: `class-${i + 1}`,
  displayName: `יב ${i + 1}`,
}));

export function ClassExclusionsTab() {
  const { config, updateConfig } = useConfig();

  const getExclusion = (classId: string) =>
    config.classExclusions[classId] ?? {
      excludeFromQuality: false,
      excludeFromRanking: false,
    };

  const handleChange = (
    classId: string,
    field: 'excludeFromQuality' | 'excludeFromRanking',
    checked: boolean
  ) => {
    const current = getExclusion(classId);
    const updated = { ...current, [field]: checked };

    // Remove entry if both are false to keep the object clean
    const newExclusions = { ...config.classExclusions };
    if (!updated.excludeFromQuality && !updated.excludeFromRanking) {
      delete newExclusions[classId];
    } else {
      newExclusions[classId] = updated;
    }

    updateConfig({ classExclusions: newExclusions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>החרגות כיתות</CardTitle>
        <CardDescription>
          כיתות שאינן נכללות בחישובי איכות או דירוג
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>כיתה</TableHead>
              <TableHead className="w-32 text-center">החרגה מאיכות</TableHead>
              <TableHead className="w-32 text-center">החרגה מדירוג</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CLASSES.map((cls) => {
              const exclusion = getExclusion(cls.id);
              return (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.displayName}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={exclusion.excludeFromQuality}
                      onCheckedChange={(checked) =>
                        handleChange(cls.id, 'excludeFromQuality', checked === true)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={exclusion.excludeFromRanking}
                      onCheckedChange={(checked) =>
                        handleChange(cls.id, 'excludeFromRanking', checked === true)
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
