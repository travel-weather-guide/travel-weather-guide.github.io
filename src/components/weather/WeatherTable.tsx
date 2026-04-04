'use client';

import type { MonthlyData } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { resolveLocalizedString } from '@/utils/data';

interface WeatherTableProps {
  data: MonthlyData[];
}

export default function WeatherTable({ data }: WeatherTableProps) {
  const { locale } = useLocale();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-gray-500">
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableMonth, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableTempHigh, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableTempLow, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableRainfall, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableRainyDays, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableHumidity, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableSunshine, locale)}</th>
            <th className="px-2 py-2 font-medium">{t(messages.weather.tableSummary, locale)}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.month} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="px-2 py-2 font-medium text-gray-900">{t(messages.months[d.month as keyof typeof messages.months], locale)}</td>
              <td className="px-2 py-2 text-red-500">{d.tempHigh}</td>
              <td className="px-2 py-2 text-gray-500">{d.tempLow}</td>
              <td className="px-2 py-2">{d.rainfall}</td>
              <td className="px-2 py-2">{d.rainyDays}</td>
              <td className="px-2 py-2">{d.humidity}</td>
              <td className="px-2 py-2">{d.sunshineHours}</td>
              <td className="px-2 py-2 text-gray-600">{resolveLocalizedString(d.weatherSummary, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
