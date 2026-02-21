/**
 * Core Sheet Builder - Add Row Button
 *
 * Material 3 inspired button with clear action label.
 */

"use client";
import { useTranslations } from "next-intl";

interface AddRowButtonProps {
  onAdd: () => void;
}

export function AddRowButton({ onAdd }: AddRowButtonProps) {
  const t = useTranslations("sheetBuilder");

  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-[var(--on-primary)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-all duration-200 group shadow-[var(--elevation-2)] hover:shadow-[var(--elevation-3)] border border-transparent hover:scale-105"
      title={t("rows.add")}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-5 h-5 text-[var(--on-primary)] transition-all duration-200 group-hover:rotate-90"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span className="tracking-wide">{t("rows.add")}</span>
    </button>
  );
}
