'use client';

import Link from 'next/link';
import type { Region, TravelComment } from '@/types';
import { getBestMonths } from '@/utils/scoring';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { getLocalizedName } from '@/i18n/utils';
import { resolveLocalizedString } from '@/utils/data';

const ratingConfig: Record<number, { color: string }> = {
  5: { color: 'bg-green-100 text-green-700' },
  4: { color: 'bg-sky-100 text-sky-700' },
  3: { color: 'bg-yellow-100 text-yellow-700' },
  2: { color: 'bg-orange-100 text-orange-700' },
  1: { color: 'bg-red-100 text-red-700' },
};

interface RegionListProps {
  countryId: string;
  regions: Region[];
  comments?: TravelComment[];
}

export default function RegionList({ countryId, regions, comments = [] }: RegionListProps) {
  const { locale } = useLocale();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {regions.map((region) => {
        const data = region.monthlyData[currentMonth - 1];
        const regionComments = comments.filter((c) => c.regionId === region.id);
        const ratings = regionComments.length === 12
          ? regionComments.sort((a, b) => a.month - b.month).map((c) => c.rating)
          : undefined;
        const bestMonths = getBestMonths(region.monthlyData, 3, ratings);
        const comment = comments.find(
          (c) => c.regionId === region.id && c.month === currentMonth
        );
        const ratingEntry = comment ? ratingConfig[comment.rating] : null;
        const ratingLabel = comment ? t(messages.ratings[comment.rating as keyof typeof messages.ratings], locale) : null;

        return (
          <Link
            key={region.id}
            href={`/country/${countryId}/${region.id}`}
            className="rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{getLocalizedName(region.name, locale)}</h3>
                <p className="text-sm text-gray-500">{resolveLocalizedString(region.climateType, locale)}</p>
              </div>
              {ratingEntry && ratingLabel && (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${ratingEntry.color}`}>
                  {currentMonth}{t(messages.regionList.monthSuffix, locale)} {ratingLabel}
                </span>
              )}
            </div>

            {data && (
              <p className="mt-2 text-sm text-gray-600">
                {data.tempLow}°~{data.tempHigh}° · {resolveLocalizedString(data.weatherSummary, locale)}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-1">
              {bestMonths.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600"
                >
                  {t(messages.months[m as keyof typeof messages.months], locale)}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
