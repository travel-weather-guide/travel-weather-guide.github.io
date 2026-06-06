import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/contexts/LocaleContext';
import ThemeContent from '@/components/theme/ThemeContent';
import { localeHreflangAlternates } from '@/utils/seo-locale';
import {
  THEMES,
  THEME_NAMES,
  THEME_SLUGS,
  getThemeContent,
  getThemeRanking,
  isThemeSlug,
  type Loc,
} from '@/lib/theme-data';

const BASE = 'https://travel-weather-guide.github.io';

export function generateStaticParams() {
  return THEME_SLUGS.map((theme) => ({ theme }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; theme: string }>;
}): Promise<Metadata> {
  const { locale, theme } = await params;
  const l = locale as Loc;
  if (!isThemeSlug(theme)) return {};
  const content = getThemeContent(theme);
  return {
    title: content.title[l] ?? content.title.en,
    description: content.metaDescription[l] ?? content.metaDescription.en,
    alternates: localeHreflangAlternates(`/theme/${theme}`, locale as Locale),
    openGraph: {
      locale,
      title: content.title[l] ?? content.title.en,
      description: content.metaDescription[l] ?? content.metaDescription.en,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function LocaleThemePage({
  params,
}: {
  params: Promise<{ locale: string; theme: string }>;
}) {
  const { locale, theme } = await params;
  const l = locale as Loc;
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
                { '@type': 'ListItem', position: 1, name: 'Travel Weather', item: `${BASE}/${locale}` },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: THEME_NAMES[theme][l] ?? THEME_NAMES[theme].en,
                  item: `${BASE}/${locale}/theme/${theme}`,
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: content.h1[l] ?? content.h1.en,
              numberOfItems: rows.length,
              itemListElement: rows.map((r, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${r.regionName[l] ?? r.regionName.en}, ${r.countryName[l] ?? r.countryName.en}`,
                url: `${BASE}/${locale}/country/${r.countryId}/${r.regionId}`,
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.faq.map((f) => ({
                '@type': 'Question',
                name: f.q[l] ?? f.q.en,
                acceptedAnswer: { '@type': 'Answer', text: f.a[l] ?? f.a.en },
              })),
            },
          ]),
        }}
      />
      <ThemeContent
        slug={theme}
        locale={l}
        content={content}
        rows={rows}
        columns={columns}
        basePath={`/${locale}`}
      />
    </>
  );
}
