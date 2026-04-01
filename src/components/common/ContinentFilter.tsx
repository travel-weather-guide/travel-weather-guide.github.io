'use client';

import type { Continent } from '@/types';

const CONTINENTS: { value: Continent | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'asia', label: '아시아' },
  { value: 'europe', label: '유럽' },
  { value: 'north-america', label: '북미' },
  { value: 'south-america', label: '남미' },
  { value: 'oceania', label: '오세아니아' },
  { value: 'africa', label: '아프리카' },
];

interface ContinentFilterProps {
  selected: Continent | 'all';
  onChange: (value: Continent | 'all') => void;
}

export default function ContinentFilter({ selected, onChange }: ContinentFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CONTINENTS.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === c.value
              ? 'bg-sky-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-sky-100 hover:text-sky-600'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
