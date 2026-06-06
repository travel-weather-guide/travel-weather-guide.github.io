/**
 * Server component (NO 'use client') — renders a theme curation page as static
 * HTML so it is fully crawlable in the static export. Receives a precomputed,
 * deterministic ranking and source-checked prose; renders intro, a comparison
 * table from real climate data, ranked destination links, FAQ, citations, and
 * reverse cross-links to the other theme pages.
 */
import Link from 'next/link';
import {
  THEME_NAMES,
  THEME_SLUGS,
  bestMonthsLabel,
  type Loc,
  type ThemeColumn,
  type ThemeContent as Content,
  type ThemeRow,
  type ThemeSlug,
} from '@/lib/theme-data';
import { flagUrl } from '@/utils/data';

type Name = { ko: string; en: string; ja?: string; zh?: string };
const nm = (n: Name, l: Loc) => n[l] ?? n.en ?? n.ko;

const UI = {
  rank: { ko: '순위', en: '#', ja: '順位', zh: '排名' },
  destination: { ko: '여행지', en: 'Destination', ja: '旅行先', zh: '目的地' },
  bestTime: { ko: '추천 시기', en: 'Best time', ja: 'おすすめ時期', zh: '推荐时期' },
  related: { ko: '다른 테마로 찾아보기', en: 'Browse other themes', ja: '他のテーマで探す', zh: '浏览其他主题' },
  source: { ko: '데이터 출처', en: 'Data source', ja: 'データ出典', zh: '数据来源' },
  detail: { ko: '월별 날씨 보기', en: 'See monthly weather', ja: '月別の天気を見る', zh: '查看逐月天气' },
  home: { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' },
  themesTitle: { ko: '테마별 여행지', en: 'Travel by Theme', ja: 'テーマ別旅行先', zh: '主题旅行' },
} as const;

const u = (k: keyof typeof UI, l: Loc) => UI[k][l] ?? UI[k].en;

interface Props {
  slug: ThemeSlug;
  locale: Loc;
  content: Content;
  rows: ThemeRow[];
  columns: ThemeColumn[];
  /** '' for Korean, '/en' | '/ja' | '/zh' for locale variants. */
  basePath: string;
}

export default function ThemeContent({ slug, locale, content, rows, columns, basePath }: Props) {
  const intro = content.intro[locale] ?? content.intro.en;
  const others = THEME_SLUGS.filter((s) => s !== slug);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400">
        <Link href={`${basePath}/`} className="hover:text-sky-600">
          {u('home', locale)}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-500">{nm(THEME_NAMES[slug], locale)}</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">{nm(content.h1, locale)}</h1>

      {/* Intro prose */}
      <div className="mt-4 space-y-3">
        {intro.map((p, i) => (
          <p key={i} className="leading-relaxed text-gray-600">
            {p}
          </p>
        ))}
      </div>

      {/* Comparison table */}
      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold text-gray-800">{nm(content.h1, locale)} TOP {rows.length}</h2>
        <p className="mb-3 text-xs text-gray-400">{nm(content.tableCaption, locale)}</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-gray-500">
                <th className="px-3 py-2.5 font-medium">{u('rank', locale)}</th>
                <th className="px-3 py-2.5 font-medium">{u('destination', locale)}</th>
                {columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-3 py-2.5 font-medium">
                    {c.label[locale] ?? c.label.en}
                  </th>
                ))}
                <th className="whitespace-nowrap px-3 py-2.5 font-medium">{u('bestTime', locale)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.regionId} className="border-t border-slate-100 hover:bg-sky-50/40">
                  <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <Link
                      href={`${basePath}/country/${r.countryId}/${r.regionId}`}
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-sky-600"
                    >
                      <img src={flagUrl(r.countryId)} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
                      <span>{nm(r.regionName, locale)}</span>
                      <span className="text-xs font-normal text-gray-400">{nm(r.countryName, locale)}</span>
                    </Link>
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-3 py-2.5 text-gray-900">
                      {c.format(r, locale)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-3 py-2.5 text-gray-500">{bestMonthsLabel(r, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400">{nm(content.dataNote, locale)}</p>
      </section>

      {/* Destination quick links (forward internal links) */}
      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {rows.map((r) => (
            <Link
              key={r.regionId}
              href={`${basePath}/country/${r.countryId}/${r.regionId}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-sky-200 hover:text-sky-600"
            >
              {nm(r.regionName, locale)}
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-gray-800">FAQ</h2>
        <div className="space-y-4">
          {content.faq.map((item, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">{nm(item.q, locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{nm(item.a, locale)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-theme links (reverse internal linking) */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-gray-800">{u('related', locale)}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {others.map((s) => (
            <Link
              key={s}
              href={`${basePath}/theme/${s}`}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all hover:border-sky-200 hover:text-sky-600 hover:shadow-sm"
            >
              {nm(THEME_NAMES[s], locale)}
            </Link>
          ))}
        </div>
      </section>

      {/* Citations / data source */}
      <section className="mt-10 border-t border-slate-100 pt-5">
        <p className="text-xs text-gray-400">
          {u('source', locale)}:{' '}
          {content.citations.map((c, i) => (
            <span key={i}>
              {i > 0 && ', '}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
              >
                {nm(c.label, locale)}
              </a>
            </span>
          ))}
        </p>
      </section>
    </main>
  );
}
