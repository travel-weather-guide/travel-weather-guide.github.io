'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

export default function NotFound() {
  const { locale } = useLocale();

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-7xl mb-6">🧭</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{t(messages.notFound.heading, locale)}</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        {t(messages.notFound.body, locale)}
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          {t(messages.notFound.goHome, locale)}
        </Link>
        <Link
          href="/country"
          className="px-5 py-2.5 bg-white text-sky-600 border border-sky-200 rounded-lg font-medium hover:bg-sky-50 transition-colors"
        >
          {t(messages.notFound.exploreCountries, locale)}
        </Link>
      </div>
    </main>
  );
}
