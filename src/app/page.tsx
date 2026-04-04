'use client';

import Link from 'next/link';
import SearchBar from '@/components/common/SearchBar';
import CountryExplorer from '@/components/country/CountryExplorer';
import type { Country, MonthlyRecommendation } from '@/types';
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

const regionLookup: Record<string, { countryId: string; countryName: { ko: string; en: string; ja?: string; zh?: string }; regionName: { ko: string; en: string; ja?: string; zh?: string } }> = {};
for (const country of allCountries) {
  for (const region of country.regions) {
    regionLookup[region.id] = {
      countryId: country.id,
      countryName: country.name as { ko: string; en: string; ja?: string; zh?: string },
      regionName: region.name as { ko: string; en: string; ja?: string; zh?: string },
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

export default function Home() {
  const { locale } = useLocale();
  const { items: recentItems } = useRecentlyViewed();
  const currentMonth = new Date().getMonth() + 1;
  const monthLabel = t(messages.months[currentMonth as keyof typeof messages.months], locale);
  const topDests = allRecommendations[currentMonth]?.bestDestinations.slice(0, 3) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Travel Weather',
            url: 'https://travel-weather.pages.dev',
            description: '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요.',
            inLanguage: 'ko',
          }),
        }}
      />
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          {t(messages.home.hero, locale)}
        </h1>
        <p className="mt-2 text-gray-500">
          {t(messages.home.subhero, locale)}
        </p>
      </section>

      <section className="mb-6">
        <SearchBar />
      </section>

      {topDests.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">
              {monthLabel} {t(SECTION_TITLE, locale)}
            </h2>
            <Link
              href={`/best-in/${currentMonth}`}
              className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
            >
              {t(MORE_LABEL, locale)} &rarr;
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {topDests.map((dest) => {
              const info = regionLookup[dest.regionId];
              if (!info) return null;
              return (
                <Link
                  key={dest.regionId}
                  href={`/country/${info.countryId}/${dest.regionId}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 hover:border-sky-300 hover:shadow-md transition-all"
                >
                  <p className="flex items-center gap-1.5 font-semibold text-gray-900">
                    {resolveName(info.regionName, locale)}
                    <img src={flagUrl(info.countryId)} alt="" className="h-3 w-4 object-cover shrink-0" />
                    <span className="text-sm font-normal text-gray-400">{resolveName(info.countryName, locale)}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{resolveReason(dest.reason, locale)}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {recentItems.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-gray-500">{RECENT_LABEL[locale] ?? RECENT_LABEL.ko}</h2>
          <div className="flex flex-wrap gap-2">
            {recentItems.map((r) => (
              <Link
                key={r.regionId}
                href={`/country/${r.countryId}/${r.regionId}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-sky-300 hover:text-sky-600 transition-colors"
              >
                {(r.regionName[locale] ?? r.regionName.en ?? r.regionName.ko)}
                <span className="ml-1 text-gray-400">{(r.countryName[locale] ?? r.countryName.en ?? r.countryName.ko)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CountryExplorer allCountries={allCountries} />
    </main>
  );
}
