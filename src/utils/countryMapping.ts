// world-atlas uses ISO 3166-1 numeric codes as feature IDs
// Maps our app's country slugs to these numeric codes

export const countrySlugToNumeric: Record<string, string> = {
  japan: '392',
  thailand: '764',
  france: '250',
  usa: '840',
  australia: '036',
};

export const numericToCountrySlug: Record<string, string> = Object.fromEntries(
  Object.entries(countrySlugToNumeric).map(([slug, code]) => [code, slug]),
);
