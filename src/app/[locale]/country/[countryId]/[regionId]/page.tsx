import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Country, TravelComment } from '@/types';
import type { Locale } from '@/contexts/LocaleContext';
import RegionDetailContent from '@/components/region/RegionDetailContent';
import { localName, seo, localeHreflangAlternates } from '@/utils/seo-locale';

const DATA_DIR = join(process.cwd(), 'src/data');

type DailyDataMap = Record<number, { years: Record<string, Array<{ day: number; tempHigh: number; tempLow: number; rainfall: number; humidity: number }>> }>;

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

function getDailyData(regionId: string): DailyDataMap {
  const path = join(DATA_DIR, 'daily', regionId, 'all.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as DailyDataMap;
  } catch {
    return {};
  }
}

function getAllCountryIds(): string[] {
  const summaries = JSON.parse(readFileSync(join(DATA_DIR, 'countries.json'), 'utf-8'));
  return summaries.map((c: { id: string }) => c.id);
}

function getAllRegionParams() {
  const params: { countryId: string; regionId: string }[] = [];
  for (const countryId of getAllCountryIds()) {
    const country = getCountry(countryId);
    if (!country) continue;
    for (const region of country.regions) {
      params.push({ countryId, regionId: region.id });
    }
  }
  return params;
}

export function generateStaticParams() {
  return getAllRegionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; countryId: string; regionId: string }>;
}): Promise<Metadata> {
  const { locale, countryId, regionId } = await params;
  const l = locale as Locale;
  const country = getCountry(countryId);
  const region = country?.regions.find(r => r.id === regionId);
  if (!country || !region) return {};

  return {
    title: `${localName(region.name, l)} ${seo('weather', l)} · ${seo('monthlyWeather', l)} · ${seo('travelGuide', l)} (${localName(country.name, l)})`,
    description: `${localName(country.name, l)} ${localName(region.name, l)} ${seo('monthlyWeather', l)}. ${seo('historical', l)} ${seo('travelGuide', l)}. ${region.name.en} ${country.name.en}.`,
    alternates: {
      canonical: `/${locale}/country/${countryId}/${regionId}`,
      languages: {
        'ko': `/country/${countryId}/${regionId}`,
        'en-US': `/en/country/${countryId}/${regionId}`,
        'ja': `/ja/country/${countryId}/${regionId}`,
        'zh': `/zh/country/${countryId}/${regionId}`,
      },
    },
    openGraph: {
      title: `${localName(region.name, l)} ${seo('weather', l)} · ${seo('monthlyWeather', l)}`,
      description: `${localName(country.name, l)} ${localName(region.name, l)} ${seo('monthlyWeather', l)}. ${seo('travelGuide', l)}.`,
      images: [`/og/${countryId}.png`],
    },
  };
}

