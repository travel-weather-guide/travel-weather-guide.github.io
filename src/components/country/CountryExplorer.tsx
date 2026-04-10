'use client';

import { useState, useMemo } from 'react';
import ContinentFilter from '@/components/common/ContinentFilter';
import CountryCard from '@/components/country/CountryCard';
import MapView from '@/components/map/MapView';
import type { CountryMarker } from '@/components/map/MapView';
import type { Country, Continent } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { getLocalizedName } from '@/i18n/utils';


const ISO_CODES: Record<string, string> = {
  japan: 'JP', thailand: 'TH', france: 'FR', usa: 'US', australia: 'AU',
  vietnam: 'VN', philippines: 'PH', singapore: 'SG', indonesia: 'ID',
  taiwan: 'TW', spain: 'ES', italy: 'IT', uk: 'GB', turkey: 'TR', greece: 'GR',
  china: 'CN', 'hong-kong': 'HK', guam: 'GU', malaysia: 'MY', cambodia: 'KH',
  maldives: 'MV', mongolia: 'MN', laos: 'LA', switzerland: 'CH', czech: 'CZ',
  croatia: 'HR', uae: 'AE', 'new-zealand': 'NZ', germany: 'DE', portugal: 'PT',
};

function toFlagEmoji(iso: string): string {
  return [...iso.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

interface CountryExplorerProps {
  allCountries: Country[];
}

export default function CountryExplorer({ allCountries }: CountryExplorerProps) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<Continent | 'all'>('all');

  const filteredCountries =
    filter === 'all'
      ? allCountries
      : allCountries.filter((c) => c.continent === filter);

  const countryNames = useMemo(
    () => Object.fromEntries(allCountries.map((c) => [c.id, getLocalizedName(c.name, locale)])),
    [allCountries, locale],
  );

  const countryMarkers: CountryMarker[] = useMemo(() => {
    return filteredCountries.map((c) => {
      const avgLat = c.regions.reduce((s, r) => s + r.latitude, 0) / c.regions.length;
      const avgLng = c.regions.reduce((s, r) => s + r.longitude, 0) / c.regions.length;
      return {
        id: c.id,
        name: getLocalizedName(c.name, locale),
        flag: toFlagEmoji(ISO_CODES[c.id] ?? 'XX'),
        latitude: avgLat,
        longitude: avgLng,
      };
    });
  }, [filteredCountries, locale]);

  const boundPoints: [number, number][] = useMemo(() => {
    return filteredCountries.flatMap((c) =>
      c.regions.map((r): [number, number] => [r.latitude, r.longitude]),
    );
  }, [filteredCountries]);


  return (
    <div className="flex flex-col gap-6">
      {/* 대륙 필터 (좌정렬) */}
      <ContinentFilter selected={filter} onChange={setFilter} />

      {/* 지도 + 국가 리스트 */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 md:h-[280px] lg:h-[400px] lg:w-1/2">
          <MapView countries={countryMarkers} countryNames={countryNames} focusFilter={filter} boundPoints={boundPoints} />
        </div>
        <div className="lg:w-1/2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filteredCountries.map((c) => {
              return (
                <CountryCard
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  continent={c.continent}
                  regionCount={c.regions.length}
                  imageUrl={c.imageUrl}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
