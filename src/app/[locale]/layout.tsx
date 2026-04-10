import LocaleWrapper from './LocaleWrapper';
import type { Locale } from '@/contexts/LocaleContext';

const LOCALES: Locale[] = ['en', 'ja', 'zh'];

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LocaleWrapper locale={locale as Locale}>{children}</LocaleWrapper>;
}
