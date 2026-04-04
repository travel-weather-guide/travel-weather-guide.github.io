import type { Country } from '@/types';
import MapView from '@/components/map/MapView';

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

export default function MapPage() {
  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">세계 날씨 지도</h1>
        <p className="text-xs text-gray-400">국가를 클릭하면 상세 페이지로 이동합니다</p>
      </div>
      <div className="flex-1">
        <MapView regions={regions} countryNames={countryNames} />
      </div>
    </main>
  );
}
