'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Country } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { getLocalizedName } from '@/i18n/utils';
import { getAllCountryIds, getCountry, flagUrl } from '@/utils/data';

const allCountries: Country[] = getAllCountryIds().map((id) => getCountry(id));

export default function SearchBar() {
  const { locale } = useLocale();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const results: Array<{ type: 'country' | 'region'; countryId: string; regionId?: string; label: string; sub: string; flag: string }> = [];

    for (const country of allCountries) {
      const countryMatch =
        country.name.ko.includes(q) ||
        country.name.en.toLowerCase().includes(q) ||
        (country.name.ja ?? '').toLowerCase().includes(q) ||
        (country.name.zh ?? '').toLowerCase().includes(q);

      if (countryMatch) {
        const localName = getLocalizedName(country.name, locale);
        results.push({
          type: 'country',
          countryId: country.id,
          flag: flagUrl(country.id),
          label: localName,
          sub: `${country.name.en} · ${country.regions.length}${t(messages.search.regionCount, locale)}`,
        });
      }

      for (const region of country.regions) {
        const regionMatch =
          region.name.ko.includes(q) ||
          region.name.en.toLowerCase().includes(q) ||
          (region.name.ja ?? '').toLowerCase().includes(q) ||
          (region.name.zh ?? '').toLowerCase().includes(q);

        if (regionMatch) {
          const localRegionName = getLocalizedName(region.name, locale);
          const localCountryName = getLocalizedName(country.name, locale);
          results.push({
            type: 'region',
            countryId: country.id,
            regionId: region.id,
            flag: flagUrl(country.id),
            label: localRegionName,
            sub: `${region.name.en} · ${localCountryName}`,
          });
        }
      }
    }

    return results;
  }, [query, locale]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(messages.search.placeholder, locale)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pl-11 text-sm outline-none transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
      <svg className="absolute left-3.5 top-4 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {searchResults && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
          {searchResults.map((r) => (
            <Link
              key={`${r.countryId}-${r.regionId ?? 'country'}`}
              href={r.regionId ? `/country/${r.countryId}/${r.regionId}` : `/country/${r.countryId}`}
              className="flex items-center gap-3 px-4 py-3.5 transition-all duration-200 hover:bg-slate-50 first:rounded-t-2xl last:rounded-b-2xl"
              onClick={() => setQuery('')}
            >
              {r.flag ? (
                <Image src={r.flag} alt="" width={20} height={15} className="shrink-0 rounded-sm object-cover" unoptimized />
              ) : (
                <span className="h-[15px] w-5 shrink-0 rounded-sm bg-slate-100" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{r.label}</p>
                <p className="text-xs text-gray-400">{r.sub}</p>
              </div>
              <span className="shrink-0 text-xs text-gray-400">
                {r.type === 'country' ? t(messages.search.typeCountry, locale) : t(messages.search.typeCity, locale)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {searchResults && searchResults.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-lg">
          <p className="text-sm text-gray-500">{t(messages.search.noResults, locale)}</p>
        </div>
      )}
    </div>
  );
}
