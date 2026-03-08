import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  AlertTriangle,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  badge?: string;
  badgeVariant?: 'default' | 'destructive' | 'secondary' | 'outline';
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'לוח בקרה',
    path: '/',
  },
  {
    icon: GraduationCap,
    label: 'כיתות',
    children: Array.from({ length: 16 }, (_, i) => ({
      label: `יב ${i + 1}`,
      path: `/class/class-${i + 1}`,
    })),
  },
  {
    icon: Users,
    label: 'תלמידים',
    path: '/students',
  },
  {
    icon: BarChart3,
    label: 'דירוג',
    path: '/ranking',
  },
  {
    icon: AlertTriangle,
    label: 'תלמידים מאתגרים',
    path: '/at-risk',
    badge: '15',
    badgeVariant: 'destructive',
  },
  {
    icon: LineChart,
    label: 'אנליטיקה',
    path: '/analytics',
  },
  {
    icon: Settings,
    label: 'הגדרות',
    path: '/settings',
  },
];

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isChildActive = (children?: { path: string }[]) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.path);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.path) || isChildActive(item.children);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.label];

    const content = (
      <div key={item.label}>
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-slate-700/80 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-right">{item.label}</span>
                {isExpanded ? (
                  <ChevronUp className="size-4 shrink-0" />
                ) : (
                  <ChevronDown className="size-4 shrink-0" />
                )}
              </>
            )}
          </button>
        ) : (
          <Link
            to={item.path || '/'}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-slate-700/80 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-right">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || 'default'}
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        )}

        {/* Submenu */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 mr-4 space-y-0.5 border-r border-slate-700 pr-3">
            {item.children!.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className={cn(
                  'block rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  location.pathname === child.path
                    ? 'bg-slate-700/60 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="left" className="font-medium">
            {item.label}
            {item.badge && ` (${item.badge})`}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out will-change-[width]',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold">
          מ
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold leading-tight">מפת״ח</h1>
            <p className="text-[11px] text-slate-400">מערכת פיקוח תלמידים חכמה</p>
          </div>
        )}
      </div>

      <Separator className="bg-slate-700/50" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map(renderNavItem)}
      </nav>

      <Separator className="bg-slate-700/50" />

      {/* Collapse toggle */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="w-full text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {collapsed ? (
            <ChevronLeft className="size-5" />
          ) : (
            <ChevronRight className="size-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
