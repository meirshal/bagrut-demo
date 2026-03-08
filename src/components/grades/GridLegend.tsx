import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { ExcellenceBadge } from './ExcellenceBadge';
import { ExcellenceTier, RiskLevel } from '@/types';
import { BG_COLORS, SCORE_COLORS } from '@/lib/colors';

export function GridLegend() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm" dir="rtl">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors rounded-lg"
      >
        {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        מקרא
      </button>

      {open && (
        <div className="px-3 pb-3 pt-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-[11px] border-t border-slate-100">
          {/* Risk levels */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700">צפי (סיכון)</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <RiskBadge level={RiskLevel.LEVEL_1} />
                <span className="text-slate-600">תקין - במסלול</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RiskBadge level={RiskLevel.LEVEL_2} />
                <span className="text-slate-600">סיכון</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RiskBadge level={RiskLevel.LEVEL_3} />
                <span className="text-slate-600">סיכון גבוה</span>
              </div>
            </div>
          </div>

          {/* Excellence tiers */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700">מצ (הצטיינות)</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <ExcellenceBadge tier={ExcellenceTier.ALEPH} />
                <span className="text-slate-600">מצויינות 1-א (96+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ExcellenceBadge tier={ExcellenceTier.BET} />
                <span className="text-slate-600">מצויינות 1-ב (90+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ExcellenceBadge tier={ExcellenceTier.GIMEL} />
                <span className="text-slate-600">מצויינות 1-ג (85+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ExcellenceBadge tier={ExcellenceTier.BORDER_GIMEL} />
                <span className="text-slate-600">גבול מצויינות (81-84)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ExcellenceBadge tier={ExcellenceTier.NONE} />
                <span className="text-slate-600">ללא הצטיינות</span>
              </div>
            </div>
          </div>

          {/* Score colors */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700">צבעי ציונים</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-bold" style={{ color: SCORE_COLORS.failing }}>42</span>
                <span className="text-slate-600">נכשל (&lt;55)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-bold" style={{ color: SCORE_COLORS.excellence }}>95</span>
                <span className="text-slate-600">מצטיין (90+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-bold" style={{ backgroundColor: SCORE_COLORS.borderline54, color: SCORE_COLORS.failing }}>54</span>
                <span className="text-slate-600">גבולי (54)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-bold" style={{ backgroundColor: SCORE_COLORS.borderline52, color: SCORE_COLORS.failing }}>52</span>
                <span className="text-slate-600">גבולי (52-53)</span>
              </div>
            </div>
          </div>

          {/* Column colors */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700">צבעי עמודות</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-4 rounded border border-slate-200" style={{ backgroundColor: '#f0f4ff' }} />
                <span className="text-slate-600">שאלון / מודול</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-4 rounded border border-slate-200" style={{ backgroundColor: BG_COLORS.componentInternal + '33' }} />
                <span className="text-slate-600">ציון פנימי</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-4 rounded border border-slate-200" style={{ backgroundColor: BG_COLORS.componentExternal + '22' }} />
                <span className="text-slate-600">ציון חיצוני</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-4 rounded border border-slate-200" style={{ backgroundColor: '#e8f5e9' }} />
                <span className="text-slate-600">ציון סופי</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-4 rounded border border-slate-200" style={{ backgroundColor: '#f5f0ff' }} />
                <span className="text-slate-600">עובר / נכשל</span>
              </div>
            </div>
          </div>

          {/* Accommodations */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700">הת (התאמות)</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-purple-700 font-bold">מות</span>
                <span className="text-slate-600">מותאם</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-purple-700 font-bold">הכת</span>
                <span className="text-slate-600">הכתבה</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-purple-700 font-bold">בע"פ</span>
                <span className="text-slate-600">בחינה בעל-פה</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-purple-700 font-bold">ע"ח</span>
                <span className="text-slate-600">התאמות מיוחדות</span>
              </div>
            </div>
          </div>

          {/* Pass/Fail */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-700">עובר / נכשל</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-green-700">V</span>
                <span className="text-slate-600">עובר</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-red-600">X</span>
                <span className="text-slate-600">נכשל</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
