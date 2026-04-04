import { notFound } from 'next/navigation';
import RegionList from '@/components/country/RegionList';
import type { Country, TravelComment } from '@/types';

import japanData from '@/data/countries/japan.json';
import thailandData from '@/data/countries/thailand.json';
import franceData from '@/data/countries/france.json';
import usaData from '@/data/countries/usa.json';
import australiaData from '@/data/countries/australia.json';

import japanComments from '@/data/travel-comments/japan.json';
import thailandComments from '@/data/travel-comments/thailand.json';
import franceComments from '@/data/travel-comments/france.json';
import usaComments from '@/data/travel-comments/usa.json';
import australiaComments from '@/data/travel-comments/australia.json';

const countryMap: Record<string, Country> = {
  japan: japanData as Country,
  thailand: thailandData as Country,
  france: franceData as Country,
  usa: usaData as Country,
  australia: australiaData as Country,
};

const commentsMap: Record<string, TravelComment[]> = {
  japan: japanComments as TravelComment[],
  thailand: thailandComments as TravelComment[],
  france: franceComments as TravelComment[],
  usa: usaComments as TravelComment[],
  australia: australiaComments as TravelComment[],
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

  const comments = commentsMap[countryId] ?? [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
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

      {/* 지역 목록 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          지역 ({country.regions.length})
        </h2>
        <RegionList countryId={country.id} regions={country.regions} comments={comments} />
      </section>
    </main>
  );
}
