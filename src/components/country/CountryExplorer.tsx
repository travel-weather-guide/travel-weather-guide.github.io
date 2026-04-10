'use client';

import { useState } from 'react';
import ContinentFilter from '@/components/common/ContinentFilter';
import CountryCard from '@/components/country/CountryCard';
import type { Country, Continent } from '@/types';

interface CountryExplorerProps {
  allCountries: Country[];
}

export default function CountryExplorer({ allCountries }: CountryExplorerProps) {
  const [filter, setFilter] = useState<Continent | 'all'>('all');

  const filteredCountries =
    filter === 'all'
      ? allCountries
      : allCountries.filter((c) => c.continent === filter);

  return (
    <div className="flex flex-col gap-6">
      <ContinentFilter selected={filter} onChange={setFilter} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCountries.map((c) => (
          <CountryCard
            key={c.id}
            id={c.id}
            name={c.name}
            continent={c.continent}
            regionCount={c.regions.length}
            imageUrl={c.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
