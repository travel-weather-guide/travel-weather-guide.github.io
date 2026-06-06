import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/contexts/LocaleContext';
import LegalDoc from '@/components/legal/LegalDoc';
import { localeHreflangAlternates } from '@/utils/seo-locale';
import { LEGAL_CONTENT, LEGAL_DOCS, isLegalDoc } from '@/content/legal';

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}): Promise<Metadata> {
  const { locale, doc } = await params;
  const l = locale as Locale;
  if (!isLegalDoc(doc)) return {};
  const c = LEGAL_CONTENT[doc];
  return {
    title: c.title[l] ?? c.title.en,
    description: c.metaDescription[l] ?? c.metaDescription.en,
    alternates: localeHreflangAlternates(`/legal/${doc}`, l),
  };
}

export default async function LocaleLegalPage({
  params,
}: {
  params: Promise<{ locale: string; doc: string }>;
}) {
  const { locale, doc } = await params;
  const l = locale as Locale;
  if (!isLegalDoc(doc)) notFound();
  return <LegalDoc content={LEGAL_CONTENT[doc]} locale={l} basePath={`/${locale}`} />;
}
