'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Country } from '@/types';

import japanData from '@/data/countries/japan.json';
import thailandData from '@/data/countries/thailand.json';
import franceData from '@/data/countries/france.json';
import usaData from '@/data/countries/usa.json';
import australiaData from '@/data/countries/australia.json';

const allCountries: Country[] = [
  japanData as Country,
  thailandData as Country,
  franceData as Country,
  usaData as Country,
  australiaData as Country,
];

const FLAG_EMOJI: Record<string, string> = {
  japan: '\u{1F1EF}\u{1F1F5}',
  thailand: '\u{1F1F9}\u{1F1ED}',
  france: '\u{1F1EB}\u{1F1F7}',
  usa: '\u{1F1FA}\u{1F1F8}',
  australia: '\u{1F1E6}\u{1F1FA}',
};

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const results: Array<{ type: 'country' | 'region'; countryId: string; regionId?: string; label: string; sub: string }> = [];

    for (const country of allCountries) {
      const countryMatch =
        country.name.ko.includes(q) ||
        country.name.en.toLowerCase().includes(q);

      if (countryMatch) {
        results.push({
          type: 'country',
          countryId: country.id,
          label: `${FLAG_EMOJI[country.id] ?? ''} ${country.name.ko}`,
          sub: `${country.name.en} · ${country.regions.length}개 지역`,
        });
      }

      for (const region of country.regions) {
        const regionMatch =
          region.name.ko.includes(q) ||
          region.name.en.toLowerCase().includes(q);

        if (regionMatch) {
          results.push({
            type: 'region',
            countryId: country.id,
            regionId: region.id,
            label: region.name.ko,
            sub: `${region.name.en} · ${FLAG_EMOJI[country.id] ?? ''} ${country.name.ko}`,
          });
        }
      }
    }

    return results;
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="국가 또는 도시 검색 (예: 도쿄, Japan, 태국)"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-10 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      />
      <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {searchResults && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {searchResults.map((r) => (
            <Link
              key={`${r.countryId}-${r.regionId ?? 'country'}`}
              href={r.regionId ? `/country/${r.countryId}/${r.regionId}` : `/country/${r.countryId}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
              onClick={() => setQuery('')}
            >
              <span className="text-xs text-gray-400">
                {r.type === 'country' ? '국가' : '도시'}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{r.label}</p>
                <p className="text-xs text-gray-500">{r.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {searchResults && searchResults.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-lg">
          <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
