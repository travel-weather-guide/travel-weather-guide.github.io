'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function Header() {
  const { locale } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link href="/" className="text-lg font-bold text-sky-600">
          {t(messages.header.siteTitle, locale)}
        </Link>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
