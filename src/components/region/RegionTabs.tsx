'use client';

import { useState, useEffect } from 'react';
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
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { resolveLocalizedString } from '@/utils/data';

interface RegionDailyMonth {
  years: Record<string, DayData[]>;
}

interface RegionTabsProps {
  region: Region;
  comments: TravelComment[];
  dailyData: Record<number, RegionDailyMonth>;
}

type TabId = 'calendar' | 'overview' | 'guide';

function getAvailableYears(dailyData: Record<number, RegionDailyMonth>): number[] {
  const yearSet = new Set<number>();
  for (const monthKey of Object.keys(dailyData)) {
    const monthData = dailyData[Number(monthKey)];
    if (monthData?.years) {
      for (const y of Object.keys(monthData.years)) yearSet.add(Number(y));
    }
  }
  return [...yearSet].sort((a, b) => b - a);
}

function getDefaultYear(dailyData: Record<number, RegionDailyMonth>, month: number, years: number[]): number {
  for (const y of years) {
    const days = dailyData[month]?.years?.[String(y)];
    if (days && (days as unknown[]).length > 0) return y;
  }
  return years[0] ?? 2025;
}

export default function RegionTabs({ region, comments, dailyData }: RegionTabsProps) {
  const { locale } = useLocale();
  const YEARS = getAvailableYears(dailyData);
  const initMonth = new Date().getMonth() + 1;
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const [calendarMonth, setCalendarMonth] = useState(1);
  const [calendarYear, setCalendarYear] = useState(() => getDefaultYear(dailyData, initMonth, YEARS));
  const [guideMonth, setGuideMonth] = useState(1);
  useEffect(() => {
    const m = new Date().getMonth() + 1;
    setCalendarMonth(m);
    setGuideMonth(m);
  }, []);

  const TABS = [
    { id: 'calendar' as TabId, label: t(messages.region.tabCalendar, locale) },
    { id: 'overview' as TabId, label: t(messages.region.tabOverview, locale) },
    { id: 'guide' as TabId, label: t(messages.region.tabGuide, locale) },
  ];

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
  const { locale } = useLocale();

  return (
    <div className="space-y-8">
      <BestSeasonBadge data={region.monthlyData} ratings={comments.map((c) => c.rating)} />
      <WeatherChart data={region.monthlyData} />
      <WeatherTable data={region.monthlyData} />
      {comments.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-bold text-gray-900">{t(messages.region.monthlyRating, locale)}</h3>
          <div className="space-y-2">
            {comments.map((c) => (
              <TravelRating key={c.month} month={c.month} rating={c.rating} summary={resolveLocalizedString(c.summary, locale)} />
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
  const { locale } = useLocale();
  const YEARS = getAvailableYears(dailyData);
  const monthData = dailyData[month];
  const days = (monthData?.years[String(year)] ?? []) as DayData[];
  const comment = comments.find((c) => c.month === month);

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
            commentBadge={comment ? { rating: comment.rating, summary: resolveLocalizedString(comment.summary, locale) } : undefined}
          />
          {monthData && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500">{t(messages.calendar.yearComparison, locale)}</h3>
              <YearComparison years={monthData.years} selectedYear={year} />
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-gray-400">{t(messages.common.noData, locale)}</p>
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
  const { locale } = useLocale();
  const comment = comments.find((c) => c.month === month);

  return (
    <div className="space-y-4">
      <MonthSelector selected={month} onChange={onMonthChange} />

      {comment ? (
        <div className="space-y-4">
          <TravelRating month={comment.month} rating={comment.rating} summary={resolveLocalizedString(comment.summary, locale)} />
          <TravelTips comment={comment} />
        </div>
      ) : (
        <p className="py-12 text-center text-gray-400">{month}{t(messages.region.noGuide, locale)}</p>
      )}
    </div>
  );
}
