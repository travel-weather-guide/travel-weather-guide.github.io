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
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: 'https://travel-weather.pages.dev' },
              { '@type': 'ListItem', position: 2, name: '국가', item: 'https://travel-weather.pages.dev/country' },
              { '@type': 'ListItem', position: 3, name: country.name.ko, item: `https://travel-weather.pages.dev/country/${countryId}` },
            ],
          }),
        }}
      />
      <CountryDetailContent country={country} comments={comments} countryId={countryId} />
    </>
  );
}
