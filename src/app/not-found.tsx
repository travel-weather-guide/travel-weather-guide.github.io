import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-7xl mb-6">🧭</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">길을 잃으셨나요?</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        요청하신 페이지를 찾을 수 없어요. 주소를 다시 확인하거나 아래 링크를 이용해 주세요.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors"
        >
          홈으로
        </Link>
        <Link
          href="/country"
          className="px-5 py-2.5 bg-white text-sky-600 border border-sky-200 rounded-lg font-medium hover:bg-sky-50 transition-colors"
        >
          국가 탐색
        </Link>
      </div>
    </main>
  );
}
