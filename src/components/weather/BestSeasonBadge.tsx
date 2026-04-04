import type { MonthlyData } from '@/types';
import { getBestMonths } from '@/utils/scoring';

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

interface BestSeasonBadgeProps {
  data: MonthlyData[];
  ratings?: number[];
}

/** 여행 점수가 가장 높은 월 2~3개를 베스트 시즌으로 표시 */
export default function BestSeasonBadge({ data, ratings }: BestSeasonBadgeProps) {
  const bestMonths = getBestMonths(data, 3, ratings);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">베스트 시즌:</span>
      {bestMonths.map((m) => (
        <span
          key={m}
          className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
        >
          {MONTH_LABELS[m - 1]}
        </span>
      ))}
    </div>
  );
}
