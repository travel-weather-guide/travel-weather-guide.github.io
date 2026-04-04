import { notFound } from 'next/navigation';
import Link from 'next/link';
import RegionTabs from '@/components/region/RegionTabs';
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

import tokyoDaily from '@/data/daily/tokyo/all.json';
import osakaDaily from '@/data/daily/osaka/all.json';
import okinawaDaily from '@/data/daily/okinawa/all.json';
import hokkaidoDaily from '@/data/daily/hokkaido/all.json';
import bangkokDaily from '@/data/daily/bangkok/all.json';
import chiangMaiDaily from '@/data/daily/chiang-mai/all.json';
import phuketDaily from '@/data/daily/phuket/all.json';
import parisDaily from '@/data/daily/paris/all.json';
import niceDaily from '@/data/daily/nice/all.json';
import newYorkDaily from '@/data/daily/new-york/all.json';
import losAngelesDaily from '@/data/daily/los-angeles/all.json';
import hawaiiDaily from '@/data/daily/hawaii/all.json';
import sydneyDaily from '@/data/daily/sydney/all.json';
import melbourneDaily from '@/data/daily/melbourne/all.json';

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

type DailyDataMap = Record<number, { years: Record<string, Array<{ day: number; tempHigh: number; tempLow: number; rainfall: number; humidity: number }>> }>;

const dailyMap: Record<string, DailyDataMap> = {
  tokyo: tokyoDaily as unknown as DailyDataMap,
  osaka: osakaDaily as unknown as DailyDataMap,
  okinawa: okinawaDaily as unknown as DailyDataMap,
  hokkaido: hokkaidoDaily as unknown as DailyDataMap,
  bangkok: bangkokDaily as unknown as DailyDataMap,
  'chiang-mai': chiangMaiDaily as unknown as DailyDataMap,
  phuket: phuketDaily as unknown as DailyDataMap,
  paris: parisDaily as unknown as DailyDataMap,
  nice: niceDaily as unknown as DailyDataMap,
  'new-york': newYorkDaily as unknown as DailyDataMap,
  'los-angeles': losAngelesDaily as unknown as DailyDataMap,
  hawaii: hawaiiDaily as unknown as DailyDataMap,
  sydney: sydneyDaily as unknown as DailyDataMap,
  melbourne: melbourneDaily as unknown as DailyDataMap,
};

function getAllRegionParams() {
  const params: { countryId: string; regionId: string }[] = [];
  for (const [countryId, country] of Object.entries(countryMap)) {
    for (const region of country.regions) {
      params.push({ countryId, regionId: region.id });
    }
  }
  return params;
}

export function generateStaticParams() {
  return getAllRegionParams();
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ countryId: string; regionId: string }>;
}) {
  const { countryId, regionId } = await params;
  const country = countryMap[countryId];
  const region = country?.regions.find((r) => r.id === regionId);

  if (!country || !region) notFound();

  const comments = commentsMap[countryId]?.filter(
    (c) => c.regionId === regionId
  ) ?? [];

  const dailyData = dailyMap[regionId] ?? {};

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* 헤더 */}
      <Link href={`/country/${countryId}`} className="text-sm text-sky-500 hover:text-sky-600">
        ← {country.name.ko}
      </Link>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">{region.name.ko}</h1>
      <p className="mt-1 text-gray-500">{region.name.en} · {region.climateType}</p>

      {/* 탭 */}
      <div className="mt-6">
        <RegionTabs region={region} comments={comments} dailyData={dailyData} />
      </div>
    </main>
  );
}
