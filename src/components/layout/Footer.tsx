'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

const NAV = {
  home: { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' },
  countries: { ko: '국가 탐색', en: 'Explore Countries', ja: '国を探す', zh: '探索国家' },
  bestThisMonth: { ko: '이번 달 추천', en: "This Month's Best", ja: '今月のおすすめ', zh: '本月推荐' },
};

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
        <p className="mt-2 text-sm text-gray-400">{t(messages.footer.copyright, locale).replace('{year}', String(year))}</p>
      </div>
    </footer>
  );
}
