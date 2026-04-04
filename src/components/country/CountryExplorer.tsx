'use client';

import { useState, useMemo } from 'react';
import ContinentFilter from '@/components/common/ContinentFilter';
import CountryCard from '@/components/country/CountryCard';
import MapView from '@/components/map/MapView';
import type { Country, Continent } from '@/types';

interface RegionMarker {
  id: string;
  name: string;
  countryId: string;
  latitude: number;
  longitude: number;
}

interface CountryExplorerProps {
  allCountries: Country[];
  regions: RegionMarker[];
  countryNames: Record<string, string>;
}

export default function CountryExplorer({ allCountries, regions, countryNames }: CountryExplorerProps) {
  const [filter, setFilter] = useState<Continent | 'all'>('all');

  const filteredCountries =
    filter === 'all'
      ? allCountries
      : allCountries.filter((c) => c.continent === filter);

  const filteredRegions = useMemo(() => {
    if (filter === 'all') return regions;
    const countryIds = new Set(filteredCountries.map((c) => c.id));
    return regions.filter((r) => countryIds.has(r.countryId));
  }, [filter, filteredCountries, regions]);

  return (
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
  );
}
