import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Country, TravelComment } from '@/types';
import type { Locale } from '@/contexts/LocaleContext';
import CountryDetailContent from '@/components/country/CountryDetailContent';
import { localName, seo, localeHreflangAlternates } from '@/utils/seo-locale';

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
  params: Promise<{ locale: string; countryId: string }>;
}): Promise<Metadata> {
  const { locale, countryId } = await params;
  const l = locale as Locale;
  const country = getCountry(countryId);
  if (!country) return {};

  const regionNamesLocal = country.regions.slice(0, 3).map(r => localName(r.name, l)).join(', ');

  return {
    title: `${localName(country.name, l)} ${seo('weather', l)} · ${seo('monthlyWeather', l)} · ${seo('bestTime', l)}`,
    description: `${localName(country.name, l)} ${seo('monthlyWeather', l)}. ${seo('historical', l)} ${regionNamesLocal} ${country.regions.length} ${seo('regions', l)}. ${seo('travelGuide', l)}.`,
    alternates: {
      canonical: `/${locale}/country/${countryId}`,
      languages: {
        'ko': `/country/${countryId}`,
        'en-US': `/en/country/${countryId}`,
        'ja': `/ja/country/${countryId}`,
        'zh': `/zh/country/${countryId}`,
      },
    },
    openGraph: {
      title: `${localName(country.name, l)} ${seo('weather', l)} · ${seo('monthlyWeather', l)}`,
      description: `${localName(country.name, l)} ${seo('monthlyWeather', l)}. ${seo('travelGuide', l)}.`,
      images: [`/og/${countryId}.png`],
    },
  };
}

export default async function LocaleCountryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; countryId: string }>;
}) {
  const { locale, countryId } = await params;
  const l = locale as Locale;
  const country = getCountry(countryId);
  if (!country) notFound();

  const comments = getComments(countryId);

  const bestMonthSet = new Set<number>();
  for (const c of comments) {
    if (c.rating >= 4) bestMonthSet.add(c.month);
  }
  const bestMonthsSorted = [...bestMonthSet].sort((a, b) => a - b);

  const countryNameLocal = localName(country.name, l);

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: localName({ ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' }, l), item: 'https://travel-weather-guide.github.io' },
        { '@type': 'ListItem', position: 2, name: localName({ ko: '국가', en: 'Countries', ja: '国・地域', zh: '国家' }, l), item: `https://travel-weather-guide.github.io/${locale}/country` },
        { '@type': 'ListItem', position: 3, name: countryNameLocal, item: `https://travel-weather-guide.github.io/${locale}/country/${countryId}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Country',
      name: countryNameLocal,
      alternateName: [country.name.ko, country.name.en, country.name.ja, country.name.zh].filter(Boolean),
      url: `https://travel-weather-guide.github.io/${locale}/country/${countryId}`,
    },
  ];

  if (bestMonthsSorted.length > 0) {
    const faqQ1: Record<Locale, string> = {
      ko: `${countryNameLocal} 여행하기 좋은 시기는 언제인가요?`,
      en: `When is the best time to visit ${countryNameLocal}?`,
      ja: `${countryNameLocal}の旅行に最適な時期はいつですか？`,
      zh: `什么时候是去${countryNameLocal}旅行的最佳时间？`,
    };
    const faqA1: Record<Locale, string> = {
      ko: `${countryNameLocal}의 여행 베스트 시즌은 ${bestMonthsSorted.map(m => `${m}월`).join(', ')}입니다.`,
      en: `The best time to visit ${countryNameLocal} is ${bestMonthsSorted.map(m => new Date(2000, m - 1).toLocaleString('en', { month: 'long' })).join(', ')}.`,
      ja: `${countryNameLocal}の旅行ベストシーズンは${bestMonthsSorted.map(m => `${m}月`).join('、')}です。`,
      zh: `${countryNameLocal}的最佳旅行季节是${bestMonthsSorted.map(m => `${m}月`).join('、')}。`,
    };
    const faqQ2: Record<Locale, string> = {
      ko: `${countryNameLocal} 월간날씨는 어떤가요?`,
      en: `What is the monthly weather like in ${countryNameLocal}?`,
      ja: `${countryNameLocal}の月間天気はどうですか？`,
      zh: `${countryNameLocal}的月度天气怎么样？`,
    };
    const faqA2: Record<Locale, string> = {
      ko: `${countryNameLocal}의 ${country.regions.length}개 주요 도시별 1월~12월 월간날씨, 과거 기후 데이터 기반 기온·강수량·습도 정보를 제공합니다.`,
      en: `We provide monthly weather data for ${country.regions.length} major cities in ${countryNameLocal}, including temperature, rainfall, and humidity based on historical climate data.`,
      ja: `${countryNameLocal}の${country.regions.length}つの主要都市の1月〜12月の月間天気、過去の気候データに基づく気温・降水量・湿度情報を提供します。`,
      zh: `我们提供${countryNameLocal}${country.regions.length}个主要城市1月至12月的月度天气数据，包括基于历史气候数据的气温、降水量和湿度信息。`,
    };

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: faqQ1[l],
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqA1[l],
          },
        },
        {
          '@type': 'Question',
          name: faqQ2[l],
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqA2[l],
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
