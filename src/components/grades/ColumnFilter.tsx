import { useState } from 'react';
import { ListFilter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ─── Filter type definitions ─────────────────────────────────────────────────

interface CheckboxFilterConfig {
  type: 'checkbox';
  options: { value: string; label: string }[];
}

interface TextFilterConfig {
  type: 'text';
  placeholder?: string;
}

interface RangeFilterConfig {
  type: 'range';
}

export type FilterConfig = CheckboxFilterConfig | TextFilterConfig | RangeFilterConfig;

// ─── Filter value types ──────────────────────────────────────────────────────

export type CheckboxFilterValue = string[];
export type TextFilterValue = string;
export type RangeFilterValue = { min?: number; max?: number };
export type FilterValue = CheckboxFilterValue | TextFilterValue | RangeFilterValue;

// ─── Props ───────────────────────────────────────────────────────────────────

interface ColumnFilterProps {
  config: FilterConfig;
  value: FilterValue | undefined;
  onChange: (value: FilterValue | undefined) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ColumnFilter({ config, value, onChange }: ColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const isActive = value !== undefined && value !== '' &&
    !(Array.isArray(value) && value.length === 0) &&
    !(typeof value === 'object' && !Array.isArray(value) && value.min === undefined && value.max === undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded p-0.5 transition-colors hover:bg-slate-200 ${
            isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="סינון"
        >
          <ListFilter className={isActive ? 'size-3' : 'size-2.5'} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-44 p-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {config.type === 'checkbox' && (
          <CheckboxFilter
            options={config.options}
            value={(value as CheckboxFilterValue) ?? []}
            onChange={onChange}
          />
        )}
        {config.type === 'text' && (
          <TextFilter
            placeholder={config.placeholder}
            value={(value as TextFilterValue) ?? ''}
            onChange={onChange}
          />
        )}
        {config.type === 'range' && (
          <RangeFilter
            value={(value as RangeFilterValue) ?? {}}
            onChange={onChange}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── Checkbox multi-select filter ────────────────────────────────────────────

function CheckboxFilter({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (val: FilterValue | undefined) => void;
}) {
  const toggle = (optVal: string) => {
    const next = value.includes(optVal)
      ? value.filter((v) => v !== optVal)
      : [...value, optVal];
    onChange(next.length > 0 ? next : undefined);
  };

  return (
    <div className="space-y-1.5" dir="rtl">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-1.5 cursor-pointer text-xs hover:bg-slate-50 rounded px-1 py-0.5"
        >
          <Checkbox
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            className="size-3.5"
          />
          <span>{opt.label}</span>
        </label>
      ))}
      {value.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-6 text-xs text-slate-500 mt-1"
          onClick={() => onChange(undefined)}
        >
          <X className="size-3 ml-1" />
          נקה
        </Button>
      )}
    </div>
  );
}

// ─── Text search filter ──────────────────────────────────────────────────────

function TextFilter({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (val: FilterValue | undefined) => void;
}) {
  return (
    <div className="space-y-1.5" dir="rtl">
      <Input
        type="text"
        placeholder={placeholder ?? 'חיפוש...'}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v || undefined);
        }}
        className="h-7 text-xs"
        autoFocus
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-6 text-xs text-slate-500"
          onClick={() => onChange(undefined)}
        >
          <X className="size-3 ml-1" />
          נקה
        </Button>
      )}
    </div>
  );
}

// ─── Range (min/max) filter ──────────────────────────────────────────────────

function RangeFilter({
  value,
  onChange,
}: {
  value: RangeFilterValue;
  onChange: (val: FilterValue | undefined) => void;
}) {
  const update = (field: 'min' | 'max', raw: string) => {
    const num = raw === '' ? undefined : Number(raw);
    const next = { ...value, [field]: num };
    if (next.min === undefined && next.max === undefined) {
      onChange(undefined);
    } else {
      onChange(next);
    }
  };

  return (
    <div className="space-y-1.5" dir="rtl">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-slate-500 w-6">מ-</span>
        <Input
          type="number"
          placeholder="0"
          value={value.min ?? ''}
          onChange={(e) => update('min', e.target.value)}
          className="h-7 text-xs flex-1"
          min={0}
          max={100}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-slate-500 w-6">עד</span>
        <Input
          type="number"
          placeholder="100"
          value={value.max ?? ''}
          onChange={(e) => update('max', e.target.value)}
          className="h-7 text-xs flex-1"
          min={0}
          max={100}
        />
      </div>
      {(value.min !== undefined || value.max !== undefined) && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-6 text-xs text-slate-500 mt-1"
          onClick={() => onChange(undefined)}
        >
          <X className="size-3 ml-1" />
          נקה
        </Button>
      )}
    </div>
  );
}
