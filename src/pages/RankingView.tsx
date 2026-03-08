import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { getAllStudents, getClasses } from '@/data/mock-data';
import type { Student } from '@/types';
import { EligibilityStatus } from '@/types';
import { RiskBadge } from '@/components/grades/RiskBadge';
import { ScoreCell } from '@/components/grades/ScoreCell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

function getEligibilityBadge(status: string) {
  switch (status) {
    case EligibilityStatus.FULL_BAGRUT:
      return <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px]">זכאי</Badge>;
    case EligibilityStatus.FULL_DESPITE_MISSING:
      return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">זכאי*</Badge>;
    case EligibilityStatus.MISSING_1:
      return <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px]">חסר 1</Badge>;
    case EligibilityStatus.MISSING_2:
      return <Badge className="bg-orange-100 text-orange-800 border border-orange-300 text-[10px]">חסר 2</Badge>;
    case EligibilityStatus.MISSING_3:
      return <Badge className="bg-red-100 text-red-800 border border-red-300 text-[10px]">חסר 3</Badge>;
    case EligibilityStatus.MISSING_4_PLUS:
      return <Badge className="bg-red-200 text-red-900 border border-red-400 text-[10px]">חסר 4+</Badge>;
    case EligibilityStatus.NON_MATRICULATION:
      return <Badge className="bg-red-200 text-red-900 border border-red-400 text-[10px]">לא זכאי</Badge>;
    case EligibilityStatus.PARTIAL:
      return <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px]">חלקי</Badge>;
    default:
      return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
  }
}

interface RankedStudent extends Student {
  rank: number;
  className: string;
}

const columnHelper = createColumnHelper<RankedStudent>();

export function RankingView() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'weightedAverage', desc: true },
  ]);
  const [searchText, setSearchText] = useState('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const classes = getClasses();
  const allStudents = getAllStudents();

  // Pre-compute ranked data
  const rankedStudents = useMemo(() => {
    const classMap = new Map(classes.map((c) => [c.id, c.displayName]));
    const sorted = [...allStudents].sort(
      (a, b) => b.weightedAverage - a.weightedAverage
    );
    return sorted.map((s, idx) => ({
      ...s,
      rank: idx + 1,
      className: classMap.get(s.classId) ?? s.classId,
    }));
  }, [allStudents, classes]);

  // Filtered data
  const filteredData = useMemo(() => {
    let data = rankedStudents;

    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      data = data.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
          s.studentNumber.toString().includes(query)
      );
    }

    if (classFilter !== 'all') {
      data = data.filter((s) => s.classId === classFilter);
    }

    if (riskFilter !== 'all') {
      data = data.filter((s) => s.riskLevel === Number(riskFilter));
    }

    return data;
  }, [rankedStudents, searchText, classFilter, riskFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('rank', {
        header: '#',
        cell: (info) => (
          <span className="text-xs text-muted-foreground tabular-nums">
            {info.getValue()}
          </span>
        ),
        size: 50,
      }),
      columnHelper.accessor('className', {
        header: 'כיתה',
        cell: (info) => (
          <Badge variant="secondary" className="text-[10px]">
            {info.getValue()}
          </Badge>
        ),
        size: 70,
      }),
      columnHelper.accessor('studentNumber', {
        header: 'מספר',
        cell: (info) => (
          <span className="text-xs tabular-nums text-muted-foreground">
            {info.getValue()}
          </span>
        ),
        size: 60,
      }),
      columnHelper.display({
        id: 'fullName',
        header: 'שם תלמיד/ה',
        cell: ({ row }) => (
          <Link
            to={`/student/${row.original.id}`}
            className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline transition-colors"
          >
            {row.original.firstName} {row.original.lastName}
          </Link>
        ),
        size: 150,
      }),
      columnHelper.accessor('mathUnitLevel', {
        header: 'מתמטיקה',
        cell: (info) => (
          <span className="text-xs tabular-nums">{info.getValue()} יח&quot;ל</span>
        ),
        size: 80,
      }),
      columnHelper.accessor('englishUnitLevel', {
        header: 'אנגלית',
        cell: (info) => (
          <span className="text-xs tabular-nums">{info.getValue()} יח&quot;ל</span>
        ),
        size: 80,
      }),
      columnHelper.accessor('weightedAverage', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium hover:text-blue-700 transition-colors"
            onClick={() => column.toggleSorting()}
          >
            ממוצע משוקלל
            <ArrowUpDown className={`h-3 w-3 ${column.getIsSorted() ? 'text-blue-600' : 'text-slate-400'}`} />
          </button>
        ),
        cell: (info) => (
          <span className="font-bold">
            <ScoreCell score={Math.round(info.getValue())} />
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('eligibilityStatus', {
        header: 'זכאות',
        cell: (info) => getEligibilityBadge(info.getValue()),
        size: 80,
      }),
      columnHelper.accessor('riskLevel', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium hover:text-blue-700 transition-colors"
            onClick={() => column.toggleSorting()}
          >
            צפי
            <ArrowUpDown className={`h-3 w-3 ${column.getIsSorted() ? 'text-blue-600' : 'text-slate-400'}`} />
          </button>
        ),
        cell: (info) => <RiskBadge level={info.getValue()} />,
        size: 60,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div dir="rtl" className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">דירוג כלל בית ספרי</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          דירוג כלל התלמידים לפי ממוצע משוקלל &middot;{' '}
          {filteredData.length} מתוך {allStudents.length} תלמידים
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-white/50 p-3">
        <Input
          placeholder="חיפוש לפי שם..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-[200px]"
        />

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="כל הכיתות" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">כל הכיתות</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.displayName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="כל הרמות" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">כל הרמות</SelectItem>
              <SelectItem value="1">רמה 1</SelectItem>
              <SelectItem value="2">רמה 2</SelectItem>
              <SelectItem value="3">רמה 3</SelectItem>
              <SelectItem value="4">רמה 4</SelectItem>
              <SelectItem value="5">רמה 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="mr-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-1" />
                ייצוא
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileSpreadsheet className="h-4 w-4 ml-2" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 ml-2" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown className="h-4 w-4 ml-2" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="rounded-xl border bg-card ring-1 ring-foreground/10 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-right">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  לא נמצאו תלמידים התואמים את הסינון
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow key={row.id} className={`transition-colors hover:bg-blue-50/40 ${idx % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
