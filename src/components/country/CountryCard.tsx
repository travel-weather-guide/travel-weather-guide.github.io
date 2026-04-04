'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import { getLocalizedName } from '@/i18n/utils';
import { flagUrl } from '@/utils/data';

interface CountryCardProps {
  id: string;
  name: { ko: string; en: string; ja?: string; zh?: string };
  continent: string;
  regionCount: number;
  imageUrl?: string;
}

export default function CountryCard({ id, name, regionCount, imageUrl }: CountryCardProps) {
  const { locale } = useLocale();
  const flag = flagUrl(id);
  const localName = getLocalizedName(name, locale);

  if (imageUrl) {
    return (
      <Link
        href={`/country/${id}`}
        className="flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
      >
        <div className="relative h-40 w-full">
          <Image
            src={imageUrl}
            alt={`${localName} ${t(messages.countryCard.imageAlt, locale)}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="flex items-center gap-3 p-4">
          {flag && <img src={flag} alt="" className="h-4 w-6 object-cover" />}
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

  return (
    <Link
      href={`/country/${id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
    >
      {flag && <img src={flag} alt="" className="h-5 w-7 object-cover" />}
      <div>
        <h3 className="font-semibold text-gray-900">{localName}</h3>
        <p className="text-sm text-gray-500">
          {name.en} &middot; {regionCount}{t(messages.countryCard.regionCount, locale)}
        </p>
      </div>
    </Link>
  );
}
