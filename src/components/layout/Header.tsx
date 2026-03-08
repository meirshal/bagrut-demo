import { ChevronDown, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getExamPeriods } from '@/data/mock-data';

interface HeaderProps {
  selectedPeriod?: string;
  onPeriodChange?: (periodId: string) => void;
}

export function Header({ selectedPeriod, onPeriodChange }: HeaderProps) {
  const periods = getExamPeriods();
  const currentPeriod = periods.find((p) => p.id === selectedPeriod) ?? periods[periods.length - 1];

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white/80 backdrop-blur-sm px-6">
      {/* Right side - school name */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-900">
          מפת״ח
        </h2>
        <Badge variant="secondary" className="text-xs">
          תשפ״ה
        </Badge>
      </div>

      {/* Left side - period and stats */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1 text-xs">
          <span className="text-muted-foreground">503</span> תלמידים
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <CalendarDays className="size-3.5" />
              {currentPeriod.name}
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {periods.map((period) => (
              <DropdownMenuItem
                key={period.id}
                onClick={() => onPeriodChange?.(period.id)}
                className={period.id === currentPeriod.id ? 'bg-accent font-semibold' : ''}
              >
                {period.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
