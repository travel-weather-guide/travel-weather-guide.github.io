/**
 * REST Countries API v3.1에서 국가 기본정보 수집
 */

const BASE_URL = 'https://restcountries.com/v3.1/alpha';

interface CountryInfo {
  capital: string;
  currency: string;
  language: string;
  timezone: string;
}

export async function fetchCountryInfo(countryCode: string): Promise<CountryInfo> {
  console.log(`  Fetching country info for ${countryCode}...`);

  const res = await fetch(`${BASE_URL}/${countryCode}?fields=capital,currencies,languages,timezones`);
  if (!res.ok) {
    throw new Error(`REST Countries API error: ${res.status}`);
  }

  const data = await res.json();

  const currencies = data.currencies ? Object.values(data.currencies) as { name: string; symbol: string }[] : [];
  const languages = data.languages ? Object.values(data.languages) as string[] : [];

  return {
    capital: data.capital?.[0] ?? '',
    currency: currencies[0] ? `${currencies[0].name} (${currencies[0].symbol})` : '',
    language: languages.join(', '),
    timezone: data.timezones?.[0] ?? '',
  };
}
