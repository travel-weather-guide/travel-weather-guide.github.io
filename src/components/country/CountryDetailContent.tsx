'use client';

import RegionList from '@/components/country/RegionList';
import type { Country, TravelComment } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { getLocalizedName } from '@/i18n/utils';

interface CountryDetailContentProps {
  country: Country;
  comments: TravelComment[];
  countryId: string;
}

export default function CountryDetailContent({ country, comments, countryId }: CountryDetailContentProps) {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* 국가 헤더 */}
      <h1 className="text-3xl font-bold text-gray-900">{getLocalizedName(country.name, locale)}</h1>
      <p className="mt-1 text-gray-500">{country.name.en}</p>

      {/* 기본 정보 */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t(messages.country.capital, locale), value: country.capital },
          { label: t(messages.country.currency, locale), value: country.currency },
          { label: t(messages.country.language, locale), value: country.language },
          { label: t(messages.country.timezone, locale), value: country.timezone },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{item.value || '-'}</p>
          </div>
        ))}
      </div>

      {/* 지역 목록 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {t(messages.country.regionsSection, locale)} ({country.regions.length})
        </h2>
        <RegionList countryId={countryId} regions={country.regions} comments={comments} />
      </section>
    </main>
  );
}
