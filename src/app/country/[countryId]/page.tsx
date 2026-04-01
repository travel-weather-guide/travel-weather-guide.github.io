import { notFound } from 'next/navigation';
import Link from 'next/link';
import WeatherTable from '@/components/weather/WeatherTable';
import BestSeasonBadge from '@/components/weather/BestSeasonBadge';
import RegionList from '@/components/country/RegionList';
import type { Country } from '@/types';

import japanData from '@/data/countries/japan.json';
import thailandData from '@/data/countries/thailand.json';
import franceData from '@/data/countries/france.json';
import usaData from '@/data/countries/usa.json';
import australiaData from '@/data/countries/australia.json';

const countryMap: Record<string, Country> = {
  japan: japanData as Country,
  thailand: thailandData as Country,
  france: franceData as Country,
  usa: usaData as Country,
  australia: australiaData as Country,
};

export function generateStaticParams() {
  return Object.keys(countryMap).map((countryId) => ({ countryId }));
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ countryId: string }>;
}) {
  const { countryId } = await params;
  const country = countryMap[countryId];
  if (!country) notFound();

  // 대표 지역 (첫 번째)의 날씨 데이터를 테이블에 표시
  const mainRegion = country.regions[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* 국가 헤더 */}
      <h1 className="text-3xl font-bold text-gray-900">{country.name.ko}</h1>
      <p className="mt-1 text-gray-500">{country.name.en}</p>

      {/* 기본 정보 */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '수도', value: country.capital },
          { label: '통화', value: country.currency },
          { label: '언어', value: country.language },
          { label: '시간대', value: country.timezone },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{item.value || '-'}</p>
          </div>
        ))}
      </div>

      {/* 베스트 시즌 */}
      {mainRegion && (
        <div className="mt-6">
          <BestSeasonBadge data={mainRegion.monthlyData} />
        </div>
      )}

      {/* 월별 날씨 테이블 */}
      {mainRegion && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {mainRegion.name.ko} 월별 날씨
            </h2>
            <Link
              href={`/month/${new Date().getMonth() + 1}`}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              일별 캘린더 보기 →
            </Link>
          </div>
          <WeatherTable data={mainRegion.monthlyData} />
        </section>
      )}

      {/* 지역 목록 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">지역</h2>
        <RegionList countryId={country.id} regions={country.regions} />
      </section>
    </main>
  );
}
