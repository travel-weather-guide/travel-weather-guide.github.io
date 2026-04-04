import type { MetadataRoute } from 'next';

import japanData from '@/data/countries/japan.json';
import thailandData from '@/data/countries/thailand.json';
import franceData from '@/data/countries/france.json';
import usaData from '@/data/countries/usa.json';
import australiaData from '@/data/countries/australia.json';

const allCountries = [japanData, thailandData, franceData, usaData, australiaData];

const BASE_URL = 'https://travel-weather.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/country`, changeFrequency: 'monthly', priority: 0.9, lastModified: new Date() },
  ];

  for (const country of allCountries) {
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
