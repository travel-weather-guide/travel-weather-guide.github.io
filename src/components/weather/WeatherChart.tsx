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

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

interface WeatherChartProps {
  data: MonthlyData[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  const temp = payload.find(p => p.dataKey === 'tempHigh');
  const tempLow = payload.find(p => p.dataKey === 'tempLow');
  const rain = payload.find(p => p.dataKey === 'rainfall');

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-gray-900">{label}</p>
      {temp && <p className="text-red-500">최고 {temp.value}°C</p>}
      {tempLow && <p className="text-gray-500">최저 {tempLow.value}°C</p>}
      {rain && <p className="text-sky-400">강수량 {rain.value}mm</p>}
    </div>
  );
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const chartData = data.map((d, i) => ({
    name: MONTH_LABELS[i],
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
    <div className="h-[300px] w-full sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar
            yAxisId="rain"
            dataKey="rainfall"
            name="강수량"
            fill="#7dd3fc"
            opacity={0.5}
            radius={[3, 3, 0, 0]}
            barSize={20}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempHigh"
            name="최고기온"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ef4444' }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="tempLow"
            name="최저기온"
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
