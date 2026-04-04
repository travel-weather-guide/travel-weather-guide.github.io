'use client';

import type { MonthlyData } from '@/types';
import { getBestMonths } from '@/utils/scoring';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface BestSeasonBadgeProps {
  data: MonthlyData[];
  ratings?: number[];
}

/** 여행 점수가 가장 높은 월 2~3개를 베스트 시즌으로 표시 */
export default function BestSeasonBadge({ data, ratings }: BestSeasonBadgeProps) {
  const { locale } = useLocale();
  const bestMonths = getBestMonths(data, 3, ratings);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">{t(messages.common.bestSeason, locale)}:</span>
      {bestMonths.map((m) => (
        <span
          key={m}
          className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
        >
          {t(messages.months[m as keyof typeof messages.months], locale)}
        </span>
      ))}
    </div>
  );
}
