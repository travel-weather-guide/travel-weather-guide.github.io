'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/common/SearchBar';
import MonthSelector from '@/components/common/MonthSelector';
import CountryExplorer from '@/components/country/CountryExplorer';
import type { Country, MonthlyRecommendation, MonthlyData } from '@/types';
import { getAllCountryIds, getCountry, getMonthlyRecommendation, flagUrl } from '@/utils/data';
import { useLocale } from '@/contexts/LocaleContext';
import type { Locale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

const allCountries: Country[] = getAllCountryIds().map((id) => getCountry(id));

const allRecommendations: Record<number, MonthlyRecommendation> = {};
for (let m = 1; m <= 12; m++) {
  try { allRecommendations[m] = getMonthlyRecommendation(m); } catch { /* skip */ }
}

const regionLookup: Record<string, {
  countryId: string;
  countryName: { ko: string; en: string; ja?: string; zh?: string };
  regionName: { ko: string; en: string; ja?: string; zh?: string };
  monthlyData?: MonthlyData[];
}> = {};
for (const country of allCountries) {
  for (const region of country.regions) {
    regionLookup[region.id] = {
      countryId: country.id,
      countryName: country.name as { ko: string; en: string; ja?: string; zh?: string },
      regionName: region.name as { ko: string; en: string; ja?: string; zh?: string },
      monthlyData: region.monthlyData,
    };
  }
}

function resolveName(n: { ko: string; en: string; ja?: string; zh?: string }, locale: Locale) {
  return n[locale] ?? n.en ?? n.ko;
}

function resolveReason(r: string | { ko: string; en: string; ja?: string; zh?: string }, locale: Locale) {
  if (typeof r === 'string') return r;
  return r[locale] ?? r.en ?? r.ko;
}

const RECENT_LABEL = {
  ko: '최근 본 목적지',
  en: 'Recently Viewed',
  ja: '最近見た旅行先',
  zh: '最近浏览',
};

const SECTION_TITLE = {
  ko: '추천 여행지',
  en: 'Recommended',
  ja: 'おすすめ旅行先',
  zh: '推荐目的地',
};

const MORE_LABEL = {
  ko: '더보기',
  en: 'See all',
  ja: 'もっと見る',
  zh: '查看更多',
};

const EXPLORER_TITLE = {
  ko: '국가별 탐색',
  en: 'Explore by Country',
  ja: '国別で探す',
  zh: '按国家探索',
};

export default function Home() {
  const { locale } = useLocale();
  const { items: recentItems } = useRecentlyViewed();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const monthLabel = t(messages.months[selectedMonth as keyof typeof messages.months], locale);
  const topDests = allRecommendations[selectedMonth]?.bestDestinations.slice(0, 6) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Travel Weather',
            url: 'https://travel-weather-guide.github.io',
            description: '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요.',
            inLanguage: 'ko',
          }),
        }}
      />

      {/* Hero section */}
      <section className="-mx-4 px-4 pt-8 pb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
          {t(messages.home.hero, locale)}
        </h1>
        <p className="mt-3 text-base text-gray-500">
          {t(messages.home.subhero, locale)}
        </p>
        <div className="mt-8 max-w-lg mx-auto">
          <SearchBar />
        </div>
        <div className="mt-5 max-w-2xl mx-auto">
          <MonthSelector selected={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </section>

      {topDests.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {monthLabel} {t(SECTION_TITLE, locale)}
            </h2>
            <Link
              href={`/best-in/${selectedMonth}`}
              className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
            >
              {t(MORE_LABEL, locale)} &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topDests.map((dest) => {
              const info = regionLookup[dest.regionId];
              if (!info) return null;
              const weatherData = info.monthlyData?.[selectedMonth - 1];
              return (
                <Link
                  key={dest.regionId}
                  href={`/country/${info.countryId}/${dest.regionId}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <img src={flagUrl(info.countryId)} alt="" className="h-4 w-6 object-cover shrink-0" />
                    <p className="font-semibold text-gray-900">{resolveName(info.regionName, locale)}</p>
                    <span className="text-sm text-gray-400">{resolveName(info.countryName, locale)}</span>
                  </div>
                  {weatherData && (
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold text-gray-900">{weatherData.tempHigh}°</span>
                      <span className="text-lg text-gray-400">/ {weatherData.tempLow}°</span>
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{resolveReason(dest.reason, locale)}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {recentItems.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-sm font-medium text-gray-500">{RECENT_LABEL[locale] ?? RECENT_LABEL.ko}</h2>
          <div className="flex flex-wrap gap-2">
            {recentItems.map((r) => (
              <Link
                key={r.regionId}
                href={`/country/${r.countryId}/${r.regionId}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm text-gray-700 hover:shadow-md hover:border-sky-200 hover:text-sky-600 transition-all duration-200"
              >
                {(r.regionName[locale] ?? r.regionName.en ?? r.regionName.ko)}
                <span className="ml-1 text-gray-400">{(r.countryName[locale] ?? r.countryName.en ?? r.countryName.ko)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 pb-12">
        <h2 className="mb-4 text-lg font-bold text-gray-900">{t(EXPLORER_TITLE, locale)}</h2>
        <CountryExplorer allCountries={allCountries} />
      </section>
    </main>
  );
}
