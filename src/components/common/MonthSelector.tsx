'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface MonthSelectorProps {
  selected: number;
  onChange?: (month: number) => void;
  linkBase?: string;
}

export default function MonthSelector({ selected, onChange, linkBase }: MonthSelectorProps) {
  const { locale } = useLocale();

  return (
    <div className="relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none md:after:hidden">
    <div className="flex gap-1.5 overflow-x-auto pb-2">
      {(Object.keys(messages.months) as unknown as (keyof typeof messages.months)[]).map((key) => {
        const month = Number(key) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
        const isActive = month === selected;
        const className = `shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-sky-500 text-white shadow-sm'
            : 'bg-slate-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
        }`;

        if (linkBase) {
          return (
            <Link
              key={month}
              href={`${linkBase}${month}`}
              className={className}
            >
              {t(messages.months[month], locale)}
            </Link>
          );
        }

        return (
          <button
            key={month}
            onClick={() => onChange?.(month)}
            className={className}
          >
            {t(messages.months[month], locale)}
          </button>
        );
      })}
    </div>
    </div>
  );
}
