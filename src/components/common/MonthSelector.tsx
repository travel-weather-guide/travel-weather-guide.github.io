'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

interface MonthSelectorProps {
  selected: number;
  onChange: (month: number) => void;
}

export default function MonthSelector({ selected, onChange }: MonthSelectorProps) {
  const { locale } = useLocale();

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2">
      {(Object.keys(messages.months) as unknown as (keyof typeof messages.months)[]).map((key) => {
        const month = Number(key) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
        const isActive = month === selected;
        return (
          <button
            key={month}
            onClick={() => onChange(month)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            {t(messages.months[month], locale)}
          </button>
        );
      })}
    </div>
  );
}
