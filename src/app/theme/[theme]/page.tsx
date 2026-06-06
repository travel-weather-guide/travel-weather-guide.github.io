import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ThemeContent from '@/components/theme/ThemeContent';
import { hreflangAlternates } from '@/utils/seo-locale';
import {
  THEMES,
  THEME_NAMES,
  THEME_SLUGS,
  getThemeContent,
  getThemeRanking,
  isThemeSlug,
} from '@/lib/theme-data';

const BASE = 'https://travel-weather-guide.github.io';

export function generateStaticParams() {
  return THEME_SLUGS.map((theme) => ({ theme }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme } = await params;
  if (!isThemeSlug(theme)) return {};
  const content = getThemeContent(theme);
  return {
    title: content.title.ko,
    description: content.metaDescription.ko,
    alternates: hreflangAlternates(`/theme/${theme}`),
    openGraph: {
      title: content.title.ko,
      description: content.metaDescription.ko,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  if (!isThemeSlug(theme)) notFound();

  const content = getThemeContent(theme);
  const rows = getThemeRanking(theme);
  const columns = THEMES[theme].columns;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: '홈', item: BASE },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: THEME_NAMES[theme].ko,
                  item: `${BASE}/theme/${theme}`,
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: content.h1.ko,
              numberOfItems: rows.length,
              itemListElement: rows.map((r, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${r.regionName.ko}, ${r.countryName.ko}`,
                url: `${BASE}/country/${r.countryId}/${r.regionId}`,
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.faq.map((f) => ({
                '@type': 'Question',
                name: f.q.ko,
                acceptedAnswer: { '@type': 'Answer', text: f.a.ko },
              })),
            },
          ]),
        }}
      />
      <ThemeContent
        slug={theme}
        locale="ko"
        content={content}
        rows={rows}
        columns={columns}
        basePath=""
      />
    </>
  );
}
