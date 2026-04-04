import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link href="/" className="text-lg font-bold text-sky-600">
          Travel Weather
        </Link>
      </div>
    </header>
  );
}
