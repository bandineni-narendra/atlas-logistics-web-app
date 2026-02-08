/**
 * Core Sheet Builder - Add Row Button
 *
 * Material 3 inspired button with clear action label.
 */

"use client";

interface AddRowButtonProps {
  onAdd: () => void;
}

export function AddRowButton({ onAdd }: AddRowButtonProps) {
  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white hover:text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 group shadow-md hover:shadow-lg border border-blue-700 hover:border-blue-800 hover:scale-105"
      title="Add row"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-5 h-5 text-white transition-all duration-200 group-hover:rotate-90"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span className="tracking-wide">Add Row</span>
    </button>
  );
}
