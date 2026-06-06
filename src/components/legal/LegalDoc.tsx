/**
 * Server component (NO 'use client') — renders a trust/legal page as static,
 * crawlable HTML. Pure prose; no interactivity.
 */
import Link from 'next/link';
import type { Locale } from '@/contexts/LocaleContext';
import { LEGAL_EFFECTIVE_DATE, type DocContent } from '@/content/legal';

const HOME = { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页' };
const UPDATED = { ko: '시행일', en: 'Last updated', ja: '施行日', zh: '生效日期' };

interface Props {
  content: DocContent;
  locale: Locale;
  /** '' for Korean, '/en' | '/ja' | '/zh' for locale variants. */
  basePath: string;
}

export default function LegalDoc({ content, locale, basePath }: Props) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-gray-400">
        <Link href={`${basePath}/`} className="hover:text-sky-600">
          {HOME[locale]}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-500">{content.title[locale]}</span>
      </nav>

      <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">{content.title[locale]}</h1>

      <div className="mt-4 space-y-3">
        {content.intro[locale].map((p, i) => (
          <p key={i} className="leading-relaxed text-gray-600">
            {p}
          </p>
        ))}
      </div>

      {content.sections.map((s, i) => (
        <section key={i} className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-gray-800">{s.heading[locale]}</h2>
          <div className="space-y-3">
            {s.body[locale].map((p, j) => (
              <p key={j} className="leading-relaxed text-gray-600">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-10 border-t border-slate-100 pt-5 text-xs text-gray-400">
        {UPDATED[locale]}: {LEGAL_EFFECTIVE_DATE}
      </p>
    </main>
  );
}
