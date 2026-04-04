'use client';

import SearchBar from '@/components/common/SearchBar';
import CountryExplorer from '@/components/country/CountryExplorer';
import type { Country } from '@/types';
import { getAllCountryIds, getCountry } from '@/utils/data';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

const allCountries: Country[] = getAllCountryIds().map((id) => getCountry(id));

export default function CountryListPage() {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{t(messages.countryList.heading, locale)}</h1>
      <p className="mb-6 text-gray-500">{t(messages.countryList.subheading, locale)}</p>

      <div className="mb-6">
        <SearchBar />
      </div>

      <CountryExplorer allCountries={allCountries} />
    </main>
  );
}
