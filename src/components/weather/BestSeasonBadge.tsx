'use client';

import type { MonthlyData } from '@/types';
import { getBestMonths } from '@/utils/scoring';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface BestSeasonBadgeProps {
  data: MonthlyData[];
  ratings?: number[];
}

export default function BestSeasonBadge({ data, ratings }: BestSeasonBadgeProps) {
  const { locale } = useLocale();
  const bestMonths = getBestMonths(data, 3, ratings);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-700">{t(messages.common.bestSeason, locale)}:</span>
      {bestMonths.map((m) => (
        <span
          key={m}
          className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700"
        >
          {t(messages.months[m as keyof typeof messages.months], locale)}
        </span>
      ))}
    </div>
  );
}
