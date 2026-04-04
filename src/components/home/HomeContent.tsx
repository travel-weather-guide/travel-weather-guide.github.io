'use client';

import { useState } from 'react';
import MonthSelector from '@/components/common/MonthSelector';
import DestinationCard from '@/components/common/DestinationCard';
import type { MonthlyRecommendation, Country } from '@/types';

interface HomeContentProps {
  recommendations: MonthlyRecommendation[];
  allCountries: Country[];
}

function findRegion(regionId: string, allCountries: Country[]) {
  for (const country of allCountries) {
    for (const region of country.regions) {
      if (region.id === regionId) {
        return { country, region };
      }
    }
  }
  return null;
}

export default function HomeContent({ recommendations, allCountries }: HomeContentProps) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const rec = recommendations[month - 1];

  return (
    <>
      {/* 월 선택 */}
      <section className="mb-8">
        <MonthSelector selected={month} onChange={setMonth} />
      </section>

      {/* 추천 목적지 */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          {month}월 추천 여행지
        </h2>
        {rec.bestDestinations.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rec.bestDestinations.map((dest) => {
              const found = findRegion(dest.regionId, allCountries);
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
                  category={dest.category}
                  tempHigh={monthData?.tempHigh}
                  tempLow={monthData?.tempLow}
                  weatherSummary={monthData?.weatherSummary}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">{month}월에 특별히 추천할 여행지가 없습니다</p>
            <p className="mt-1 text-sm text-gray-400">다른 월을 선택해 보세요</p>
          </div>
        )}
      </section>

      {/* 비추천 */}
      {rec.avoidList.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {month}월 피하면 좋은 곳
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rec.avoidList.map((item) => {
              const found = findRegion(item.regionId, allCountries);
              if (!found) return null;
              const monthData = found.region.monthlyData[month - 1];
              return (
                <DestinationCard
                  key={item.regionId}
                  regionId={item.regionId}
                  countryId={found.country.id}
                  regionName={`${found.region.name.ko} (${found.country.name.ko})`}
                  rating={2}
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
    </>
  );
}
