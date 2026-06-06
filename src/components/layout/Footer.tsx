'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { LEGAL_DOCS, LEGAL_NAMES } from '@/content/legal';

const NAV = {
  home: { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' },
  countries: { ko: '국가 탐색', en: 'Explore Countries', ja: '国を探す', zh: '探索国家' },
  bestThisMonth: { ko: '이번 달 추천', en: "This Month's Best", ja: '今月のおすすめ', zh: '本月推荐' },
};

const THEMES_HEADING = { ko: '테마별 여행지', en: 'Travel by Theme', ja: 'テーマ別旅行先', zh: '主题旅行' };

// 테마 큐레이션 페이지로의 역방향 내부링크 (전 페이지 공통 푸터).
const THEME_LINKS: { slug: string; label: { ko: string; en: string; ja: string; zh: string } }[] = [
  { slug: 'warm-winter', label: { ko: '겨울 따뜻한 여행지', en: 'Warm Winter Escapes', ja: '冬が暖かい旅行先', zh: '温暖过冬目的地' } },
  { slug: 'cool-summer', label: { ko: '여름 시원한 여행지', en: 'Cool-Summer Escapes', ja: '夏が涼しい旅行先', zh: '清凉避暑目的地' } },
  { slug: 'dry-season', label: { ko: '비 안 오는 여행지', en: 'Driest Destinations', ja: '雨が少ない旅行先', zh: '少雨目的地' } },
  { slug: 'low-humidity', label: { ko: '습도 낮은 여행지', en: 'Low-Humidity Destinations', ja: '湿度が低い旅行先', zh: '低湿度目的地' } },
  { slug: 'warm-sea', label: { ko: '따뜻한 바다·물놀이', en: 'Warm-Sea Beaches', ja: '暖かい海・水遊び', zh: '温暖海水目的地' } },
];

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm">
        <Link href="/" className="text-gray-500 hover:text-sky-600 transition-colors">{NAV.home[locale] ?? NAV.home.ko}</Link>
        <Link href="/country" className="text-gray-500 hover:text-sky-600 transition-colors">{NAV.countries[locale] ?? NAV.countries.ko}</Link>
        <Link href={`/best-in/${currentMonth}`} className="text-gray-500 hover:text-sky-600 transition-colors">{NAV.bestThisMonth[locale] ?? NAV.bestThisMonth.ko}</Link>
      </div>

      {/* 테마별 여행지 — 큐레이션 페이지 역방향 내부링크 */}
      <div className="mx-auto max-w-6xl px-4 mb-6">
        <p className="text-center text-xs font-medium text-gray-400 mb-2">{THEMES_HEADING[locale] ?? THEMES_HEADING.ko}</p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {THEME_LINKS.map((th) => (
            <Link key={th.slug} href={`/theme/${th.slug}`} className="text-gray-500 hover:text-sky-600 transition-colors">
              {th.label[locale] ?? th.label.ko}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm text-gray-500">
          {t(messages.footer.weatherData, locale)}{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 transition-all duration-200 hover:text-sky-700 hover:underline"
          >
            Open-Meteo
          </a>{' '}
          (CC BY 4.0) | {t(messages.footer.countryData, locale)}{' '}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 transition-all duration-200 hover:text-sky-700 hover:underline"
          >
            REST Countries
          </a>
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {LEGAL_DOCS.map((doc) => (
            <Link key={doc} href={`/legal/${doc}`} className="text-gray-400 hover:text-sky-600 transition-colors">
              {LEGAL_NAMES[doc][locale] ?? LEGAL_NAMES[doc].ko}
            </Link>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-400">{t(messages.footer.copyright, locale).replace('{year}', String(year))}</p>
      </div>
    </footer>
  );
}
