import type { MetadataRoute } from 'next';

import { getAllCountryIds, getCountry } from '@/utils/data';

const BASE_URL = 'https://travel-weather.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/country`, changeFrequency: 'monthly', priority: 0.9, lastModified: new Date() },
  ];

  for (const countryId of getAllCountryIds()) {
    const country = getCountry(countryId);
    entries.push({
      url: `${BASE_URL}/country/${country.id}`,
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: new Date(),
    });

    for (const region of country.regions) {
      entries.push({
        url: `${BASE_URL}/country/${country.id}/${region.id}`,
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
