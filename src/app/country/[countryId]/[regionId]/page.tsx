'use client';

import { useParams } from 'next/navigation';
import WeatherTable from '@/components/weather/WeatherTable';
import BestSeasonBadge from '@/components/weather/BestSeasonBadge';
import TravelRating from '@/components/travel/TravelRating';
import TravelTips from '@/components/travel/TravelTips';
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

export default function RegionDetailPage() {
  const params = useParams<{ countryId: string; regionId: string }>();
  const country = countryMap[params.countryId];
  const region = country?.regions.find((r) => r.id === params.regionId);
  const comments = commentsMap[params.countryId]?.filter(
    (c) => c.regionId === params.regionId
  ) ?? [];

  if (!country || !region) {
    return <p className="p-8 text-center text-gray-500">지역을 찾을 수 없습니다.</p>;
  }

  const currentMonth = new Date().getMonth(); // 0-based
  const currentComment = comments.find((c) => c.month === currentMonth + 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* 헤더 */}
      <p className="text-sm text-gray-500">{country.name.ko}</p>
      <h1 className="text-3xl font-bold text-gray-900">{region.name.ko}</h1>
      <p className="mt-1 text-gray-500">{region.name.en} &middot; {region.climateType}</p>

      {/* 베스트 시즌 */}
      <div className="mt-4">
        <BestSeasonBadge data={region.monthlyData} />
      </div>

      {/* 현재 월 코멘트 */}
      {currentComment && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            이번 달 ({currentMonth + 1}월) 여행 정보
          </h2>
          <TravelTips comment={currentComment} />
        </section>
      )}

      {/* 월별 날씨 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">월별 날씨</h2>
        <WeatherTable data={region.monthlyData} />
      </section>

      {/* 월별 여행 적합도 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">월별 여행 적합도</h2>
        <div className="space-y-2">
          {comments.map((c) => (
            <TravelRating
              key={c.month}
              month={c.month}
              rating={c.rating}
              summary={c.summary}
            />
          ))}
        </div>
      </section>

      {/* 전체 월별 코멘트 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">월별 여행 상세</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {comments.map((c) => (
            <div key={c.month}>
              <p className="mb-2 text-sm font-semibold text-sky-600">{c.month}월</p>
              <TravelTips comment={c} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
