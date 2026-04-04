import { notFound } from 'next/navigation';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Country, TravelComment } from '@/types';
import RegionDetailContent from '@/components/region/RegionDetailContent';

const DATA_DIR = join(process.cwd(), 'src/data');

type DailyDataMap = Record<number, { years: Record<string, Array<{ day: number; tempHigh: number; tempLow: number; rainfall: number; humidity: number }>> }>;

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

  const comments = getComments(countryId).filter((c) => c.regionId === regionId);
  const dailyData = getDailyData(regionId);

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
      <RegionDetailContent
        country={country}
        region={region}
        comments={comments}
        dailyData={dailyData}
        countryId={countryId}
        regionId={regionId}
      />
    </>
  );
}
