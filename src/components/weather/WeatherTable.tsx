'use client';

import type { MonthlyData } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { resolveLocalizedString } from '@/utils/data';

interface WeatherTableProps {
  data: MonthlyData[];
  highlightMonth?: number;
}

export default function WeatherTable({ data, highlightMonth }: WeatherTableProps) {
  const { locale } = useLocale();

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableMonth, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableTempHigh, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableTempLow, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableRainfall, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableRainyDays, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableHumidity, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableSunshine, locale)}</th>
            <th className="px-3 py-2.5 font-medium">{t(messages.weather.tableSummary, locale)}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.month} className={`border-t border-slate-100 ${highlightMonth === d.month ? 'bg-sky-50' : i % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
              <td className="px-3 py-2.5 font-medium text-gray-900">{t(messages.months[d.month as keyof typeof messages.months], locale)}</td>
              <td className="px-3 py-2.5 text-rose-500 font-medium">{d.tempHigh}°</td>
              <td className="px-3 py-2.5 text-gray-500 font-medium">{d.tempLow}°</td>
              <td className="px-3 py-2.5">{d.rainfall}mm</td>
              <td className="px-3 py-2.5">{d.rainyDays}</td>
              <td className="px-3 py-2.5">{d.humidity}</td>
              <td className="px-3 py-2.5">{d.sunshineHours}</td>
              <td className="px-3 py-2.5 text-gray-600">{resolveLocalizedString(d.weatherSummary, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
