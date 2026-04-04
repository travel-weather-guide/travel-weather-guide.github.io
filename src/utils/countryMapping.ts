import countrySummaries from '@/data/countries.json';

export const countrySlugToNumeric: Record<string, string> = Object.fromEntries(
  countrySummaries
    .filter((c) => c.isoNumeric)
    .map((c) => [c.id, c.isoNumeric as string]),
);

export const numericToCountrySlug: Record<string, string> = Object.fromEntries(
  Object.entries(countrySlugToNumeric).map(([slug, code]) => [code, slug]),
);
