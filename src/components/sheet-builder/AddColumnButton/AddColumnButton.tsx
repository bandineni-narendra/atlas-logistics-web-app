/**
 * Core Sheet Builder - Add Column Button
 *
 * Material 3 inspired button with subtle secondary action styling.
 */

"use client";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

interface AddColumnButtonProps {
  onAdd: () => void;
}

export function AddColumnButton({ onAdd }: AddColumnButtonProps) {
  const t = useTranslations("sheetBuilder");

  return (
    <button
      onClick={onAdd}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--on-surface)] hover:text-[var(--primary)] hover:bg-[var(--surface-container-high)] rounded-md border border-[var(--outline)] hover:border-[var(--primary)] transition-all duration-150 group"
      title={t("columns.add")}
      type="button"
    >
      <Plus className="w-4 h-4 text-[var(--on-surface-variant)] group-hover:text-[var(--primary)] transition-colors" />
      <span>{t("columns.add")}</span>
    </button>
  );
}
