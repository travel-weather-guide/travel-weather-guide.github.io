import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BestInMonthContent from '@/components/best-in/BestInMonthContent';
import { getRecommendation, buildRegionLookup } from '@/lib/data-server';

const MONTH_NAMES = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

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
    description: `${MONTH_NAMES[m]} 날씨 좋은 여행지 추천. ${MONTH_NAMES[m]} 해외여행 베스트 목적지와 피해야 할 곳. Best places to visit in ${MONTH_EN[m]} — weather-based recommendations.`,
    alternates: {
      canonical: `/best-in/${month}`,
      languages: { 'ko': `/best-in/${month}`, 'en-US': `/en/best-in/${month}`, 'ja': `/ja/best-in/${month}`, 'zh': `/zh/best-in/${month}` },
    },
    openGraph: {
      title: `${MONTH_NAMES[m]} 여행 추천 목적지 | Travel Weather`,
      description: `${MONTH_NAMES[m]} 날씨 좋은 해외여행지 추천과 피해야 할 곳`,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
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
                { '@type': 'ListItem', position: 1, name: '홈', item: 'https://travel-weather-guide.github.io' },
                { '@type': 'ListItem', position: 2, name: `${MONTH_NAMES[m]} 추천`, item: `https://travel-weather-guide.github.io/best-in/${month}` },
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
                  url: info ? `https://travel-weather-guide.github.io/country/${info.countryId}/${dest.regionId}` : undefined,
                };
              }),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `${MONTH_NAMES[m]}에 여행가기 좋은 곳은 어디인가요?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${MONTH_NAMES[m]} 날씨 기준 추천 여행지는 ${data.bestDestinations.slice(0, 5).map(d => { const info = regionLookup[d.regionId]; return info ? info.regionName.ko : d.regionId; }).join(', ')} 등입니다.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `${MONTH_NAMES[m]} 해외여행 날씨 좋은 곳은?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${MONTH_NAMES[m]}에는 총 ${data.bestDestinations.length}개 베스트 여행지를 추천합니다. 과거 기후 데이터 기반으로 기온·강수량을 분석한 결과입니다.`,
                  },
                },
              ],
            },
          ]),
        }}
      />
      <BestInMonthContent month={m} data={data} regionLookup={regionLookup} />
    </>
  );
}
