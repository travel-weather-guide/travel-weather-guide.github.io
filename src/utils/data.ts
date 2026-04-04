import type { Country } from '@/types';
import type { LocalizedString, LocalizedStringArray } from '@/types';
import type { Locale } from '@/contexts/LocaleContext';
import countrySummaries from '@/data/countries.json';

export function getCountrySummaries() {
  return countrySummaries;
}

export function getCountry(countryId: string): Country {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`@/data/countries/${countryId}.json`) as Country;
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

export function resolveLocalizedString(
  value: LocalizedString,
  locale: Locale,
): string {
  if (typeof value === 'string') return value;
  return value[locale] ?? value.en ?? value.ko;
}

export function resolveLocalizedStringArray(
  value: LocalizedStringArray,
  locale: Locale,
): string[] {
  if (Array.isArray(value)) return value;
  return value[locale] ?? value.en ?? value.ko;
}
