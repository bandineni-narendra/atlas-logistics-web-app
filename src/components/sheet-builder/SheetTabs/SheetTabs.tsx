/**
 * Core Sheet Builder - Sheet Tabs
 *
 * Material 3 inspired tabs with clear active state and smooth transitions.
 */

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Sheet } from "@/core/sheet-builder";
import { useFeedbackModal } from "@/hooks";
import { FeedbackModal } from "@/components/ui";
import { RotateCcw, X, Plus } from "lucide-react";
interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSelectSheet: (sheetId: string) => void;
  onAddSheet: () => void;
  onDeleteSheet: (sheetId: string) => void;
  onUpdateSheetName: (sheetId: string, newName: string) => void;
  onResetSheet: (sheetId: string) => void;
}

export function SheetTabs({
  sheets,
  activeSheetId,
  onSelectSheet,
  onAddSheet,
  onDeleteSheet,
  onUpdateSheetName,
  onResetSheet,
}: SheetTabsProps) {
  const t = useTranslations("sheetBuilder");
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [resetTarget, setResetTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { state, openWarningModal, closeWarningModal } = useFeedbackModal();

  const startEditing = useCallback((sheet: Sheet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSheetId(sheet.id);
    setEditingValue(sheet.name);
  }, []);

  const saveEdit = useCallback(
    (sheetId: string) => {
      if (editingValue.trim()) {
        onUpdateSheetName(sheetId, editingValue.trim());
      }
      setEditingSheetId(null);
      setEditingValue("");
    },
    [editingValue, onUpdateSheetName],
  );

  const cancelEdit = useCallback(() => {
    setEditingSheetId(null);
    setEditingValue("");
  }, []);

  const handleReset = useCallback(
    (sheetId: string, sheetName: string, e: React.MouseEvent) => {
      e.stopPropagation();
      openWarningModal(
        `Reset all data in "${sheetName}"? This cannot be undone.`,
        () => {
          onResetSheet(sheetId);
        },
        "Confirm Reset",
      );
    },
    [openWarningModal, onResetSheet],
  );

  return (
    <div className="flex items-center gap-0.5 border-b-2 border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-3 py-1.5">
      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          className={`
            group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer
            transition-all duration-200            ${sheet.id === activeSheetId
              ? "bg-[var(--surface)] shadow-sm border-t-2 border-l border-r border-[var(--primary)] border-b-0 text-[var(--on-surface)] font-semibold -mb-0.5"
              : "bg-transparent hover:bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] border-b-2 border-transparent"
            }
          `}
        >
          {editingSheetId === sheet.id ? (
            <input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => saveEdit(sheet.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveEdit(sheet.id);
                } else if (e.key === "Escape") {
                  cancelEdit();
                }
                e.stopPropagation();
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              className="text-sm bg-[var(--surface-container-lowest)] border border-[var(--primary)] text-[var(--on-surface)] rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-[var(--primary)] min-w-[80px]"
            />
          ) : (
            <span
              onClick={() => onSelectSheet(sheet.id)}
              onDoubleClick={(e) => startEditing(sheet, e)}
              className="text-sm select-none"
              title="Double-click to rename"
            >
              {sheet.name}
            </span>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => handleReset(sheet.id, sheet.name, e)}
              className={`
                opacity-0 group-hover:opacity-100
                text-[var(--on-surface-variant)] hover:text-[var(--warning)] hover:bg-[var(--warning-container)] 
                rounded p-0.5 transition-all duration-150
              `}
              title="Reset sheet data"
              type="button"
              aria-label={`Reset ${sheet.name}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {sheets.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSheet(sheet.id);
                }}
                className={`
                  opacity-0 group-hover:opacity-100
                  text-[var(--on-surface-variant)] hover:text-[var(--error)] hover:bg-[var(--error-container)] 
                  rounded p-0.5 transition-all duration-150
                `}
                title="Delete sheet"
                type="button"
                aria-label={`Delete ${sheet.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add sheet button */}
      <button
        onClick={onAddSheet}
        className="inline-flex items-center gap-1.5 px-3 py-2 ml-2 text-sm font-medium text-[var(--on-surface-variant)] hover:text-[var(--primary)] hover:bg-[var(--primary-container)] rounded-md transition-colors duration-150 group"
        title={t("tabs.add")}
        type="button"
      >
        <Plus className="w-4 h-4 text-[var(--on-surface-variant)] group-hover:text-[var(--primary)] transition-colors" />
        <span>{t("tabs.add")}</span>
      </button>

      {/* Feedback Modal for confirmations */}
      <FeedbackModal state={state} onClose={closeWarningModal} />
    </div>
  );
}
