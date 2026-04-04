import type { Metadata } from 'next';
import SearchBar from '@/components/common/SearchBar';
import CountryExplorer from '@/components/country/CountryExplorer';
import type { Country } from '@/types';
import { getAllCountryIds, getCountry } from '@/utils/data';

export const metadata: Metadata = {
  description:
    '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요. 국가별 기온·강수량, 베스트 시즌 정보.',
  alternates: { canonical: '/' },
};

const allCountries: Country[] = getAllCountryIds().map((id) => getCountry(id));

export default function Home() {
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
          여행하기 좋은 날씨, 한눈에
        </h1>
        <p className="mt-2 text-gray-500">
          세계지도에서 여행지를 탐색하고 국가별 날씨를 확인하세요
        </p>
      </section>

      <section className="mb-6">
        <SearchBar />
      </section>

      <CountryExplorer allCountries={allCountries} />
    </main>
  );
}
