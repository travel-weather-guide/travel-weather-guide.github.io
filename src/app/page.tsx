import type { Metadata } from 'next';
import SearchBar from '@/components/common/SearchBar';
import HomeContent from '@/components/home/HomeContent';
import type { MonthlyRecommendation, Country } from '@/types';

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

export const metadata: Metadata = {
  description:
    '전세계 여행지의 월별 날씨와 여행 적합도를 한눈에 확인하세요. 이번 달 추천 여행지, 월별 기온·강수량, 베스트 시즌 정보.',
  alternates: { canonical: '/' },
};

const recommendations = [
  rec1, rec2, rec3, rec4, rec5, rec6,
  rec7, rec8, rec9, rec10, rec11, rec12,
] as unknown as MonthlyRecommendation[];

const allCountries = [
  japanData, thailandData, franceData, usaData, australiaData,
] as unknown as Country[];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
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
          월별 추천 여행지를 확인하고 최적의 여행 시기를 찾아보세요
        </p>
      </section>

      <section className="mb-6">
        <SearchBar />
      </section>

      <HomeContent recommendations={recommendations} allCountries={allCountries} />
    </main>
  );
}
