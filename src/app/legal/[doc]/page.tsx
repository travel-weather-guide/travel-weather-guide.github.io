import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LegalDoc from '@/components/legal/LegalDoc';
import { hreflangAlternates } from '@/utils/seo-locale';
import { LEGAL_CONTENT, LEGAL_DOCS, isLegalDoc } from '@/content/legal';

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  if (!isLegalDoc(doc)) return {};
  const c = LEGAL_CONTENT[doc];
  return {
    title: c.title.ko,
    description: c.metaDescription.ko,
    alternates: hreflangAlternates(`/legal/${doc}`),
  };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  if (!isLegalDoc(doc)) notFound();
  return <LegalDoc content={LEGAL_CONTENT[doc]} locale="ko" basePath="" />;
}
