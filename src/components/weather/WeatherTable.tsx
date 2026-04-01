import type { MonthlyData } from '@/types';

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

interface WeatherTableProps {
  data: MonthlyData[];
}

export default function WeatherTable({ data }: WeatherTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-gray-500">
            <th className="px-2 py-2 font-medium">월</th>
            <th className="px-2 py-2 font-medium">최고°C</th>
            <th className="px-2 py-2 font-medium">최저°C</th>
            <th className="px-2 py-2 font-medium">강수mm</th>
            <th className="px-2 py-2 font-medium">강수일</th>
            <th className="px-2 py-2 font-medium">습도%</th>
            <th className="px-2 py-2 font-medium">일조h</th>
            <th className="px-2 py-2 font-medium">요약</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.month} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-2 py-2 font-medium text-gray-900">{MONTH_LABELS[i]}</td>
              <td className="px-2 py-2 text-red-500">{d.tempHigh}</td>
              <td className="px-2 py-2 text-blue-500">{d.tempLow}</td>
              <td className="px-2 py-2">{d.rainfall}</td>
              <td className="px-2 py-2">{d.rainyDays}</td>
              <td className="px-2 py-2">{d.humidity}</td>
              <td className="px-2 py-2">{d.sunshineHours}</td>
              <td className="px-2 py-2 text-gray-600">{d.weatherSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
