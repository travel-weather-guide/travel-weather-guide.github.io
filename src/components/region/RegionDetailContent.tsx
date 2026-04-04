'use client';

import Link from 'next/link';
import RegionTabs from '@/components/region/RegionTabs';
import type { Country, TravelComment } from '@/types';
import type { Region } from '@/types/country';
import { useLocale } from '@/contexts/LocaleContext';
import { getLocalizedName } from '@/i18n/utils';
import { resolveLocalizedString } from '@/utils/data';

type DailyDataMap = Record<number, { years: Record<string, Array<{ day: number; tempHigh: number; tempLow: number; rainfall: number; humidity: number }>> }>;

interface RegionDetailContentProps {
  country: Country;
  region: Region;
  comments: TravelComment[];
  dailyData: DailyDataMap;
  countryId: string;
  regionId: string;
}

export default function RegionDetailContent({ country, region, comments, dailyData, countryId }: RegionDetailContentProps) {
  const { locale } = useLocale();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* 헤더 */}
      <Link href={`/country/${countryId}`} className="text-sm text-sky-500 hover:text-sky-600">
        ← {getLocalizedName(country.name, locale)}
      </Link>
      <h1 className="mt-1 text-3xl font-bold text-gray-900">{getLocalizedName(region.name, locale)}</h1>
      <p className="mt-1 text-gray-500">{region.name.en} · {resolveLocalizedString(region.climateType, locale)}</p>

      {/* 탭 */}
      <div className="mt-6">
        <RegionTabs region={region} comments={comments} dailyData={dailyData} />
      </div>
    </main>
  );
}
