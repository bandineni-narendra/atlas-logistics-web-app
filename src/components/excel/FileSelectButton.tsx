"use client";

import { useRef, useCallback } from "react";

type FileSelectButtonProps = {
  accept?: string;
  disabled?: boolean;
  label?: string;
  onFileSelect: (file: File) => void;
};

export function FileSelectButton({
  accept = ".xls,.xlsx",
  disabled = false,
  label = "Select Excel File",
  onFileSelect,
}: FileSelectButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
        // allow selecting the same file again
        e.target.value = "";
      }
    },
    [onFileSelect],
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={`
          inline-flex items-center gap-2
          rounded-lg px-5 py-2.5 text-sm font-medium
          bg-blue-600 text-white shadow-sm
          hover:bg-blue-700 hover:shadow
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {label}
      </button>
    </>
  );
}
