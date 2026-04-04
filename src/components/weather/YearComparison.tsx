import type { DayData } from './DailyCalendar';

const YEARS = [2024, 2023, 2022];

interface YearComparisonProps {
  years: Record<string, DayData[]>;
  selectedYear: number;
}

export default function YearComparison({ years, selectedYear }: YearComparisonProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-[11px] text-gray-400">
            <th className="px-4 py-2.5 font-medium">연도</th>
            <th className="px-4 py-2.5 font-medium">평균 최고</th>
            <th className="px-4 py-2.5 font-medium">평균 최저</th>
            <th className="px-4 py-2.5 font-medium">강수량</th>
            <th className="px-4 py-2.5 font-medium">강수일</th>
            <th className="px-4 py-2.5 font-medium">습도</th>
          </tr>
        </thead>
        <tbody>
          {YEARS.map((y) => {
            const yd = years[String(y)] ?? [];
            if (yd.length === 0) return null;
            return (
              <tr
                key={y}
                className={`border-t border-gray-50 ${y === selectedYear ? 'bg-gray-50' : ''}`}
              >
                <td className="px-4 py-2 font-medium text-gray-700">{y}</td>
                <td className="px-4 py-2 text-gray-700">{(yd.reduce((s, d) => s + d.tempHigh, 0) / yd.length).toFixed(1)}°</td>
                <td className="px-4 py-2 text-gray-700">{(yd.reduce((s, d) => s + d.tempLow, 0) / yd.length).toFixed(1)}°</td>
                <td className="px-4 py-2 text-gray-700">{yd.reduce((s, d) => s + d.rainfall, 0).toFixed(0)}mm</td>
                <td className="px-4 py-2 text-gray-700">{yd.filter((d) => d.rainfall >= 1).length}일</td>
                <td className="px-4 py-2 text-gray-500">{(yd.reduce((s, d) => s + d.humidity, 0) / yd.length).toFixed(0)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
