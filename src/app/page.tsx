'use client';

import SearchBar from '@/components/common/SearchBar';
import CountryExplorer from '@/components/country/CountryExplorer';
import type { Country } from '@/types';
import { getAllCountryIds, getCountry } from '@/utils/data';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

const allCountries: Country[] = getAllCountryIds().map((id) => getCountry(id));

export default function Home() {
  const { locale } = useLocale();

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

      <CountryExplorer allCountries={allCountries} />
    </main>
  );
}
