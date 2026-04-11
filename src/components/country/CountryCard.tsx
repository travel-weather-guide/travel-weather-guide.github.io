'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { getLocalizedName } from '@/i18n/utils';
import { flagUrl } from '@/utils/data';

const continentGradient: Record<string, string> = {
  asia: 'from-sky-100 to-sky-50',
  europe: 'from-indigo-100 to-indigo-50',
  'north-america': 'from-emerald-100 to-emerald-50',
  'south-america': 'from-amber-100 to-amber-50',
  oceania: 'from-teal-100 to-teal-50',
  africa: 'from-orange-100 to-orange-50',
};

interface CountryCardProps {
  id: string;
  name: { ko: string; en: string; ja?: string; zh?: string };
  continent: string;
  regionCount: number;
  imageUrl?: string;
}

export default function CountryCard({ id, name, continent, regionCount, imageUrl }: CountryCardProps) {
  const { locale } = useLocale();
  const flag = flagUrl(id);
  const localName = getLocalizedName(name, locale);

  const imageBlock = imageUrl ? (
    <div className="relative h-40 w-full">
      <Image
        src={imageUrl}
        alt={`${localName} ${t(messages.countryCard.imageAlt, locale)}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    </div>
  ) : (
    <div className={`h-40 w-full bg-gradient-to-br ${continentGradient[continent] ?? 'from-gray-100 to-gray-50'} flex items-center justify-center`}>
      {flag
        ? <img src={flag} alt="" className="h-12 w-16 object-cover opacity-80" />
        : <span className="text-3xl font-bold text-gray-400">{name.en.slice(0, 2).toUpperCase()}</span>
      }
    </div>
  );

  return (
    <Link
      href={`/country/${id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-sky-200"
    >
      {imageBlock}
      <div className="flex items-center gap-3 p-5">
        {flag && <img src={flag} alt="" className="h-5 w-7 object-cover shrink-0" />}
        <div>
          <h3 className="font-semibold text-gray-900">{localName}</h3>
          <p className="text-sm text-gray-500">
            {name.en} &middot; {regionCount}{t(messages.countryCard.regionCount, locale)}
          </p>
        </div>
      </div>
    </Link>
  );
}
