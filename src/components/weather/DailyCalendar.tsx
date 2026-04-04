'use client';

import { useState } from 'react';

const DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

export interface DayData {
  day: number;
  tempHigh: number;
  tempLow: number;
  rainfall: number;
  humidity: number;
}

interface CommentBadge {
  rating: number;
  summary: string;
}

interface DailyCalendarProps {
  days: DayData[];
  month: number;
  year: number;
  commentBadge?: CommentBadge;
}

const ratingColors: Record<number, string> = {
  5: 'bg-green-100 text-green-700',
  4: 'bg-sky-100 text-sky-700',
  3: 'bg-yellow-100 text-yellow-700',
  2: 'bg-orange-100 text-orange-700',
  1: 'bg-red-100 text-red-700',
};
const ratingLabels: Record<number, string> = {5:'최적',4:'좋음',3:'보통',2:'비추',1:'부적합'};

function cellBg(tempHigh: number, tempLow: number): string {
  const avg = (tempHigh + tempLow) / 2;
  if (avg >= 25) return 'bg-[#fff0f0]';
  if (avg >= 15) return 'bg-white';
  if (avg >= 5) return 'bg-[#eef8f5]';
  return 'bg-[#edf3fb]';
}

export default function DailyCalendar({ days, month, year, commentBadge }: DailyCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const dayMap = new Map(days.map((d) => [d.day, d]));
  const startDow = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();

  const cells: (DayData | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(dayMap.get(d) ?? null);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* 호버 정보 바 */}
      <div className="flex h-10 items-center">
        {hoveredDay ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-gray-50 px-4 py-2 text-sm">
            <span className="font-semibold text-gray-800">{month}/{hoveredDay.day}</span>
            <span>최고 <b className="text-rose-400">{hoveredDay.tempHigh}°</b></span>
            <span>최저 <b className="text-gray-500">{hoveredDay.tempLow}°</b></span>
            <span>강수 <b className="text-sky-500">{hoveredDay.rainfall}mm</b></span>
            <span>습도 <b className="text-teal-500">{hoveredDay.humidity}%</b></span>
          </div>
        ) : (
          <p className="text-xs text-gray-300">날짜에 마우스를 올려보세요</p>
        )}
      </div>

      {/* 범례 + 코멘트 */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-y-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400">
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
        </div>
        {commentBadge && (
          <div className="flex items-center gap-1.5">
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${ratingColors[commentBadge.rating] ?? ''}`}>
              {ratingLabels[commentBadge.rating]}
            </span>
            <span className="text-sm text-gray-600">{commentBadge.summary}</span>
          </div>
        )}
      </div>

      {/* 요일 헤더 */}
      <div className="mt-3 grid grid-cols-7">
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

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200">
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
              <div className={`text-[11px] ${
                dow === 0 ? 'text-rose-400' : dow === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {cell.day}
              </div>
              <div className="mt-2 leading-tight">
                <span className="text-[15px] font-semibold text-gray-800">{cell.tempHigh}°</span>
                <span className="ml-1 text-[12px] font-medium text-gray-400">{cell.tempLow}°</span>
              </div>
              {isRainy && (
                <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 text-blue-400/70">
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
    </div>
  );
}
