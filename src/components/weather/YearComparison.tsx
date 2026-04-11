'use client';

import type { DayData } from './DailyCalendar';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface YearComparisonProps {
  years: Record<string, DayData[]>;
  selectedYear: number;
}

export default function YearComparison({ years, selectedYear }: YearComparisonProps) {
  const YEARS = Object.keys(years).map(Number).sort((a, b) => b - a);
  const { locale } = useLocale();

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-3 font-medium">{t(messages.weather.yearCompYear, locale)}</th>
            <th className="px-4 py-3 font-medium">{t(messages.weather.yearCompAvgHigh, locale)}</th>
            <th className="px-4 py-3 font-medium">{t(messages.weather.yearCompAvgLow, locale)}</th>
            <th className="px-4 py-3 font-medium">{t(messages.weather.yearCompRainfall, locale)}</th>
            <th className="px-4 py-3 font-medium">{t(messages.weather.yearCompRainyDays, locale)}</th>
            <th className="px-4 py-3 font-medium">{t(messages.weather.yearCompHumidity, locale)}</th>
          </tr>
        </thead>
        <tbody>
          {YEARS.map((y) => {
            const yd = years[String(y)] ?? [];
            if (yd.length === 0) return null;
            return (
              <tr
                key={y}
                className={`border-t border-slate-100 ${y === selectedYear ? 'bg-sky-50/50' : ''}`}
              >
                <td className="px-4 py-3 font-medium text-gray-700">{y}</td>
                <td className="px-4 py-3 text-gray-700">{(yd.reduce((s, d) => s + d.tempHigh, 0) / yd.length).toFixed(1)}°</td>
                <td className="px-4 py-3 text-gray-700">{(yd.reduce((s, d) => s + d.tempLow, 0) / yd.length).toFixed(1)}°</td>
                <td className="px-4 py-3 text-gray-700">{yd.reduce((s, d) => s + d.rainfall, 0).toFixed(0)}mm</td>
                <td className="px-4 py-3 text-gray-700">{yd.filter((d) => d.rainfall >= 1).length}{t(messages.calendar.rainyDays, locale)}</td>
                <td className="px-4 py-3 text-gray-500">{(yd.reduce((s, d) => s + d.humidity, 0) / yd.length).toFixed(0)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
