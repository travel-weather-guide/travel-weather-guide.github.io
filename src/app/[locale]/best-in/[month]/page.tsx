import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { MonthlyRecommendation, Country } from '@/types';
import { getAllCountryIds } from '@/utils/data';
import type { Locale } from '@/contexts/LocaleContext';
import { localName, seo, monthName } from '@/utils/seo-locale';
import BestInMonthContent from '@/components/best-in/BestInMonthContent';

const DATA_DIR = join(process.cwd(), 'src/data');

function getRecommendation(month: number): MonthlyRecommendation | null {
  try {
    return JSON.parse(readFileSync(join(DATA_DIR, 'monthly-recommendations', `${month}.json`), 'utf-8'));
  } catch {
    return null;
  }
}

export interface RegionInfo {
  countryId: string;
  countryName: { ko: string; en: string; ja?: string; zh?: string };
  regionName: { ko: string; en: string; ja?: string; zh?: string };
}

function buildRegionLookup(): Record<string, RegionInfo> {
  const lookup: Record<string, RegionInfo> = {};
  for (const countryId of getAllCountryIds()) {
    try {
      const country = JSON.parse(readFileSync(join(DATA_DIR, 'countries', `${countryId}.json`), 'utf-8')) as Country;
      for (const region of country.regions) {
        lookup[region.id] = {
          countryId: country.id,
          countryName: country.name as RegionInfo['countryName'],
          regionName: region.name as RegionInfo['regionName'],
        };
      }
    } catch { /* skip */ }
  }
  return lookup;
}

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
