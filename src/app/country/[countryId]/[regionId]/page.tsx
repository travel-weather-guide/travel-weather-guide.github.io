import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RegionDetailContent from '@/components/region/RegionDetailContent';
import { getCountry, getComments, getDailyData, getAllRegionParams } from '@/lib/data-server';

export function generateStaticParams() {
  return getAllRegionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryId: string; regionId: string }>;
}): Promise<Metadata> {
  const { countryId, regionId } = await params;
  const country = getCountry(countryId);
  const region = country?.regions.find(r => r.id === regionId);
  if (!country || !region) return {};

  return {
    title: `${region.name.ko} 날씨 · 월간날씨 · 여행 가이드 (${country.name.ko})`,
    description: `${country.name.ko} ${region.name.ko}의 1월~12월 월간날씨(월별날씨). 과거 기후 데이터 기반 월별 기온·강수량·습도 정보와 여행 적기 가이드. ${region.name.en}, ${country.name.en} weather guide.`,
    alternates: {
      canonical: `/country/${countryId}/${regionId}`,
      languages: { 'en-US': `/en/country/${countryId}/${regionId}`, 'ja': `/ja/country/${countryId}/${regionId}`, 'zh': `/zh/country/${countryId}/${regionId}` },
    },
    openGraph: {
      title: `${region.name.ko} 날씨 · 월간날씨 가이드`,
      description: `${country.name.ko} ${region.name.ko}의 1월~12월 월간날씨와 여행 적기`,
      images: [`/og/${countryId}.png`],
    },
  };
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
  const bestMonths = comments.filter(c => c.rating >= 4).sort((a, b) => b.rating - a.rating);

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: 'https://travel-weather-guide.github.io' },
        { '@type': 'ListItem', position: 2, name: '국가', item: 'https://travel-weather-guide.github.io/country' },
        { '@type': 'ListItem', position: 3, name: country.name.ko, item: `https://travel-weather-guide.github.io/country/${countryId}` },
        { '@type': 'ListItem', position: 4, name: region.name.ko, item: `https://travel-weather-guide.github.io/country/${countryId}/${regionId}` },
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
  ];

  const faqEntries: Array<{ '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }> = [];

  if (bestMonths.length > 0) {
    faqEntries.push({
      '@type': 'Question',
      name: `${region.name.ko} 여행하기 좋은 시기는 언제인가요?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${region.name.ko}의 여행 적기는 ${bestMonths.map(m => `${m.month}월`).join(', ')}입니다. ${typeof bestMonths[0].summary === 'string' ? bestMonths[0].summary : bestMonths[0].summary.ko}`,
      },
    });

    for (const bm of bestMonths.slice(0, 3)) {
      const md = region.monthlyData?.[bm.month - 1];
      if (md) {
        faqEntries.push({
          '@type': 'Question',
          name: `${region.name.ko} ${bm.month}월 날씨는 어떤가요?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${region.name.ko}의 ${bm.month}월 평균 기온은 ${md.tempLow}~${md.tempHigh}°C이며, 강수량은 ${md.rainfall}mm입니다.${md.seaTemp ? ` 바다 수온은 ${md.seaTemp}°C입니다.` : ''}`,
          },
        });
      }
    }
  }

  faqEntries.push({
    '@type': 'Question',
    name: `${region.name.ko} 월간날씨 정보가 있나요?`,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `${region.name.ko}의 1월~12월 월간날씨, 과거 기후 데이터 기반 일별 기온·강수량 정보를 제공합니다.`,
    },
  });

  if (faqEntries.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntries,
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
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
