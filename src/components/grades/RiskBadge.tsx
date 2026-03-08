import type { RiskLevel } from '@/types';
import { getRiskBadgeStyle } from '@/lib/colors';

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const style = getRiskBadgeStyle(level);

  if (level === 1) {
    return (
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
        style={style}
      >
        &#10003;
      </span>
    );
  }

  if (level === 3) {
    return (
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold"
        style={style}
      >
        &#9888;{level}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold"
      style={style}
    >
      {level}
    </span>
  );
}
