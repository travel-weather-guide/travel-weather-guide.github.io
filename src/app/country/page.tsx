'use client';

import { useState } from 'react';
import ContinentFilter from '@/components/common/ContinentFilter';
import CountryCard from '@/components/country/CountryCard';
import countrySummaries from '@/data/countries.json';
import type { Continent } from '@/types';

export default function CountryListPage() {
  const [filter, setFilter] = useState<Continent | 'all'>('all');

  const filtered =
    filter === 'all'
      ? countrySummaries
      : countrySummaries.filter((c) => c.continent === filter);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">국가 목록</h1>
      <div className="mb-6">
        <ContinentFilter selected={filter} onChange={setFilter} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CountryCard
            key={c.id}
            id={c.id}
            name={c.name}
            continent={c.continent}
            regionCount={c.regionCount}
          />
        ))}
      </div>
    </main>
  );
}
