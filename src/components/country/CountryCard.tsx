import Link from 'next/link';

const FLAG_EMOJI: Record<string, string> = {
  japan: '\u{1F1EF}\u{1F1F5}',
  thailand: '\u{1F1F9}\u{1F1ED}',
  france: '\u{1F1EB}\u{1F1F7}',
  usa: '\u{1F1FA}\u{1F1F8}',
  australia: '\u{1F1E6}\u{1F1FA}',
  vietnam: '\u{1F1FB}\u{1F1F3}',
  philippines: '\u{1F1F5}\u{1F1ED}',
  singapore: '\u{1F1F8}\u{1F1EC}',
  indonesia: '\u{1F1EE}\u{1F1E9}',
  taiwan: '\u{1F1F9}\u{1F1FC}',
  spain: '\u{1F1EA}\u{1F1F8}',
  italy: '\u{1F1EE}\u{1F1F9}',
  uk: '\u{1F1EC}\u{1F1E7}',
  turkey: '\u{1F1F9}\u{1F1F7}',
  greece: '\u{1F1EC}\u{1F1F7}',
};

interface CountryCardProps {
  id: string;
  name: { ko: string; en: string };
  continent: string;
  regionCount: number;
}

export default function CountryCard({ id, name, regionCount }: CountryCardProps) {
  const flag = FLAG_EMOJI[id] ?? '';

  return (
    <Link
      href={`/country/${id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
    >
      <span className="text-3xl">{flag}</span>
      <div>
        <h3 className="font-semibold text-gray-900">{name.ko}</h3>
        <p className="text-sm text-gray-500">
          {name.en} &middot; {regionCount}개 지역
        </p>
      </div>
    </Link>
  );
}
