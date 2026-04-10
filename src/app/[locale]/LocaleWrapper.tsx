'use client';

import { LocaleProvider } from '@/contexts/LocaleContext';
import type { Locale } from '@/contexts/LocaleContext';

export default function LocaleWrapper({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>;
}
