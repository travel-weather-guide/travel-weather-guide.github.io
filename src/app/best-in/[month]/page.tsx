import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { MonthlyRecommendation, Country } from '@/types';
import { getAllCountryIds } from '@/utils/data';
import BestInMonthContent from '@/components/best-in/BestInMonthContent';

const DATA_DIR = join(process.cwd(), 'src/data');
const MONTH_NAMES = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function getRecommendation(month: number): MonthlyRecommendation | null {
  try {
    return JSON.parse(readFileSync(join(DATA_DIR, 'monthly-recommendations', `${month}.json`), 'utf-8'));
  } catch {
    return null;
  }
}

export interface RegionInfo {
  countryId: string;
  countryName: { ko: string; en: string; ja?: string; zh?: string };
  regionName: { ko: string; en: string; ja?: string; zh?: string };
}

function buildRegionLookup(): Record<string, RegionInfo> {
  const lookup: Record<string, RegionInfo> = {};
  for (const countryId of getAllCountryIds()) {
    try {
      const country = JSON.parse(readFileSync(join(DATA_DIR, 'countries', `${countryId}.json`), 'utf-8')) as Country;
      for (const region of country.regions) {
        lookup[region.id] = {
          countryId: country.id,
          countryName: country.name as RegionInfo['countryName'],
          regionName: region.name as RegionInfo['regionName'],
        };
      }
    } catch { /* skip */ }
  }
  return lookup;
}

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ month: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string }>;
}): Promise<Metadata> {
  const { month } = await params;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) return {};

  const MONTH_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    title: `${MONTH_NAMES[m]} 여행 추천 목적지 — Best Places in ${MONTH_EN[m]}`,
    description: `${MONTH_NAMES[m]}에 여행하기 좋은 곳은? 베스트 여행지와 피해야 할 곳. Best places to visit in ${MONTH_EN[m]} — weather-based travel recommendations.`,
    alternates: { canonical: `/best-in/${month}` },
    openGraph: {
      title: `${MONTH_NAMES[m]} 여행 추천 목적지 | Travel Weather`,
      description: `${MONTH_NAMES[m]}에 여행하기 좋은 베스트 목적지와 피해야 할 곳`,
    },
  };
}

export default async function BestInMonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) notFound();

  const data = getRecommendation(m);
  if (!data) notFound();

  const regionLookup = buildRegionLookup();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: '홈', item: 'https://travel-weather.pages.dev' },
                { '@type': 'ListItem', position: 2, name: `${MONTH_NAMES[m]} 추천`, item: `https://travel-weather.pages.dev/best-in/${month}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${MONTH_NAMES[m]} 여행 추천 목적지`,
              numberOfItems: data.bestDestinations.length,
              itemListElement: data.bestDestinations.map((dest, i) => {
                const info = regionLookup[dest.regionId];
                return {
                  '@type': 'ListItem',
                  position: i + 1,
                  name: info ? `${info.regionName.ko}, ${info.countryName.ko}` : dest.regionId,
                  url: info ? `https://travel-weather.pages.dev/country/${info.countryId}/${dest.regionId}` : undefined,
                };
              }),
            },
          ]),
        }}
      />
      <BestInMonthContent month={m} data={data} regionLookup={regionLookup} />
    </>
  );
}
