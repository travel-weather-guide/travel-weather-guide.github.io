import type { MonthlyData } from '@/types';

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

interface BestSeasonBadgeProps {
  data: MonthlyData[];
}

/** 여행 점수가 가장 높은 월 2~3개를 베스트 시즌으로 표시 */
export default function BestSeasonBadge({ data }: BestSeasonBadgeProps) {
  const scored = data.map((d) => {
    const avgTemp = (d.tempHigh + d.tempLow) / 2;
    let score = 0;
    if (avgTemp >= 18 && avgTemp <= 28) score += 30;
    else if (avgTemp >= 10 && avgTemp <= 35) score += 15;
    if (d.rainfall < 50) score += 30;
    else if (d.rainfall < 100) score += 20;
    if (d.sunshineHours > 8) score += 20;
    else if (d.sunshineHours > 5) score += 10;
    return { month: d.month, score };
  });

  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const bestMonths = sorted.slice(0, 3).map((s) => s.month);

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
