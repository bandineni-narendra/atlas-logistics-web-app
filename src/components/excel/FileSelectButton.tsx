"use client";

import { useRef, useCallback } from "react";
import { Upload } from "lucide-react";

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
        <Upload className="w-4 h-4" />
        {label}
      </button>
    </>
  );
}
