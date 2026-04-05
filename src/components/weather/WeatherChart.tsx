'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { MonthlyData } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface WeatherChartProps {
  data: MonthlyData[];
}

function CustomTooltip({ active, payload, label, locale }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string; locale: 'ko' | 'en' | 'ja' | 'zh' }) {
  if (!active || !payload?.length) return null;

  const temp = payload.find(p => p.dataKey === 'tempHigh');
  const tempLow = payload.find(p => p.dataKey === 'tempLow');
  const rain = payload.find(p => p.dataKey === 'rainfall');

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{label}</p>
      {temp && <p className="text-red-500">{t(messages.weather.tooltipTempHigh, locale)} {temp.value}°C</p>}
      {tempLow && <p className="text-gray-500">{t(messages.weather.tooltipTempLow, locale)} {tempLow.value}°C</p>}
      {rain && <p className="text-sky-400">{t(messages.weather.tooltipRainfall, locale)} {rain.value}mm</p>}
    </div>
  );
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const { locale } = useLocale();

  const chartData = data.map((d) => ({
    name: t(messages.months[d.month as keyof typeof messages.months], locale),
    tempHigh: d.tempHigh,
    tempLow: d.tempLow,
    rainfall: d.rainfall,
  }));

  const maxRainfall = Math.max(...data.map(d => d.rainfall));
  const maxTemp = Math.max(...data.map(d => d.tempHigh));
  const minTemp = Math.min(...data.map(d => d.tempLow));

  const rainDomain = [0, Math.ceil(maxRainfall / 50) * 50 + 50];
  const tempDomain = [Math.floor(minTemp / 5) * 5 - 5, Math.ceil(maxTemp / 5) * 5 + 5];

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            yAxisId="temp"
            orientation="left"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            domain={tempDomain}
            unit="°"
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            domain={rainDomain}
            unit="mm"
          />
          <Tooltip content={<CustomTooltip locale={locale} />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
          />
          <Bar
            yAxisId="rain"
            dataKey="rainfall"
            name={t(messages.weather.chartRainfall, locale)}
            fill="#7dd3fc"
            opacity={0.5}
            radius={[3, 3, 0, 0]}
            barSize={20}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempHigh"
            name={t(messages.weather.chartTempHigh, locale)}
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ef4444' }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempLow"
            name={t(messages.weather.chartTempLow, locale)}
            stroke="#6b7280"
            strokeWidth={2}
            dot={{ r: 3, fill: '#3b82f6' }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
