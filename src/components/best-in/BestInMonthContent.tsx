'use client';

import Link from 'next/link';
import type { MonthlyRecommendation } from '@/types';
import type { RegionInfo } from '@/lib/data-server';
import { useLocale } from '@/contexts/LocaleContext';
import type { Locale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { flagUrl } from '@/utils/data';

interface Props {
  month: number;
  data: MonthlyRecommendation;
  regionLookup: Record<string, RegionInfo>;
}

const CATEGORY_COLORS: Record<string, string> = {
  beach: 'bg-cyan-100 text-cyan-700',
  mountain: 'bg-emerald-100 text-emerald-700',
  city: 'bg-violet-100 text-violet-700',
  culture: 'bg-amber-100 text-amber-700',
  adventure: 'bg-rose-100 text-rose-700',
  ski: 'bg-blue-100 text-blue-700',
};

const CATEGORY_LABELS: Record<string, { ko: string; en: string; ja: string; zh: string }> = {
  beach: { ko: '해변', en: 'Beach', ja: 'ビーチ', zh: '海滩' },
  mountain: { ko: '산악', en: 'Mountain', ja: '山岳', zh: '山岳' },
  city: { ko: '도시', en: 'City', ja: '都市', zh: '城市' },
  culture: { ko: '문화', en: 'Culture', ja: '文化', zh: '文化' },
  adventure: { ko: '모험', en: 'Adventure', ja: '冒険', zh: '探险' },
  ski: { ko: '스키', en: 'Ski', ja: 'スキー', zh: '滑雪' },
};

const HEADINGS = {
  title: { ko: '여행 추천 목적지', en: 'Best Places to Visit', ja: 'おすすめ旅行先', zh: '推荐旅行目的地' },
  subtitle: { ko: '날씨·축제·물가를 고려한 베스트 여행지', en: 'Top destinations based on weather, festivals & prices', ja: '天気・祭り・物価を考慮したベスト旅行先', zh: '综合天气、节庆与物价的最佳目的地' },
  best: { ko: '베스트 여행지', en: 'Best Destinations', ja: 'ベスト旅行先', zh: '最佳目的地' },
  hidden: { ko: '숨은 보석', en: 'Hidden Gems', ja: '隠れた名所', zh: '隐藏宝藏' },
  avoid: { ko: '이번 달 피하면 좋은 곳', en: 'Places to Avoid This Month', ja: '今月避けたい場所', zh: '本月建议避开的地方' },
};

function name(n: { ko: string; en: string; ja?: string; zh?: string }, locale: Locale): string {
  return n[locale] ?? n.en ?? n.ko;
}

function reason(r: string | { ko: string; en: string; ja?: string; zh?: string }, locale: Locale): string {
  if (typeof r === 'string') return r;
  return r[locale] ?? r.en ?? r.ko;
}

export default function BestInMonthContent({ month, data, regionLookup }: Props) {
  const { locale } = useLocale();
  const monthLabel = t(messages.months[month as keyof typeof messages.months], locale);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
        {monthLabel} {t(HEADINGS.title, locale)}
      </h1>
      <p className="mt-2 text-gray-500">
        {t(HEADINGS.subtitle, locale)}
      </p>

      {/* Month navigation */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <Link
            key={m}
            href={`/best-in/${m}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              m === month
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            {t(messages.months[m as keyof typeof messages.months], locale)}
          </Link>
        ))}
      </nav>

      {/* Best destinations */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t(HEADINGS.best, locale)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.bestDestinations.map((dest) => {
            const info = regionLookup[dest.regionId];
            if (!info) return null;
            return (
              <Link
                key={dest.regionId}
                href={`/country/${info.countryId}/${dest.regionId}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={flagUrl(info.countryId)} alt="" className="h-3.5 w-5 object-cover shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900">{name(info.regionName, locale)}</span>
                      <span className="ml-1.5 text-sm text-gray-400">{name(info.countryName, locale)}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[dest.category] ?? 'bg-slate-100 text-gray-600'}`}>
                    {CATEGORY_LABELS[dest.category]?.[locale] ?? dest.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{reason(dest.reason, locale)}</p>
                <div className="mt-2 flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`text-base ${i < dest.rating ? 'text-yellow-400' : 'text-gray-200'}`}>&#9733;</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hidden gems */}
      {data.hiddenGems.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {t(HEADINGS.hidden, locale)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.hiddenGems.map((dest) => {
              const info = regionLookup[dest.regionId];
              if (!info) return null;
              return (
                <Link
                  key={dest.regionId}
                  href={`/country/${info.countryId}/${dest.regionId}`}
                  className="block rounded-2xl border border-amber-200 bg-amber-50/30 p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={flagUrl(info.countryId)} alt="" className="h-3.5 w-5 object-cover shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-900">{name(info.regionName, locale)}</span>
                        <span className="ml-1.5 text-sm text-gray-400">{name(info.countryName, locale)}</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[dest.category] ?? 'bg-slate-100 text-gray-600'}`}>
                      {CATEGORY_LABELS[dest.category]?.[locale] ?? dest.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{reason(dest.reason, locale)}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Avoid list */}
      {data.avoidList.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {t(HEADINGS.avoid, locale)}
          </h2>
          <div className="space-y-2">
            {data.avoidList.map((item) => {
              const info = regionLookup[item.regionId];
              if (!info) return null;
              return (
                <div key={item.regionId} className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4">
                  <span className="text-red-400 text-sm shrink-0 mt-0.5">⚠</span>
                  <img src={flagUrl(info.countryId)} alt="" className="h-3 w-4 object-cover shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {name(info.regionName, locale)}
                    <span className="ml-1 text-gray-400 font-normal">{name(info.countryName, locale)}</span>
                  </span>
                  <span className="text-sm text-gray-500">{reason(item.reason, locale)}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
