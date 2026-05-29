import { writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://travel-weather-guide.github.io';
const CHUNK_COUNT = 5;
const OUT_DIR = join(process.cwd(), 'out');
const now = new Date().toISOString().split('T')[0];

const chunks = Array.from(
  { length: CHUNK_COUNT },
  (_, id) => `  <sitemap>
    <loc>${BASE_URL}/sitemap/${id}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks}
</sitemapindex>
`;

writeFileSync(join(OUT_DIR, 'sitemap.xml'), xml);
console.log(`✓ Wrote sitemap index → out/sitemap.xml (${CHUNK_COUNT} chunks)`);
