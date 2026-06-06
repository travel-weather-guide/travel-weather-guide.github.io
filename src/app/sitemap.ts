import type { MetadataRoute } from 'next';

import { getAllCountryIds, getCountry } from '@/utils/data';
import { THEME_SLUGS } from '@/lib/theme-data';
import { LEGAL_DOCS } from '@/content/legal';

export const dynamic = 'force-static';

const BASE_URL = 'https://travel-weather-guide.github.io';
const LOCALES = ['en', 'ja', 'zh'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString().split('T')[0];
  const entries: MetadataRoute.Sitemap = [];

  entries.push(
    { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1.0, lastModified: now },
    { url: `${BASE_URL}/country/`, changeFrequency: 'monthly', priority: 0.9, lastModified: now },
  );

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

  for (const theme of THEME_SLUGS) {
    entries.push({
      url: `${BASE_URL}/theme/${theme}/`,
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: now,
    });

    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/theme/${theme}/`,
        changeFrequency: 'monthly',
        priority: 0.5,
        lastModified: now,
      });
    }
  }

  for (const doc of LEGAL_DOCS) {
    entries.push({
      url: `${BASE_URL}/legal/${doc}/`,
      changeFrequency: 'yearly',
      priority: 0.3,
      lastModified: now,
    });

    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/legal/${doc}/`,
        changeFrequency: 'yearly',
        priority: 0.2,
        lastModified: now,
      });
    }
  }

  const allCountries = getAllCountryIds();

  for (const countryId of allCountries) {
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

  return entries;
}
