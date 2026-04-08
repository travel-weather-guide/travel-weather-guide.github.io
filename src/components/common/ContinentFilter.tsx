'use client';

import type { Continent } from '@/types';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

const CONTINENT_VALUES: (Continent | 'all')[] = [
  'all', 'asia', 'europe', 'north-america', 'oceania', 'africa',
];

interface ContinentFilterProps {
  selected: Continent | 'all';
  onChange: (value: Continent | 'all') => void;
}

export default function ContinentFilter({ selected, onChange }: ContinentFilterProps) {
  const { locale } = useLocale();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CONTINENT_VALUES.map((value) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selected === value
              ? 'bg-sky-500 text-white shadow-sm'
              : 'bg-slate-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
          }`}
        >
          {t(messages.continents[value], locale)}
        </button>
      ))}
    </div>
  );
}
