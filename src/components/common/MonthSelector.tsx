'use client';

const MONTH_LABELS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

interface MonthSelectorProps {
  selected: number;
  onChange: (month: number) => void;
}

export default function MonthSelector({ selected, onChange }: MonthSelectorProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {MONTH_LABELS.map((label, i) => {
        const month = i + 1;
        const isActive = month === selected;
        return (
          <button
            key={month}
            onClick={() => onChange(month)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-sky-100 hover:text-sky-600'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
