import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CountryDetailContent from '@/components/country/CountryDetailContent';
import { getCountry, getComments, getAllCountryIds } from '@/lib/data-server';

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
    title: `${country.name.ko} 날씨 · 월간날씨 · 여행 적기 (${country.name.en})`,
    description: `${country.name.ko}의 1월~12월 월간날씨와 과거 기후 데이터. 월별 기온·강수량·여행 적기 정보. ${regionNamesKo} 등 ${country.regions.length}개 지역 날씨 가이드. Best time to visit ${country.name.en}.`,
    alternates: {
      canonical: `/country/${countryId}`,
      languages: { 'en-US': `/en/country/${countryId}`, 'ja': `/ja/country/${countryId}`, 'zh': `/zh/country/${countryId}` },
    },
    openGraph: {
      title: `${country.name.ko} 날씨 · 월간날씨 가이드`,
      description: `${country.name.ko}의 1월~12월 월간날씨와 여행 적기를 확인하세요.`,
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

  const bestMonthSet = new Set<number>();
  for (const c of comments) {
    if (c.rating >= 4) bestMonthSet.add(c.month);
  }
  const bestMonthsSorted = [...bestMonthSet].sort((a, b) => a - b);

  const schemas: Record<string, unknown>[] = [
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
  ];

  if (bestMonthsSorted.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `${country.name.ko} 여행하기 좋은 시기는 언제인가요?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${country.name.ko}의 여행 베스트 시즌은 ${bestMonthsSorted.map(m => `${m}월`).join(', ')}입니다.`,
          },
        },
        {
          '@type': 'Question',
          name: `${country.name.ko} 월간날씨는 어떤가요?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${country.name.ko}의 ${country.regions.length}개 주요 도시별 1월~12월 월간날씨, 과거 기후 데이터 기반 기온·강수량·습도 정보를 제공합니다.`,
          },
        },
      ],
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <CountryDetailContent country={country} comments={comments} countryId={countryId} />
    </>
  );
}
