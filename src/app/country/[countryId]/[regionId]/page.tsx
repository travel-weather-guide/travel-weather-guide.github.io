import { notFound } from 'next/navigation';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import RegionTabs from '@/components/region/RegionTabs';
import type { Country, TravelComment } from '@/types';

const DATA_DIR = join(process.cwd(), 'src/data');

function getCountry(countryId: string): Country | null {
  try {
    const raw = readFileSync(join(DATA_DIR, 'countries', `${countryId}.json`), 'utf-8');
    return JSON.parse(raw) as Country;
  } catch {
    return null;
  }
}

function getComments(countryId: string): TravelComment[] {
  try {
    const raw = readFileSync(join(DATA_DIR, 'travel-comments', `${countryId}.json`), 'utf-8');
    return JSON.parse(raw) as TravelComment[];
  } catch {
    return [];
  }
}

type DailyDataMap = Record<number, { years: Record<string, Array<{ day: number; tempHigh: number; tempLow: number; rainfall: number; humidity: number }>> }>;

function getDailyData(regionId: string): DailyDataMap {
  const path = join(DATA_DIR, 'daily', regionId, 'all.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as DailyDataMap;
  } catch {
    return {};
  }
}

function getAllCountryIds(): string[] {
  const summaries = JSON.parse(readFileSync(join(DATA_DIR, 'countries.json'), 'utf-8'));
  return summaries.map((c: { id: string }) => c.id);
}

function getAllRegionParams() {
  const params: { countryId: string; regionId: string }[] = [];
  for (const countryId of getAllCountryIds()) {
    const country = getCountry(countryId);
    if (!country) continue;
    for (const region of country.regions) {
      params.push({ countryId, regionId: region.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ countryId: string; regionId: string }> }): Promise<Metadata> {
  const { countryId, regionId } = await params;
  const country = getCountry(countryId);
  const region = country?.regions.find((r) => r.id === regionId);
  if (!country || !region) return {};

  const comments = getComments(countryId).filter(c => c.regionId === regionId);
  const bestMonths = comments
    .filter(c => c.rating >= 4)
    .map(c => `${c.month}월`)
    .join(', ');

  const description = bestMonths
    ? `${region.name.ko}(${region.name.en})의 월별 날씨와 여행 가이드. 베스트 시즌: ${bestMonths}. ${region.climateType} 기후.`
    : `${region.name.ko}(${region.name.en})의 월별 기온, 강수량, 일별 캘린더, 여행 가이드. ${region.climateType} 기후.`;

  return {
    title: `${region.name.ko} 날씨 · 여행 가이드 - ${country.name.ko}`,
    description,
    openGraph: {
      title: `${region.name.ko} 여행 날씨 - ${country.name.ko}`,
      description,
    },
    alternates: { canonical: `/country/${countryId}/${regionId}` },
  };
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
  const country = getCountry(countryId);
  const region = country?.regions.find((r) => r.id === regionId);

  if (!country || !region) notFound();

  const comments = getComments(countryId).filter(
    (c) => c.regionId === regionId
  );

  const dailyData = getDailyData(regionId);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: '홈', item: 'https://travel-weather.pages.dev' },
                { '@type': 'ListItem', position: 2, name: '국가', item: 'https://travel-weather.pages.dev/country' },
                { '@type': 'ListItem', position: 3, name: country.name.ko, item: `https://travel-weather.pages.dev/country/${countryId}` },
                { '@type': 'ListItem', position: 4, name: region.name.ko, item: `https://travel-weather.pages.dev/country/${countryId}/${regionId}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Place',
              name: region.name.ko,
              alternateName: region.name.en,
              geo: {
                '@type': 'GeoCoordinates',
                latitude: region.latitude,
                longitude: region.longitude,
              },
              containedInPlace: {
                '@type': 'Country',
                name: country.name.ko,
              },
            },
          ]),
        }}
      />
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
