import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/contexts/LocaleContext';
import { localName, seo, monthName } from '@/utils/seo-locale';
import BestInMonthContent from '@/components/best-in/BestInMonthContent';
import { getRecommendation, buildRegionLookup } from '@/lib/data-server';

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ month: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; month: string }>;
}): Promise<Metadata> {
  const { locale, month } = await params;
  const l = locale as Locale;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) return {};

  return {
    title: `${monthName(m, l)} ${seo('recommended', l)}`,
    description: `${monthName(m, l)} ${seo('goodPlaces', l)}. ${seo('avoid', l)}. Best places to visit in ${monthName(m, 'en')}.`,
    alternates: {
      canonical: `/${locale}/best-in/${month}`,
      languages: {
        'ko': `/best-in/${month}`,
        'en-US': `/en/best-in/${month}`,
        'ja': `/ja/best-in/${month}`,
        'zh': `/zh/best-in/${month}`,
      },
    },
    openGraph: {
      locale: locale,
      title: `${monthName(m, l)} ${seo('recommended', l)}`,
      description: `${monthName(m, l)} ${seo('goodPlaces', l)}. ${seo('avoid', l)}.`,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function LocaleBestInMonthPage({
  params,
}: {
  params: Promise<{ locale: string; month: string }>;
}) {
  const { locale, month } = await params;
  const l = locale as Locale;
  const m = parseInt(month, 10);
  if (m < 1 || m > 12) notFound();

  const data = getRecommendation(m);
  if (!data) notFound();

  const regionLookup = buildRegionLookup();

  const BASE = 'https://travel-weather-guide.github.io';

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
                { '@type': 'ListItem', position: 1, name: 'Travel Weather', item: `${BASE}/${locale}` },
                { '@type': 'ListItem', position: 2, name: `${monthName(m, l)} ${seo('recommended', l)}`, item: `${BASE}/${locale}/best-in/${month}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `${monthName(m, l)} ${seo('recommended', l)}`,
              numberOfItems: data.bestDestinations.length,
              itemListElement: data.bestDestinations.map((dest, i) => {
                const info = regionLookup[dest.regionId];
                return {
                  '@type': 'ListItem',
                  position: i + 1,
                  name: info ? `${localName(info.regionName, l)}, ${localName(info.countryName, l)}` : dest.regionId,
                  url: info ? `${BASE}/${locale}/country/${info.countryId}/${dest.regionId}` : undefined,
                };
              }),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `${monthName(m, l)} ${seo('goodPlaces', l)}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${monthName(m, l)} ${seo('recommended', l)}: ${data.bestDestinations.slice(0, 5).map(d => { const info = regionLookup[d.regionId]; return info ? localName(info.regionName, l) : d.regionId; }).join(', ')}.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `${monthName(m, l)} ${seo('avoid', l)}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${monthName(m, l)} ${seo('recommended', l)} ${data.bestDestinations.length} ${seo('regions', l)}.`,
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
