import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import RegionDetailContent from '@/components/region/RegionDetailContent';
import { getCountry, getComments, getDailyData, getAllMonthlyRegionParams } from '@/lib/data-server';

const MONTH_NAMES = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const MONTH_EN = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function generateStaticParams() {
  return getAllMonthlyRegionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryId: string; regionId: string; month: string }>;
}): Promise<Metadata> {
  const { countryId, regionId, month } = await params;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) return {};
  const country = getCountry(countryId);
  const region = country?.regions.find(r => r.id === regionId);
  if (!country || !region) return {};

  const md = region.monthlyData?.[m - 1];
  const tempInfo = md ? ` 평균 기온 ${md.tempLow}~${md.tempHigh}°C, 강수량 ${md.rainfall}mm.` : '';

  return {
    title: `${region.name.ko} ${MONTH_NAMES[m]} 날씨 - ${country.name.ko} 여행 가이드`,
    description: `${country.name.ko} ${region.name.ko}의 ${MONTH_NAMES[m]} 날씨 정보.${tempInfo} 과거 기후 데이터 기반 여행 가이드. ${region.name.en} ${MONTH_EN[m]} weather.`,
    alternates: {
      canonical: `/country/${countryId}/${regionId}/${month}`,
      languages: { 'en-US': `/en/country/${countryId}/${regionId}/${month}`, 'ja': `/ja/country/${countryId}/${regionId}/${month}`, 'zh': `/zh/country/${countryId}/${regionId}/${month}` },
    },
    openGraph: {
      title: `${region.name.ko} ${MONTH_NAMES[m]} 날씨 | Travel Weather`,
      description: `${country.name.ko} ${region.name.ko}의 ${MONTH_NAMES[m]} 날씨와 여행 정보`,
      images: [`/og/${countryId}.png`],
    },
  };
}

export default async function MonthlyWeatherPage({
  params,
}: {
  params: Promise<{ countryId: string; regionId: string; month: string }>;
}) {
  const { countryId, regionId, month } = await params;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) notFound();

  const country = getCountry(countryId);
  const region = country?.regions.find(r => r.id === regionId);
  if (!country || !region) notFound();

  const comments = getComments(countryId).filter(c => c.regionId === regionId);
  const dailyData = getDailyData(regionId);
  const comment = comments.find(c => c.month === m);

  const BASE = 'https://travel-weather-guide.github.io';
  const md = region.monthlyData?.[m - 1];

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: BASE },
        { '@type': 'ListItem', position: 2, name: country.name.ko, item: `${BASE}/country/${countryId}` },
        { '@type': 'ListItem', position: 3, name: region.name.ko, item: `${BASE}/country/${countryId}/${regionId}` },
        { '@type': 'ListItem', position: 4, name: `${MONTH_NAMES[m]} 날씨`, item: `${BASE}/country/${countryId}/${regionId}/${month}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `${region.name.ko} ${MONTH_NAMES[m]} 날씨는 어떤가요?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: md
              ? `${region.name.ko}의 ${MONTH_NAMES[m]} 평균 기온은 ${md.tempLow}~${md.tempHigh}°C이며, 강수량은 ${md.rainfall}mm입니다.${md.seaTemp ? ` 바다 수온은 ${md.seaTemp}°C입니다.` : ''}`
              : `${region.name.ko}의 ${MONTH_NAMES[m]} 날씨 정보를 확인하세요.`,
          },
        },
        ...(comment ? [{
          '@type': 'Question' as const,
          name: `${region.name.ko} ${MONTH_NAMES[m]}에 여행하기 좋은가요?`,
          acceptedAnswer: {
            '@type': 'Answer' as const,
            text: `${region.name.ko}의 ${MONTH_NAMES[m]} 여행 적합도: ${typeof comment.summary === 'string' ? comment.summary : comment.summary.ko}`,
          },
        }] : []),
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <RegionDetailContent
        country={country}
        region={region}
        comments={comments}
        dailyData={dailyData}
        countryId={countryId}
        regionId={regionId}
        defaultMonth={m}
      />
    </>
  );
}
