import { ExcellenceTier } from '@/types';
import { getExcellenceBadgeStyle } from '@/lib/colors';

const TIER_LABELS: Record<ExcellenceTier, string> = {
  [ExcellenceTier.ALEPH]: 'א',
  [ExcellenceTier.BET]: 'ב',
  [ExcellenceTier.GIMEL]: 'ג',
  [ExcellenceTier.BORDER_BET]: 'ב?',
  [ExcellenceTier.BORDER_GIMEL]: 'ג?',
  [ExcellenceTier.NONE]: '—',
};

const TIER_TITLES: Record<ExcellenceTier, string> = {
  [ExcellenceTier.ALEPH]: 'מצויינות 1-א (ממוצע 96+)',
  [ExcellenceTier.BET]: 'מצויינות 1-ב (ממוצע 90+)',
  [ExcellenceTier.GIMEL]: 'מצויינות 1-ג (ממוצע 85+)',
  [ExcellenceTier.BORDER_BET]: 'גבול מצויינות 1-ב (ממוצע 86-89)',
  [ExcellenceTier.BORDER_GIMEL]: 'גבול מצויינות 1-ג (ממוצע 81-84)',
  [ExcellenceTier.NONE]: 'ללא הצטיינות',
};

interface ExcellenceBadgeProps {
  tier: ExcellenceTier;
}

export function ExcellenceBadge({ tier }: ExcellenceBadgeProps) {
  if (tier === ExcellenceTier.NONE) {
    return <span className="text-[10px] text-slate-300">—</span>;
  }

  const style = getExcellenceBadgeStyle(tier);
  const isBorder = tier === ExcellenceTier.BORDER_BET || tier === ExcellenceTier.BORDER_GIMEL;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-5 h-5 rounded px-0.5 text-[10px] font-bold ${isBorder ? 'opacity-80' : ''}`}
      style={style}
      title={TIER_TITLES[tier]}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
