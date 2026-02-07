/**
 * Core Sheet Builder - Sheet Tabs
 *
 * Material 3 inspired tabs with clear active state and smooth transitions.
 */

"use client";

import { useState } from "react";
import { Sheet } from "@/core/sheet-builder";
import { useFeedbackModal, WarningModal } from "@/core/feedback";

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
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [resetTarget, setResetTarget] = useState<{ id: string; name: string } | null>(null);
  
  const {
    state,
    openWarningModal,
    closeWarningModal,
  } = useFeedbackModal();

  const startEditing = (sheet: Sheet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSheetId(sheet.id);
    setEditingValue(sheet.name);
  };

  const saveEdit = (sheetId: string) => {
    if (editingValue.trim()) {
      onUpdateSheetName(sheetId, editingValue.trim());
    }
    setEditingSheetId(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingSheetId(null);
    setEditingValue("");
  };

  const handleReset = (sheetId: string, sheetName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    openWarningModal(
      `Reset all data in "${sheetName}"? This cannot be undone.`,
      () => {
        onResetSheet(sheetId);
      },
      "Confirm Reset"
    );
  };

  return (
    <div className="flex items-center gap-0.5 border-b-2 border-neutral-200 bg-neutral-50 px-3 py-1.5">
      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          className={`
            group flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer
            transition-all duration-200 ease-out
            ${
              sheet.id === activeSheetId
                ? "bg-white shadow-sm border-t-2 border-l border-r border-blue-600 border-b-0 text-neutral-900 font-semibold -mb-0.5"
                : "bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border-b-2 border-transparent"
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
              className="text-sm bg-white border border-blue-500 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-500 min-w-[80px]"
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
                text-neutral-400 hover:text-orange-600 hover:bg-orange-50 
                rounded p-0.5 transition-all duration-150
              `}
              title="Reset sheet data"
              type="button"
              aria-label={`Reset ${sheet.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
            {sheets.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSheet(sheet.id);
                }}
                className={`
                  opacity-0 group-hover:opacity-100
                  text-neutral-400 hover:text-red-600 hover:bg-red-50 
                  rounded p-0.5 transition-all duration-150
                `}
                title="Delete sheet"
                type="button"
                aria-label={`Delete ${sheet.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add sheet button */}
      <button
        onClick={onAddSheet}
        className="inline-flex items-center gap-1.5 px-3 py-2 ml-2 text-sm font-medium text-neutral-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-150 group"
        title="Add sheet"
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
        <span>Add Sheet</span>
      </button>

      {/* Warning Modal for Reset Confirmation */}
      <WarningModal
        isOpen={state.warning.isOpen}
        onClose={closeWarningModal}
        message={state.warning.message}
        onContinue={state.warning.onContinue}
        title={state.warning.title}
        continueLabel="Reset"
        cancelLabel="Cancel"
      />
    </div>
  );
}
