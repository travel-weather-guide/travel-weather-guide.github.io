import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/contexts/LocaleContext';
import { localName, seo, monthName } from '@/utils/seo-locale';
import RegionDetailContent from '@/components/region/RegionDetailContent';
import { getCountry, getComments, getDailyData, getAllMonthlyRegionParams } from '@/lib/data-server';

export function generateStaticParams() {
  return getAllMonthlyRegionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; countryId: string; regionId: string; month: string }>;
}): Promise<Metadata> {
  const { locale, countryId, regionId, month } = await params;
  const l = locale as Locale;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) return {};
  const country = getCountry(countryId);
  const region = country?.regions.find(r => r.id === regionId);
  if (!country || !region) return {};

  const md = region.monthlyData?.[m - 1];

  return {
    title: `${localName(region.name, l)} ${monthName(m, l)} ${seo('weather', l)} - ${localName(country.name, l)} ${seo('travelGuide', l)}`,
    description: `${localName(country.name, l)} ${localName(region.name, l)} ${monthName(m, l)} ${seo('weather', l)}. ${seo('avgTemp', l)} ${md?.tempLow ?? ''}~${md?.tempHigh ?? ''}°C, ${seo('rainfall', l)} ${md?.rainfall ?? ''}mm. ${seo('historical', l)} ${region.name.en} ${monthName(m, 'en')}.`,
    alternates: {
      canonical: `/${locale}/country/${countryId}/${regionId}/${month}`,
      languages: {
        'ko': `/country/${countryId}/${regionId}/${month}`,
        'en-US': `/en/country/${countryId}/${regionId}/${month}`,
        'ja': `/ja/country/${countryId}/${regionId}/${month}`,
        'zh': `/zh/country/${countryId}/${regionId}/${month}`,
      },
    },
    openGraph: {
      locale: locale,
      title: `${localName(region.name, l)} ${monthName(m, l)} ${seo('weather', l)} | Travel Weather`,
      description: `${localName(country.name, l)} ${localName(region.name, l)} ${monthName(m, l)} ${seo('weather', l)}`,
      images: [`/og/${countryId}.png`],
    },
  };
}

export default async function LocaleMonthlyWeatherPage({
  params,
}: {
  params: Promise<{ locale: string; countryId: string; regionId: string; month: string }>;
}) {
  const { locale, countryId, regionId, month } = await params;
  const l = locale as Locale;
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
        { '@type': 'ListItem', position: 1, name: seo('travelGuide', l).split(' ')[0], item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: localName(country.name, l), item: `${BASE}/${locale}/country/${countryId}` },
        { '@type': 'ListItem', position: 3, name: localName(region.name, l), item: `${BASE}/${locale}/country/${countryId}/${regionId}` },
        { '@type': 'ListItem', position: 4, name: `${monthName(m, l)} ${seo('weather', l)}`, item: `${BASE}/${locale}/country/${countryId}/${regionId}/${month}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `${localName(region.name, l)} ${monthName(m, l)} ${seo('weather', l)}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: md
              ? `${localName(region.name, l)} ${monthName(m, l)} ${seo('avgTemp', l)} ${md.tempLow}~${md.tempHigh}°C, ${seo('rainfall', l)} ${md.rainfall}mm.${md.seaTemp ? ` ${md.seaTemp}°C.` : ''}`
              : `${localName(region.name, l)} ${monthName(m, l)} ${seo('weather', l)}.`,
          },
        },
        ...(comment ? [{
          '@type': 'Question' as const,
          name: `${localName(region.name, l)} ${monthName(m, l)} ${seo('bestTime', l)}?`,
          acceptedAnswer: {
            '@type': 'Answer' as const,
            text: `${localName(region.name, l)} ${monthName(m, l)}: ${typeof comment.summary === 'string' ? comment.summary : (comment.summary as Record<string, string>)[l] ?? (comment.summary as { ko: string }).ko}`,
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
