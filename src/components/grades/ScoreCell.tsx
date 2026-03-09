import { getScoreCellStyle } from '@/lib/colors';
import { useConfig } from '@/contexts/ConfigContext';

interface ScoreCellProps {
  score: number | undefined | null;
}

export function ScoreCell({ score }: ScoreCellProps) {
  const { config } = useConfig();

  if (score === undefined || score === null) {
    return (
      <span className="text-slate-400 text-xs">—</span>
    );
  }

  const style = getScoreCellStyle(score, config.scoreColors);

  return (
    <span
      className="text-xs tabular-nums inline-block min-w-[28px] text-center"
      dir="ltr"
      style={style}
    >
      {score}
    </span>
  );
}
