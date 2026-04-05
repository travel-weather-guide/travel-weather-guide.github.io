'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm text-gray-500">
          {t(messages.footer.weatherData, locale)}{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 transition-all duration-200 hover:text-sky-700 hover:underline"
          >
            Open-Meteo
          </a>{' '}
          (CC BY 4.0) | {t(messages.footer.countryData, locale)}{' '}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 transition-all duration-200 hover:text-sky-700 hover:underline"
          >
            REST Countries
          </a>
        </p>
        <p className="mt-2 text-sm text-gray-400">{t(messages.footer.copyright, locale).replace('{year}', String(year))}</p>
      </div>
    </footer>
  );
}
