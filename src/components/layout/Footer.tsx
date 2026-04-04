'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { messages, t } from '@/i18n/messages';

export default function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-gray-500">
        <p>
          {t(messages.footer.weatherData, locale)}{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-600"
          >
            Open-Meteo
          </a>{' '}
          (CC BY 4.0) | {t(messages.footer.countryData, locale)}{' '}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-600"
          >
            REST Countries
          </a>
        </p>
        <p className="mt-1">{t(messages.footer.copyright, locale).replace('{year}', String(year))}</p>
      </div>
    </footer>
  );
}
