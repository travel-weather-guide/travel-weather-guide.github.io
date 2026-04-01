import type { Country, MonthlyRecommendation } from '@/types';
import countrySummaries from '@/data/countries.json';

export function getCountrySummaries() {
  return countrySummaries;
}

export function getCountry(countryId: string): Country {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`@/data/countries/${countryId}.json`) as Country;
}

export function getMonthlyRecommendation(month: number): MonthlyRecommendation {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`@/data/monthly-recommendations/${month}.json`) as MonthlyRecommendation;
}

export function getAllCountryIds(): string[] {
  return countrySummaries.map((c: { id: string }) => c.id);
}

export function getAllRegionParams(): { countryId: string; regionId: string }[] {
  const params: { countryId: string; regionId: string }[] = [];
  for (const summary of countrySummaries) {
    const country = getCountry(summary.id);
    for (const region of country.regions) {
      params.push({ countryId: country.id, regionId: region.id });
    }
  }
  return params;
}
