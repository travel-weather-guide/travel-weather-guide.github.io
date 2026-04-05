'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MonthSelector from '@/components/common/MonthSelector';
import WeatherChart from '@/components/weather/WeatherChart';
import WeatherTable from '@/components/weather/WeatherTable';
import BestSeasonBadge from '@/components/weather/BestSeasonBadge';
import TravelRating from '@/components/travel/TravelRating';
import TravelTips from '@/components/travel/TravelTips';
import DailyCalendar from '@/components/weather/DailyCalendar';
import YearComparison from '@/components/weather/YearComparison';
import type { Country, TravelComment } from '@/types';
import type { Region } from '@/types/country';
import type { DayData } from '@/components/weather/DailyCalendar';
import { useLocale } from '@/contexts/LocaleContext';
import { getLocalizedName } from '@/i18n/utils';
import { messages, t } from '@/i18n/messages';
import { resolveLocalizedString } from '@/utils/data';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

type DailyDataMap = Record<number, { years: Record<string, DayData[]> }>;

const ratingConfig: Record<number, { color: string }> = {
  5: { color: 'bg-emerald-100 text-emerald-700' },
  4: { color: 'bg-sky-100 text-sky-700' },
  3: { color: 'bg-yellow-100 text-yellow-700' },
  2: { color: 'bg-orange-100 text-orange-700' },
  1: { color: 'bg-red-100 text-red-700' },
};

const YEARS = [2024, 2023, 2022];

const SECTION_TITLES = {
  calendar: { ko: '일별 날씨', en: 'Daily Weather', ja: '日別天気', zh: '每日天气' },
  yearComp: { ko: '연도별 비교', en: 'Year Comparison', ja: '年度別比較', zh: '年度对比' },
  annual: { ko: '연간 개요', en: 'Annual Overview', ja: '年間概要', zh: '年度概览' },
  guide: { ko: '여행 가이드', en: 'Travel Guide', ja: '旅行ガイド', zh: '旅行指南' },
  monthlyData: { ko: '월별 상세 데이터', en: 'Monthly Data', ja: '月別詳細データ', zh: '月度详细数据' },
};

interface RegionDetailContentProps {
  country: Country;
  region: Region;
  comments: TravelComment[];
  dailyData: DailyDataMap;
  countryId: string;
  regionId: string;
}

export default function RegionDetailContent({ country, region, comments, dailyData, countryId }: RegionDetailContentProps) {
  const { locale } = useLocale();
  const { record } = useRecentlyViewed();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    record({
      countryId,
      regionId: region.id,
      countryName: country.name as { ko: string; en: string; ja?: string; zh?: string },
      regionName: region.name as { ko: string; en: string; ja?: string; zh?: string },
    });
  }, [countryId, region.id, country.name, region.name, record]);

  const comment = comments.find((c) => c.month === selectedMonth);
  const monthData = region.monthlyData[selectedMonth - 1];
  const dailyMonthData = dailyData[selectedMonth];
  const days = (dailyMonthData?.years[String(selectedYear)] ?? []) as DayData[];
  const ratingEntry = comment ? ratingConfig[comment.rating] : null;
  const ratingLabel = comment ? t(messages.ratings[comment.rating as keyof typeof messages.ratings], locale) : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <Link href={`/country/${countryId}`} className="text-sm text-sky-500 hover:text-sky-600 transition-colors">
        ← {getLocalizedName(country.name, locale)}
      </Link>
      <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">{getLocalizedName(region.name, locale)}</h1>
      <p className="mt-1 text-gray-500">{region.name.en} · {resolveLocalizedString(region.climateType, locale)}</p>

      {/* Weather Verdict Card */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {t(messages.months[selectedMonth as keyof typeof messages.months], locale)}
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-gray-900">{monthData?.tempHigh}°</span>
              <span className="text-2xl font-semibold text-gray-400">/ {monthData?.tempLow}°</span>
            </div>
            {monthData && (
              <p className="mt-2 text-sm text-gray-600">
                {resolveLocalizedString(monthData.weatherSummary, locale)} · {monthData.rainfall}mm · {monthData.humidity}%
              </p>
            )}
          </div>
          <div className="text-left sm:text-right">
            {ratingEntry && ratingLabel && (
              <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${ratingEntry.color}`}>
                {ratingLabel}
              </span>
            )}
            {comment && (
              <p className="mt-2 text-sm text-gray-600 max-w-xs">
                {resolveLocalizedString(comment.summary, locale)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Month Selector */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-sm py-4 -mx-4 px-4 mt-8">
        <MonthSelector selected={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {/* All sections in single scroll */}
      <div className="space-y-10">
        {/* Section: Daily Calendar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{t(SECTION_TITLES.calendar, locale)}</h2>
            <div className="flex gap-1">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
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
          {days.length > 0 ? (
            <DailyCalendar
              days={days}
              month={selectedMonth}
              year={selectedYear}
              commentBadge={comment ? { rating: comment.rating, summary: resolveLocalizedString(comment.summary, locale) } : undefined}
            />
          ) : (
            <p className="py-12 text-center text-gray-400">{t(messages.common.noData, locale)}</p>
          )}
        </section>

        {/* Section: Year Comparison */}
        {dailyMonthData && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t(SECTION_TITLES.yearComp, locale)}</h2>
            <YearComparison years={dailyMonthData.years} selectedYear={selectedYear} />
          </section>
        )}

        {/* Section: Annual Overview */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t(SECTION_TITLES.annual, locale)}</h2>
          <BestSeasonBadge data={region.monthlyData} ratings={comments.map((c) => c.rating)} />
          <div className="mt-4">
            <WeatherChart data={region.monthlyData} />
          </div>
        </section>

        {/* Section: Travel Guide */}
        {comment && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t(SECTION_TITLES.guide, locale)}</h2>
            <TravelRating month={comment.month} rating={comment.rating} summary={resolveLocalizedString(comment.summary, locale)} />
            <div className="mt-4">
              <TravelTips comment={comment} />
            </div>
          </section>
        )}

        {/* Section: Monthly Data Table */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t(SECTION_TITLES.monthlyData, locale)}</h2>
          <WeatherTable data={region.monthlyData} />
        </section>
      </div>
    </main>
  );
}
