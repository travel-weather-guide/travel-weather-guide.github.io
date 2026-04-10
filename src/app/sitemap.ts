import type { MetadataRoute } from 'next';

import { getAllCountryIds, getCountry } from '@/utils/data';

export const dynamic = 'force-static';

const BASE_URL = 'https://travel-weather-guide.github.io';
const LOCALES = ['en', 'ja', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1.0, lastModified: now },
    { url: `${BASE_URL}/country/`, changeFrequency: 'monthly', priority: 0.9, lastModified: now },
  ];

  for (const countryId of getAllCountryIds()) {
    const country = getCountry(countryId);
    entries.push({
      url: `${BASE_URL}/country/${country.id}/`,
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: now,
    });

    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/country/${country.id}/`,
        changeFrequency: 'monthly',
        priority: 0.5,
        lastModified: now,
      });
    }

    for (const region of country.regions) {
      entries.push({
        url: `${BASE_URL}/country/${country.id}/${region.id}/`,
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: now,
      });

      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/country/${country.id}/${region.id}/`,
          changeFrequency: 'monthly',
          priority: 0.5,
          lastModified: now,
        });
      }

      for (let m = 1; m <= 12; m++) {
        entries.push({
          url: `${BASE_URL}/country/${country.id}/${region.id}/${m}/`,
          changeFrequency: 'monthly',
          priority: 0.6,
          lastModified: now,
        });

        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}/country/${country.id}/${region.id}/${m}/`,
            changeFrequency: 'monthly',
            priority: 0.4,
            lastModified: now,
          });
        }
      }
    }
  }

  for (let month = 1; month <= 12; month++) {
    entries.push({
      url: `${BASE_URL}/best-in/${month}/`,
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: now,
    });

    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/best-in/${month}/`,
        changeFrequency: 'monthly',
        priority: 0.5,
        lastModified: now,
      });
    }
  }

  return entries;
}
