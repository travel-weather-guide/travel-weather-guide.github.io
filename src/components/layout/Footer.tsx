export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-gray-500">
        <p>
          Weather data by{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-600"
          >
            Open-Meteo
          </a>{' '}
          (CC BY 4.0) | Country data by{' '}
          <a
            href="https://restcountries.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sky-600"
          >
            REST Countries
          </a>
        </p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Travel Weather</p>
      </div>
    </footer>
  );
}
