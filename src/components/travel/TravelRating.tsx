'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

const ratingColors: Record<number, string> = {
  5: 'bg-emerald-500',
  4: 'bg-sky-500',
  3: 'bg-yellow-400',
  2: 'bg-orange-400',
  1: 'bg-red-400',
};

interface TravelRatingProps {
  month: number;
  rating: number;
  summary: string;
}

export default function TravelRating({ month, rating, summary }: TravelRatingProps) {
  const { locale } = useLocale();
  const color = ratingColors[rating] ?? ratingColors[3];
  const label = t(messages.ratings[rating as keyof typeof messages.ratings] ?? messages.ratings[3], locale);

  return (
    <div className="rounded-2xl bg-slate-50 p-4 flex items-center gap-4">
      <span className="text-sm font-semibold text-gray-800 w-12">{month}{t(messages.regionList.monthSuffix, locale)}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-2.5 w-8 rounded-full ${n <= rating ? color : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-600">{summary}</span>
    </div>
  );
}
