'use client';

import { useState } from 'react';
import type { Region, TravelComment } from '@/types';
import type { DayData } from '@/components/weather/DailyCalendar';

import WeatherChart from '@/components/weather/WeatherChart';
import WeatherTable from '@/components/weather/WeatherTable';
import BestSeasonBadge from '@/components/weather/BestSeasonBadge';
import TravelRating from '@/components/travel/TravelRating';
import DailyCalendar from '@/components/weather/DailyCalendar';
import YearComparison from '@/components/weather/YearComparison';
import MonthSelector from '@/components/common/MonthSelector';
import TravelTips from '@/components/travel/TravelTips';

interface RegionDailyMonth {
  years: Record<string, DayData[]>;
}

interface RegionTabsProps {
  region: Region;
  comments: TravelComment[];
  dailyData: Record<number, RegionDailyMonth>;
}

const TABS = [
  { id: 'calendar', label: '일별 캘린더' },
  { id: 'overview', label: '월별 개요' },
  { id: 'guide', label: '여행 가이드' },
] as const;

type TabId = typeof TABS[number]['id'];

const YEARS = [2024, 2023, 2022];

export default function RegionTabs({ region, comments, dailyData }: RegionTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const currentMonth = new Date().getMonth() + 1;
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  const [calendarYear, setCalendarYear] = useState(2024);
  const [guideMonth, setGuideMonth] = useState(currentMonth);

  return (
    <div>
      {/* 탭 바 */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-sky-500 text-sky-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <OverviewTab region={region} comments={comments} />
        )}
        {activeTab === 'calendar' && (
          <CalendarTab
            dailyData={dailyData}
            comments={comments}
            month={calendarMonth}
            year={calendarYear}
            onMonthChange={setCalendarMonth}
            onYearChange={setCalendarYear}
          />
        )}
        {activeTab === 'guide' && (
          <GuideTab
            comments={comments}
            month={guideMonth}
            onMonthChange={setGuideMonth}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ region, comments }: { region: Region; comments: TravelComment[] }) {
  return (
    <div className="space-y-8">
      <BestSeasonBadge data={region.monthlyData} ratings={comments.map((c) => c.rating)} />
      <WeatherChart data={region.monthlyData} />
      <WeatherTable data={region.monthlyData} />
      {comments.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-900">월별 여행 적합도</h3>
          <div className="space-y-2">
            {comments.map((c) => (
              <TravelRating key={c.month} month={c.month} rating={c.rating} summary={c.summary} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarTab({
  dailyData,
  comments,
  month,
  year,
  onMonthChange,
  onYearChange,
}: {
  dailyData: Record<number, RegionDailyMonth>;
  comments: TravelComment[];
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
}) {
  const monthData = dailyData[month];
  const days = (monthData?.years[String(year)] ?? []) as DayData[];
  const comment = comments.find((c) => c.month === month);

  const ratingColors: Record<number, string> = {
    5: 'bg-green-100 text-green-700',
    4: 'bg-sky-100 text-sky-700',
    3: 'bg-yellow-100 text-yellow-700',
    2: 'bg-orange-100 text-orange-700',
    1: 'bg-red-100 text-red-700',
  };
  const ratingLabels: Record<number, string> = {5:'최적',4:'좋음',3:'보통',2:'비추',1:'부적합'};

  return (
    <div className="space-y-4">
      <MonthSelector selected={month} onChange={onMonthChange} />

      <div className="flex gap-1">
        {YEARS.map((y) => (
          <button
            key={y}
            onClick={() => onYearChange(y)}
            className={`rounded-md px-2.5 py-1 text-[13px] transition-all ${
              year === y
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {days.length > 0 ? (
        <>
          <DailyCalendar
            days={days}
            month={month}
            year={year}
            commentBadge={comment ? { rating: comment.rating, summary: comment.summary } : undefined}
          />
          {monthData && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500">연도별 비교</h3>
              <YearComparison years={monthData.years} selectedYear={year} />
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-gray-400">해당 기간의 데이터가 없습니다.</p>
      )}
    </div>
  );
}

function GuideTab({
  comments,
  month,
  onMonthChange,
}: {
  comments: TravelComment[];
  month: number;
  onMonthChange: (m: number) => void;
}) {
  const comment = comments.find((c) => c.month === month);

  return (
    <div className="space-y-4">
      <MonthSelector selected={month} onChange={onMonthChange} />

      {comment ? (
        <div className="space-y-4">
          <TravelRating month={comment.month} rating={comment.rating} summary={comment.summary} />
          <TravelTips comment={comment} />
        </div>
      ) : (
        <p className="py-12 text-center text-gray-400">{month}월 여행 정보가 아직 없습니다.</p>
      )}
    </div>
  );
}
