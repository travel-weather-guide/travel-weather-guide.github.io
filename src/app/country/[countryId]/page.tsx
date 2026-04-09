import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Country, TravelComment } from '@/types';
import CountryDetailContent from '@/components/country/CountryDetailContent';

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

function getAllCountryIds(): string[] {
  const summaries = JSON.parse(readFileSync(join(DATA_DIR, 'countries.json'), 'utf-8'));
  return summaries.map((c: { id: string }) => c.id);
}

export function generateStaticParams() {
  return getAllCountryIds().map((countryId) => ({ countryId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryId: string }>;
}): Promise<Metadata> {
  const { countryId } = await params;
  const country = getCountry(countryId);
  if (!country) return {};

  const regionNamesKo = country.regions.slice(0, 3).map(r => r.name.ko).join(', ');

  return {
    title: `${country.name.ko}(${country.name.en}) 여행 날씨 가이드`,
    description: `${country.name.ko}의 월별 날씨, 여행 적기, 베스트 시즌 정보. ${regionNamesKo} 등 ${country.regions.length}개 지역. Best time to visit ${country.name.en} — monthly weather guide.`,
    alternates: {
      canonical: `/country/${countryId}`,
    },
    openGraph: {
      title: `${country.name.ko} 여행 날씨 가이드`,
      description: `${country.name.ko}의 월별 날씨와 여행 적합도를 확인하세요.`,
      images: [`/og/${countryId}.png`],
    },
  };
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ countryId: string }>;
}) {
  const { countryId } = await params;
  const country = getCountry(countryId);
  if (!country) notFound();

  const comments = getComments(countryId);

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
                { '@type': 'ListItem', position: 1, name: '홈', item: 'https://travel-weather-guide.github.io' },
                { '@type': 'ListItem', position: 2, name: '국가', item: 'https://travel-weather-guide.github.io/country' },
                { '@type': 'ListItem', position: 3, name: country.name.ko, item: `https://travel-weather-guide.github.io/country/${countryId}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Country',
              name: country.name.ko,
              alternateName: [country.name.en, country.name.ja, country.name.zh].filter(Boolean),
              url: `https://travel-weather-guide.github.io/country/${countryId}`,
            },
          ]),
        }}
      />
      <CountryDetailContent country={country} comments={comments} countryId={countryId} />
    </>
  );
}
