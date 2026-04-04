import { notFound } from 'next/navigation';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import RegionList from '@/components/country/RegionList';
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

function getAllCountryIds(): string[] {
  const summaries = JSON.parse(readFileSync(join(DATA_DIR, 'countries.json'), 'utf-8'));
  return summaries.map((c: { id: string }) => c.id);
}

export async function generateMetadata({ params }: { params: Promise<{ countryId: string }> }): Promise<Metadata> {
  const { countryId } = await params;
  const country = getCountry(countryId);
  if (!country) return {};

  return {
    title: `${country.name.ko} 여행 날씨`,
    description: `${country.name.ko}(${country.name.en})의 ${country.regions.length}개 지역 월별 날씨, 여행 적합도, 베스트 시즌을 확인하세요.`,
    openGraph: {
      title: `${country.name.ko} 여행 날씨`,
      description: `${country.name.ko} ${country.regions.length}개 지역의 월별 기온, 강수량, 여행 적합도`,
      images: [`/og/${countryId}.png`],
    },
    alternates: { canonical: `/country/${countryId}` },
  };
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
    <main className="mx-auto max-w-4xl px-4 py-8">
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
      {/* 국가 헤더 */}
      <h1 className="text-3xl font-bold text-gray-900">{country.name.ko}</h1>
      <p className="mt-1 text-gray-500">{country.name.en}</p>

      {/* 기본 정보 */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: '수도', value: country.capital },
          { label: '통화', value: country.currency },
          { label: '언어', value: country.language },
          { label: '시간대', value: country.timezone },
        ].map((item) => (
          <div key={item.label} className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-gray-900">{item.value || '-'}</p>
          </div>
        ))}
      </div>

      {/* 지역 목록 */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          지역 ({country.regions.length})
        </h2>
        <RegionList countryId={country.id} regions={country.regions} comments={comments} />
      </section>
    </main>
  );
}
