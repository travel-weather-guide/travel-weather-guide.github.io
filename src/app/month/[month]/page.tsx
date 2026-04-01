'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import daily1 from '@/data/daily/1.json';
import daily2 from '@/data/daily/2.json';
import daily3 from '@/data/daily/3.json';
import daily4 from '@/data/daily/4.json';
import daily5 from '@/data/daily/5.json';
import daily6 from '@/data/daily/6.json';
import daily7 from '@/data/daily/7.json';
import daily8 from '@/data/daily/8.json';
import daily9 from '@/data/daily/9.json';
import daily10 from '@/data/daily/10.json';
import daily11 from '@/data/daily/11.json';
import daily12 from '@/data/daily/12.json';

const dailyFiles = [daily1, daily2, daily3, daily4, daily5, daily6, daily7, daily8, daily9, daily10, daily11, daily12];

const YEARS = [2024, 2023, 2022];
const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

interface DayData {
  day: number;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  humidity: number;
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/** 평균 기온 기반 셀 배경 — 베이비 파스텔 */
function cellBg(tempHigh: number, tempLow: number): string {
  const avg = (tempHigh + tempLow) / 2;
  if (avg >= 25) return 'bg-[#fff0f0]';
  if (avg >= 15) return 'bg-white';
  if (avg >= 5) return 'bg-[#eef8f5]';
  return 'bg-[#edf3fb]';
}

export default function MonthlyDailyPage() {
  const params = useParams<{ month: string }>();
  const month = parseInt(params.month);

  if (month < 1 || month > 12 || isNaN(month)) {
    return <p className="p-8 text-center text-gray-500">유효하지 않은 월입니다.</p>;
  }

  const data = dailyFiles[month - 1];
  const [selectedRegion, setSelectedRegion] = useState(data.regions[0]?.regionId ?? '');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const region = data.regions.find((r) => r.regionId === selectedRegion);
  const days = (region?.years[String(selectedYear) as unknown as keyof typeof region.years] ?? []) as DayData[];
  const dayMap = new Map(days.map((d) => [d.day, d]));

  const startDow = getStartDayOfWeek(selectedYear, month);
  const totalDays = new Date(selectedYear, month, 0).getDate();

  const cells: (DayData | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(dayMap.get(d) ?? null);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = month === 1 ? 12 : month - 1;
  const nextMonth = month === 12 ? 1 : month + 1;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* 헤더: 월 네비게이션 */}
      <div className="flex items-center justify-between">
        <Link href={`/month/${prevMonth}`} className="text-sm text-gray-400 hover:text-gray-700">
          ← {MONTH_LABELS[prevMonth - 1]}
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">
          {selectedYear}년 {MONTH_LABELS[month - 1]}
        </h1>
        <Link href={`/month/${nextMonth}`} className="text-sm text-gray-400 hover:text-gray-700">
          {MONTH_LABELS[nextMonth - 1]} →
        </Link>
      </div>

      {/* 지역 + 연도 */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {data.regions.map((r) => (
            <button
              key={r.regionId}
              onClick={() => setSelectedRegion(r.regionId)}
              className={`rounded-md px-2.5 py-1 text-[13px] transition-all ${
                selectedRegion === r.regionId
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {r.regionName.ko}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`rounded-md px-2.5 py-1 text-[13px] transition-all ${
                selectedYear === y
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* 호버 정보 바 */}
      <div className="mt-4 flex h-10 items-center">
        {hoveredDay ? (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-2 text-sm">
            <span className="font-semibold text-gray-800">{month}/{hoveredDay.day}</span>
            <span>최고 <b className="text-rose-400">{hoveredDay.tempHigh}°</b></span>
            <span>최저 <b className="text-blue-400">{hoveredDay.tempLow}°</b></span>
            <span>강수 <b className="text-sky-500">{hoveredDay.rainfall}mm</b></span>
            <span>습도 <b className="text-teal-500">{hoveredDay.humidity}%</b></span>
          </div>
        ) : (
          <p className="text-xs text-gray-300">날짜에 마우스를 올려보세요</p>
        )}
      </div>

      {/* 범례 */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
        <span className="font-medium text-gray-500">배경색 = 평균기온</span>
        {[
          { label: '더움 25°+', bg: 'bg-[#fff0f0]' },
          { label: '온화 15~25°', bg: 'bg-white border' },
          { label: '선선 5~15°', bg: 'bg-[#eef8f5]' },
          { label: '추움 5°↓', bg: 'bg-[#edf3fb]' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1">
            <span className={`inline-block h-3 w-3 rounded-sm border border-gray-200 ${item.bg}`} />
            {item.label}
          </span>
        ))}
        <span className="ml-2 flex items-center gap-1 text-blue-400/70">
          <svg className="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 10 4 14.5 4 17a8 8 0 1 0 16 0c0-2.5-2.5-7-8-15z" />
          </svg>
          강수량(mm)
        </span>
      </div>

      {/* 캘린더 */}
      {region && (
        <div className="mt-2">
          {/* 요일 */}
          <div className="grid grid-cols-7">
            {DAY_HEADERS.map((d, i) => (
              <div
                key={d}
                className={`pb-2 text-center text-[11px] font-medium tracking-widest ${
                  i === 0 ? 'text-rose-300' : i === 6 ? 'text-blue-300' : 'text-gray-300'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 셀 */}
          <div className="grid grid-cols-7 gap-px rounded-xl border border-gray-200 bg-gray-200 overflow-hidden">
            {cells.map((cell, i) => {
              if (!cell) {
                return <div key={`e-${i}`} className="min-h-[88px] bg-gray-50" />;
              }

              const dow = i % 7;
              const isRainy = cell.rainfall >= 1;

              return (
                <div
                  key={cell.day}
                  onMouseEnter={() => setHoveredDay(cell)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`relative min-h-[88px] p-2 transition-colors hover:bg-white ${cellBg(cell.tempHigh, cell.tempLow)}`}
                >
                  {/* 날짜 */}
                  <div className={`text-[11px] ${
                    dow === 0 ? 'text-rose-400' : dow === 6 ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {cell.day}
                  </div>

                  {/* 기온 */}
                  <div className="mt-2 leading-tight">
                    <span className="text-[15px] font-semibold text-gray-800">{cell.tempHigh}°</span>
                    <span className="ml-1 text-[12px] font-medium text-blue-400/80">{cell.tempLow}°</span>
                  </div>

                  {/* 강수 — 우상단 */}
                  {isRainy && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-blue-400/70">
                      <svg className="h-[10px] w-[10px]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.5 10 4 14.5 4 17a8 8 0 1 0 16 0c0-2.5-2.5-7-8-15z" />
                      </svg>
                      <span className="text-[9px] font-medium">{cell.rainfall}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 요약 */}
      {days.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-center text-sm">
          <div>
            <p className="text-gray-400">평균 기온</p>
            <p className="mt-0.5 text-lg font-semibold text-gray-800">
              {(days.reduce((s, d) => s + d.tempHigh, 0) / days.length).toFixed(1)}° / {(days.reduce((s, d) => s + d.tempLow, 0) / days.length).toFixed(1)}°
            </p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-gray-400">강수</p>
            <p className="mt-0.5 text-lg font-semibold text-gray-800">
              {days.reduce((s, d) => s + d.rainfall, 0).toFixed(0)}mm · {days.filter((d) => d.rainfall >= 1).length}일
            </p>
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <p className="text-gray-400">최고 / 최저</p>
            <p className="mt-0.5 text-lg font-semibold text-gray-800">
              {Math.max(...days.map((d) => d.tempHigh))}° / {Math.min(...days.map((d) => d.tempLow))}°
            </p>
          </div>
        </div>
      )}

      {/* 연도 비교 */}
      {region && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 tracking-wide">연도별 비교</h2>
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
                  const yd = (region.years[String(y) as unknown as keyof typeof region.years] ?? []) as DayData[];
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
        </section>
      )}
    </main>
  );
}
