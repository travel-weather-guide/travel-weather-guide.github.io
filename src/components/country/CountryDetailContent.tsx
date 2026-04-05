'use client';

import Link from 'next/link';
import RegionList from '@/components/country/RegionList';
import type { Country, TravelComment } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { getLocalizedName } from '@/i18n/utils';

const BACK_LABEL = {
  ko: '← 국가 목록',
  en: '← Countries',
  ja: '← 国一覧',
  zh: '← 国家列表',
};

interface CountryDetailContentProps {
  country: Country;
  comments: TravelComment[];
  countryId: string;
}

export default function CountryDetailContent({ country, comments, countryId }: CountryDetailContentProps) {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* 브레드크럼 */}
      <Link href="/country" className="text-sm text-sky-500 hover:text-sky-600 transition-colors">
        {BACK_LABEL[locale] ?? BACK_LABEL.ko}
      </Link>

      {/* 국가 헤더 */}
      <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">{getLocalizedName(country.name, locale)}</h1>
      <p className="mt-1 text-gray-500">{country.name.en}</p>

      {/* 기본 정보 */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: t(messages.country.capital, locale), value: country.capital },
          { label: t(messages.country.currency, locale), value: country.currency },
          { label: t(messages.country.language, locale), value: country.language },
          { label: t(messages.country.timezone, locale), value: country.timezone },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{item.label}</p>
            <p className="mt-1.5 text-sm font-semibold text-gray-900">{item.value || '-'}</p>
          </div>
        ))}
      </div>

      {/* 지역 목록 */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {t(messages.country.regionsSection, locale)} ({country.regions.length})
        </h2>
        <RegionList countryId={countryId} regions={country.regions} comments={comments} />
      </section>
    </main>
  );
}
