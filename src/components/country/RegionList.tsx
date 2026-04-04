import Link from 'next/link';
import type { Region, TravelComment, MonthlyData } from '@/types';

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const ratingConfig: Record<number, { label: string; color: string }> = {
  5: { label: '최적', color: 'bg-green-100 text-green-700' },
  4: { label: '좋음', color: 'bg-sky-100 text-sky-700' },
  3: { label: '보통', color: 'bg-yellow-100 text-yellow-700' },
  2: { label: '비추', color: 'bg-orange-100 text-orange-700' },
  1: { label: '부적합', color: 'bg-red-100 text-red-700' },
};

function getBestMonths(data: MonthlyData[]): number[] {
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
  return [...scored].sort((a, b) => b.score - a.score).slice(0, 3).map((s) => s.month);
}

interface RegionListProps {
  countryId: string;
  regions: Region[];
  comments?: TravelComment[];
}

export default function RegionList({ countryId, regions, comments = [] }: RegionListProps) {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {regions.map((region) => {
        const data = region.monthlyData[currentMonth - 1];
        const bestMonths = getBestMonths(region.monthlyData);
        const comment = comments.find(
          (c) => c.regionId === region.id && c.month === currentMonth
        );
        const rating = comment ? ratingConfig[comment.rating] : null;

        return (
          <Link
            key={region.id}
            href={`/country/${countryId}/${region.id}`}
            className="rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{region.name.ko}</h3>
                <p className="text-sm text-gray-500">{region.climateType}</p>
              </div>
              {rating && (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${rating.color}`}>
                  {currentMonth}월 {rating.label}
                </span>
              )}
            </div>

            {data && (
              <p className="mt-2 text-sm text-gray-600">
                {data.tempLow}°~{data.tempHigh}° · {data.weatherSummary}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-1">
              {bestMonths.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600"
                >
                  {MONTH_LABELS[m - 1]}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
