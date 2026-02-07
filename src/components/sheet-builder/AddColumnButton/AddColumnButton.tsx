/**
 * Core Sheet Builder - Add Column Button
 *
 * Material 3 inspired button with subtle secondary action styling.
 */

"use client";

interface AddColumnButtonProps {
  onAdd: () => void;
}

export function AddColumnButton({ onAdd }: AddColumnButtonProps) {
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-neutral-300 hover:border-blue-300 transition-all duration-150 group"
      title="Add column"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4 text-neutral-500 group-hover:text-blue-600 transition-colors"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span>Add Column</span>
    </button>
  );
}
