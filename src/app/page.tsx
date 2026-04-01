'use client';

import { useState } from 'react';
import MonthSelector from '@/components/common/MonthSelector';
import DestinationCard from '@/components/common/DestinationCard';

// 정적 JSON import
import rec1 from '@/data/monthly-recommendations/1.json';
import rec2 from '@/data/monthly-recommendations/2.json';
import rec3 from '@/data/monthly-recommendations/3.json';
import rec4 from '@/data/monthly-recommendations/4.json';
import rec5 from '@/data/monthly-recommendations/5.json';
import rec6 from '@/data/monthly-recommendations/6.json';
import rec7 from '@/data/monthly-recommendations/7.json';
import rec8 from '@/data/monthly-recommendations/8.json';
import rec9 from '@/data/monthly-recommendations/9.json';
import rec10 from '@/data/monthly-recommendations/10.json';
import rec11 from '@/data/monthly-recommendations/11.json';
import rec12 from '@/data/monthly-recommendations/12.json';

import japanData from '@/data/countries/japan.json';
import thailandData from '@/data/countries/thailand.json';
import franceData from '@/data/countries/france.json';
import usaData from '@/data/countries/usa.json';
import australiaData from '@/data/countries/australia.json';

const recommendations = [rec1, rec2, rec3, rec4, rec5, rec6, rec7, rec8, rec9, rec10, rec11, rec12];

const allCountries = [japanData, thailandData, franceData, usaData, australiaData];

function findRegion(regionId: string) {
  for (const country of allCountries) {
    for (const region of country.regions) {
      if (region.id === regionId) {
        return { country, region };
      }
    }
  }
  return null;
}

export default function Home() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const rec = recommendations[month - 1];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* 히어로 */}
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          여행하기 좋은 날씨, 한눈에
        </h1>
        <p className="mt-2 text-gray-500">
          월별 추천 여행지를 확인하고 최적의 여행 시기를 찾아보세요
        </p>
      </section>

      {/* 월 선택 */}
      <section className="mb-8">
        <MonthSelector selected={month} onChange={setMonth} />
      </section>

      {/* 추천 목적지 */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {month}월 추천 여행지
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rec.bestDestinations.map((dest) => {
            const found = findRegion(dest.regionId);
            if (!found) return null;
            const monthData = found.region.monthlyData[month - 1];
            return (
              <DestinationCard
                key={dest.regionId}
                regionId={dest.regionId}
                countryId={found.country.id}
                regionName={`${found.region.name.ko} (${found.country.name.ko})`}
                rating={dest.rating}
                reason={dest.reason}
                tempHigh={monthData?.tempHigh}
                tempLow={monthData?.tempLow}
                weatherSummary={monthData?.weatherSummary}
              />
            );
          })}
        </div>
      </section>

      {/* 비추천 */}
      {rec.avoidList.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {month}월 피하면 좋은 곳
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rec.avoidList.map((item) => {
              const found = findRegion(item.regionId);
              if (!found) return null;
              const monthData = found.region.monthlyData[month - 1];
              return (
                <DestinationCard
                  key={item.regionId}
                  regionId={item.regionId}
                  countryId={found.country.id}
                  regionName={`${found.region.name.ko} (${found.country.name.ko})`}
                  rating={1}
                  reason={item.reason}
                  tempHigh={monthData?.tempHigh}
                  tempLow={monthData?.tempLow}
                  weatherSummary={monthData?.weatherSummary}
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
