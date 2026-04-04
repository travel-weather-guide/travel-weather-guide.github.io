import SearchBar from '@/components/common/SearchBar';
import CountryExplorer from '@/components/country/CountryExplorer';
import type { Country } from '@/types';
import { getAllCountryIds, getCountry } from '@/utils/data';

const allCountries: Country[] = getAllCountryIds().map((id) => getCountry(id));

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
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">국가별 여행 날씨</h1>
      <p className="mb-6 text-gray-500">세계지도에서 여행지를 탐색하고 국가별 날씨를 확인하세요</p>

      <div className="mb-6">
        <SearchBar />
      </div>

      <CountryExplorer allCountries={allCountries} regions={regions} countryNames={countryNames} />
    </main>
  );
}