export default async function LocaleRegionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; countryId: string; regionId: string }>;
}) {
  const { locale, countryId, regionId } = await params;
  const l = locale as Locale;
  const country = getCountry(countryId);
  const region = country?.regions.find((r) => r.id === regionId);

  if (!country || !region) notFound();

  const comments = getComments(countryId).filter((c) => c.regionId === regionId);
  const dailyData = getDailyData(regionId);
  const bestMonths = comments.filter(c => c.rating >= 4).sort((a, b) => b.rating - a.rating);

  const regionNameLocal = localName(region.name, l);
  const countryNameLocal = localName(country.name, l);

  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: localName({ ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' }, l), item: 'https://travel-weather-guide.github.io' },
        { '@type': 'ListItem', position: 2, name: localName({ ko: '국가', en: 'Countries', ja: '国・地域', zh: '国家' }, l), item: `https://travel-weather-guide.github.io/${locale}/country` },
        { '@type': 'ListItem', position: 3, name: countryNameLocal, item: `https://travel-weather-guide.github.io/${locale}/country/${countryId}` },
        { '@type': 'ListItem', position: 4, name: regionNameLocal, item: `https://travel-weather-guide.github.io/${locale}/country/${countryId}/${regionId}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: regionNameLocal,
      alternateName: region.name.en,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: region.latitude,
        longitude: region.longitude,
      },
      containedInPlace: {
        '@type': 'Country',
        name: countryNameLocal,
      },
    },
  ];

  const faqEntries: Array<{ '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }> = [];

  if (bestMonths.length > 0) {
    const bestMonthNums = bestMonths.map(m => m.month);

    const bestTimeQ: Record<Locale, string> = {
      ko: `${regionNameLocal} 여행하기 좋은 시기는 언제인가요?`,
      en: `When is the best time to visit ${regionNameLocal}?`,
      ja: `${regionNameLocal}の旅行に最適な時期はいつですか？`,
      zh: `什么时候是去${regionNameLocal}旅行的最佳时间？`,
    };

    const firstSummary = bestMonths[0].summary;
    const summaryText = typeof firstSummary === 'string' ? firstSummary : firstSummary.ko;

    const bestTimeA: Record<Locale, string> = {
      ko: `${regionNameLocal}의 여행 적기는 ${bestMonthNums.map(m => `${m}월`).join(', ')}입니다. ${summaryText}`,
      en: `The best time to visit ${regionNameLocal} is ${bestMonthNums.map(m => new Date(2000, m - 1).toLocaleString('en', { month: 'long' })).join(', ')}.`,
      ja: `${regionNameLocal}の旅行ベストシーズンは${bestMonthNums.map(m => `${m}月`).join('、')}です。`,
      zh: `${regionNameLocal}的最佳旅行季节是${bestMonthNums.map(m => `${m}月`).join('、')}。`,
    };

    faqEntries.push({
      '@type': 'Question',
      name: bestTimeQ[l],
      acceptedAnswer: {
        '@type': 'Answer',
        text: bestTimeA[l],
      },
    });

    for (const bm of bestMonths.slice(0, 3)) {
      const md = region.monthlyData?.[bm.month - 1];
      if (md) {
        const monthWeatherQ: Record<Locale, string> = {
          ko: `${regionNameLocal} ${bm.month}월 날씨는 어떤가요?`,
          en: `What is the weather like in ${regionNameLocal} in ${new Date(2000, bm.month - 1).toLocaleString('en', { month: 'long' })}?`,
          ja: `${regionNameLocal}の${bm.month}月の天気はどうですか？`,
          zh: `${regionNameLocal}${bm.month}月的天气怎么样？`,
        };
        const monthWeatherA: Record<Locale, string> = {
          ko: `${regionNameLocal}의 ${bm.month}월 평균 기온은 ${md.tempLow}~${md.tempHigh}°C이며, 강수량은 ${md.rainfall}mm입니다.${md.seaTemp ? ` 바다 수온은 ${md.seaTemp}°C입니다.` : ''}`,
          en: `The average temperature in ${regionNameLocal} in ${new Date(2000, bm.month - 1).toLocaleString('en', { month: 'long' })} is ${md.tempLow}–${md.tempHigh}°C, with ${md.rainfall}mm of rainfall.${md.seaTemp ? ` Sea temperature is ${md.seaTemp}°C.` : ''}`,
          ja: `${regionNameLocal}の${bm.month}月の平均気温は${md.tempLow}〜${md.tempHigh}°Cで、降水量は${md.rainfall}mmです。${md.seaTemp ? `海水温は${md.seaTemp}°Cです。` : ''}`,
          zh: `${regionNameLocal}${bm.month}月的平均气温为${md.tempLow}~${md.tempHigh}°C，降水量为${md.rainfall}mm。${md.seaTemp ? `海水温度为${md.seaTemp}°C。` : ''}`,
        };

        faqEntries.push({
          '@type': 'Question',
          name: monthWeatherQ[l],
          acceptedAnswer: {
            '@type': 'Answer',
            text: monthWeatherA[l],
          },
        });
      }
    }
  }

  const monthlyWeatherQ: Record<Locale, string> = {
    ko: `${regionNameLocal} 월간날씨 정보가 있나요?`,
    en: `Is there monthly weather information for ${regionNameLocal}?`,
    ja: `${regionNameLocal}の月間天気情報はありますか？`,
    zh: `有${regionNameLocal}的月度天气信息吗？`,
  };
  const monthlyWeatherA: Record<Locale, string> = {
    ko: `${regionNameLocal}의 1월~12월 월간날씨, 과거 기후 데이터 기반 일별 기온·강수량 정보를 제공합니다.`,
    en: `We provide monthly weather data for ${regionNameLocal} from January to December, including daily temperature and rainfall based on historical climate data.`,
    ja: `${regionNameLocal}の1月〜12月の月間天気、過去の気候データに基づく日別気温・降水量情報を提供します。`,
    zh: `我们提供${regionNameLocal}1月至12月的月度天气数据，包括基于历史气候数据的每日气温和降水量信息。`,
  };

  faqEntries.push({
    '@type': 'Question',
    name: monthlyWeatherQ[l],
    acceptedAnswer: {
      '@type': 'Answer',
      text: monthlyWeatherA[l],
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
