import type { Country, MonthlyRecommendation } from '@/types';
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

export const FLAG_ALPHA2: Record<string, string> = {
  japan: 'jp',
  thailand: 'th',
  france: 'fr',
  usa: 'us',
  australia: 'au',
  vietnam: 'vn',
  philippines: 'ph',
  singapore: 'sg',
  indonesia: 'id',
  taiwan: 'tw',
  spain: 'es',
  italy: 'it',
  uk: 'gb',
  turkey: 'tr',
  greece: 'gr',
  china: 'cn',
  'hong-kong': 'hk',
  guam: 'gu',
  malaysia: 'my',
  cambodia: 'kh',
  maldives: 'mv',
  mongolia: 'mn',
  laos: 'la',
  switzerland: 'ch',
  czech: 'cz',
  croatia: 'hr',
  uae: 'ae',
  'new-zealand': 'nz',
  germany: 'de',
  portugal: 'pt',
  india: 'in',
  egypt: 'eg',
  canada: 'ca',
  austria: 'at',
  netherlands: 'nl',
  morocco: 'ma',
  'sri-lanka': 'lk',
  hungary: 'hu',
  mexico: 'mx',
  finland: 'fi',
  denmark: 'dk',
  iceland: 'is',
  macau: 'mo',
};

export function flagUrl(countryId: string): string {
  const code = FLAG_ALPHA2[countryId];
  return code ? `https://flagcdn.com/w40/${code}.png` : '';
}

export function getMonthlyRecommendation(month: number): MonthlyRecommendation {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(`@/data/monthly-recommendations/${month}.json`) as MonthlyRecommendation;
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
