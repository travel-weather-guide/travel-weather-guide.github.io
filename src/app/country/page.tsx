'use client';

import { useState, useMemo } from 'react';
import ContinentFilter from '@/components/common/ContinentFilter';
import CountryCard from '@/components/country/CountryCard';
import SearchBar from '@/components/common/SearchBar';
import MapView from '@/components/map/MapView';
import type { Country, Continent } from '@/types';

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

const regions = allCountries.flatMap((country) =>
  country.regions.map((r) => ({
    id: r.id,
    name: r.name.ko,
    countryId: country.id,
    latitude: r.latitude,
    longitude: r.longitude,
  })),
);

const countryNames: Record<string, string> = Object.fromEntries(
  allCountries.map((c) => [c.id, c.name.ko]),
);

export default function CountryListPage() {
  const [filter, setFilter] = useState<Continent | 'all'>('all');

  const filteredCountries =
    filter === 'all'
      ? allCountries
      : allCountries.filter((c) => c.continent === filter);

  const filteredRegions = useMemo(() => {
    if (filter === 'all') return regions;
    const countryIds = new Set(filteredCountries.map((c) => c.id));
    return regions.filter((r) => countryIds.has(r.countryId));
  }, [filter, filteredCountries]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* 검색바 */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* 좌우 분할: 지도 + 리스트 */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 좌측: 지도 */}
        <div className="h-[400px] overflow-hidden rounded-xl border border-gray-200 lg:h-auto lg:w-1/2 lg:min-h-[600px]">
          <MapView regions={filteredRegions} countryNames={countryNames} focusFilter={filter} />
        </div>

        {/* 우측: 국가 리스트 */}
        <div className="lg:w-1/2">
          <div className="mb-4">
            <ContinentFilter selected={filter} onChange={setFilter} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredCountries.map((c) => (
              <CountryCard
                key={c.id}
                id={c.id}
                name={c.name}
                continent={c.continent}
                regionCount={c.regions.length}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
