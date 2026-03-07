/**
 * Core Sheet Builder - Keyboard Shortcuts Hook
 *
 * Centralised keydown handler for Excel-like spreadsheet behavior.
 * Attaches to the window when the sheet container is focused.
 * Guards against firing when an input/select/textarea is actively being edited.
 */

"use client";

import { useEffect, useCallback, RefObject } from "react";
import { Sheet, CellValue, Column, createColumn, ColumnType } from "@/core/sheet-builder";
import { ActiveCell, Selection } from "./useSpreadsheetSelection";

interface UseKeyboardShortcutsOptions {
    /** The DOM ref of the sheet container — shortcuts activate when it is focused */
    containerRef: RefObject<HTMLElement | null>;
    sheet: Sheet;
    activeCell: ActiveCell | null;
    selection: Selection | null;
    /** Notify parent that active cell moved (navigation shortcuts) */
    onMoveActiveCell: (direction: "up" | "down" | "left" | "right", maxRow: number, maxCol: number) => void;
    onSelectRow: (rowIndex: number, maxCol: number) => void;
    onSelectColumn: (columnIndex: number, maxRow: number) => void;
    /** Sheet mutation callbacks — must match those passed to SheetTable */
    onCellChange: (rowId: string, columnId: string, value: CellValue) => void;
    onAddRow: () => void;
    onDeleteRow: (rowId: string) => void;
    onAddColumn: (column: Column) => void;
    onDeleteColumn: (columnId: string) => void;
    onCopyRow: (rowId: string) => void;
    /** Focus a specific cell programmatically */
    focusCell: (rowIndex: number, columnIndex: number) => void;
}

/** Returns true when the event target is an element the user is actively typing into */
function isEditingInput(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return false;

    // If it's a checkbox, they aren't "typing"
    if (target.type === "checkbox" || target.type === "radio") return false;

    // Only block if they are actively typing (cursor is inside text and they aren't holding modifiers)
    // We let the shortcut handler decide based on modifiers (e.g. Ctrl+C should still work)
    return true;
}

/** Returns true when element is inside a select dropdown */
function isInsideSelect(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.tagName.toLowerCase() === "select";
}

export function useKeyboardShortcuts({
    containerRef,
    sheet,
    activeCell,
    selection,
    onMoveActiveCell,
    onSelectRow,
    onSelectColumn,
    onCellChange,
    onAddRow,
    onDeleteRow,
    onAddColumn,
    onDeleteColumn,
    onCopyRow,
    focusCell,
}: UseKeyboardShortcutsOptions) {
    const maxRow = sheet.rows.length - 1;
    const maxCol = sheet.columns.length - 1;

    const getActiveCellValue = useCallback((): CellValue => {
        if (!activeCell) return null;
        const row = sheet.rows[activeCell.rowIndex];
        if (!row) return null;
        const col = sheet.columns[activeCell.columnIndex];
        if (!col) return null;
        return row.cells[col.id] ?? null;
    }, [activeCell, sheet]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const target = e.target;
            const ctrl = e.ctrlKey || e.metaKey;
            const shift = e.shiftKey;
            const alt = e.altKey;

            // ─── Navigation shortcuts ────────────────────────────────────────
            // Arrow keys
            if (!ctrl && !alt) {
                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                    if (shift) {
                        // User specified: Shift + Arrow adjusts values
                        if (!activeCell) return;
                        const col = sheet.columns[activeCell.columnIndex];
                        const row = sheet.rows[activeCell.rowIndex];
                        if (!col || !row) return;

                        const val = row.cells[col.id];

                        // Number adjustment
                        if (col.type === ColumnType.NUMBER) {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                e.preventDefault();
                                e.stopPropagation();
                                const currentNum = typeof val === "number" ? val : 0;
                                const step = e.key === "ArrowUp" ? 1 : -1;
                                onCellChange(row.id, col.id, currentNum + step);
                                return;
                            }
                        }

                        // Select adjustment
                        if (col.type === ColumnType.SELECT) {
                            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                                e.preventDefault();
                                e.stopPropagation();
                                const options = col.options || [];
                                if (options.length === 0) return;

                                const stringVal = String(val ?? "");
                                let idx = options.findIndex((opt) => {
                                    const optVal = typeof opt === "string" ? opt : opt.value || opt.label;
                                    return String(optVal) === stringVal;
                                });

                                if (idx === -1) idx = 0;
                                else {
                                    idx += e.key === "ArrowRight" ? 1 : -1;
                                    if (idx < 0) idx = options.length - 1;
                                    if (idx >= options.length) idx = 0;
                                }

                                const nextOpt = options[idx];
                                const nextVal = typeof nextOpt === "string" ? nextOpt : nextOpt.value || nextOpt.label;
                                onCellChange(row.id, col.id, nextVal);
                                return;
                            }
                        }

                        // Let Shift+Arrow fall through (e.g., text selection in inputs, or AirlineCombobox handling)
                    } else {
                        // Regular Arrow keys: ALWAYS navigate cells

                        // Text input cursor handling (allow Left/Right to move cursor if editing text, but NOT up/down)
                        if (isEditingInput(target)) {
                            const input = target as HTMLInputElement;
                            const isTextLike = input.type === "text" || input.type === "textarea" || input.type === "search";

                            if (isTextLike && input.value !== "") {
                                if (e.key === "ArrowLeft" && input.selectionStart !== null && input.selectionStart > 0) {
                                    return; // Let native cursor move left
                                }
                                if (e.key === "ArrowRight" && input.selectionEnd !== null && input.selectionEnd < input.value.length) {
                                    return; // Let native cursor move right
                                }
                            }
                        }

                        // For Selects, natively arrow keys change values. We MUST prevent default to force navigation.
                        e.preventDefault();
                        e.stopPropagation();

                        const dir = e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right";
                        onMoveActiveCell(dir, maxRow, maxCol);

                        setTimeout(() => {
                            if (!activeCell) return;
                            let { rowIndex, columnIndex } = activeCell;
                            switch (dir) {
                                case "up": rowIndex = Math.max(0, rowIndex - 1); break;
                                case "down": rowIndex = Math.min(maxRow, rowIndex + 1); break;
                                case "left": columnIndex = Math.max(0, columnIndex - 1); break;
                                case "right": columnIndex = Math.min(maxCol, columnIndex + 1); break;
                            }
                            focusCell(rowIndex, columnIndex);
                        }, 0);
                        return;
                    }
                }
            }

            if (!ctrl && !shift && !alt) {
                if (e.key === "Tab") {
                    e.preventDefault();
                    onMoveActiveCell("right", maxRow, maxCol);
                    setTimeout(() => {
                        if (activeCell) {
                            const colIndex = Math.min(maxCol, activeCell.columnIndex + 1);
                            focusCell(activeCell.rowIndex, colIndex);
                        }
                    }, 0);
                    return;
                }

                if (e.key === "Enter") {
                    e.preventDefault();
                    onMoveActiveCell("down", maxRow, maxCol);
                    setTimeout(() => {
                        if (activeCell) {
                            const rowIndex = Math.min(maxRow, activeCell.rowIndex + 1);
                            focusCell(rowIndex, activeCell.columnIndex);
                        }
                    }, 0);
                    return;
                }
            }

            // Shift+Tab
            if (!ctrl && shift && !alt && e.key === "Tab") {
                e.preventDefault();
                onMoveActiveCell("left", maxRow, maxCol);
                setTimeout(() => {
                    if (activeCell) {
                        const colIndex = Math.max(0, activeCell.columnIndex - 1);
                        focusCell(activeCell.rowIndex, colIndex);
                    }
                }, 0);
                return;
            }

            // ─── Alt + ArrowDown — copy value from cell above ───────────────
            if (alt && !ctrl && !shift && e.key === "ArrowDown") {
                if (!activeCell) return;
                e.preventDefault();
                const aboveRowIndex = activeCell.rowIndex - 1;
                if (aboveRowIndex < 0) return;
                const col = sheet.columns[activeCell.columnIndex];
                const aboveRow = sheet.rows[aboveRowIndex];
                const currentRow = sheet.rows[activeCell.rowIndex];
                if (!col || !aboveRow || !currentRow) return;
                onCellChange(currentRow.id, col.id, aboveRow.cells[col.id] ?? null);
                return;
            }

            // ─── Space shortcuts (Row / Column Selection) ───────────────────
            if (e.code === "Space") {
                // Ctrl+Space — select entire column
                if (ctrl && !shift && !alt) {
                    if (!activeCell) return;
                    e.preventDefault();
                    onSelectColumn(activeCell.columnIndex, maxRow);
                    return;
                }

                // Shift+Space — select entire row
                if (!ctrl && shift && !alt) {
                    if (!activeCell) return;
                    e.preventDefault();
                    onSelectRow(activeCell.rowIndex, maxCol);
                    return;
                }
            }

            // ─── Guard: Stop here if actively typing without modifiers OR if no Ctrl is held ────
            // This ensures standard typing isn't swallowed and blocks non-Ctrl commands from here on.
            if (isEditingInput(target) && !ctrl && !alt) return;
            if (!ctrl) return;

            // Ctrl+C — copy
            if (!shift && !alt && e.key.toLowerCase() === "c") {
                if (!selection || !activeCell) return;
                e.preventDefault();
                e.stopPropagation();

                const lines: string[] = [];
                let htmlText = "<table>\n";

                const startRow = Math.min(selection.startRow, selection.endRow);
                const endRow = Math.max(selection.startRow, selection.endRow);
                const startCol = Math.min(selection.startColumn, selection.endColumn);
                const endCol = Math.max(selection.startColumn, selection.endColumn);

                for (let r = startRow; r <= endRow; r++) {
                    const row = sheet.rows[r];
                    if (!row) continue;
                    const rowValues: string[] = [];
                    htmlText += "  <tr>\n";
                    for (let c = startCol; c <= endCol; c++) {
                        const col = sheet.columns[c];
                        if (!col) continue;
                        const val = row.cells[col.id];
                        const strVal = val !== null && val !== undefined ? String(val) : "";
                        rowValues.push(strVal);

                        // Safely escape HTML for the table representation
                        const escapedVal = strVal
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
                        htmlText += `    <td>${escapedVal}</td>\n`;
                    }
                    lines.push(rowValues.join("\t"));
                    htmlText += "  </tr>\n";
                }
                htmlText += "</table>";

                const plainText = lines.join("\n");

                try {
                    if (window.ClipboardItem) {
                        const plainBlob = new Blob([plainText], { type: "text/plain" });
                        const htmlBlob = new Blob([htmlText], { type: "text/html" });
                        const item = new ClipboardItem({
                            "text/plain": plainBlob,
                            "text/html": htmlBlob
                        });
                        navigator.clipboard.write([item]).catch(() => {
                            navigator.clipboard.writeText(plainText).catch(() => { });
                        });
                    } else {
                        navigator.clipboard.writeText(plainText).catch(() => { });
                    }
                } catch (err) {
                    navigator.clipboard.writeText(plainText).catch(() => { });
                }
                return;
            }

            // Ctrl+V — paste
            if (!shift && !alt && e.key === "v") {
                if (!activeCell) return;
                e.preventDefault();

                navigator.clipboard.readText().then((text) => {
                    const lines = text.split("\n");
                    lines.forEach((line, lineIndex) => {
                        const values = line.split("\t");
                        values.forEach((val, valIndex) => {
                            const rowIndex = activeCell.rowIndex + lineIndex;
                            const colIndex = activeCell.columnIndex + valIndex;
                            if (rowIndex > maxRow || colIndex > maxCol) return;
                            const row = sheet.rows[rowIndex];
                            const col = sheet.columns[colIndex];
                            if (!row || !col) return;
                            let parsed: CellValue = val.trim() || null;
                            if (col.type === ColumnType.NUMBER) {
                                const n = parseFloat(val);
                                parsed = isNaN(n) ? null : n;
                            }
                            onCellChange(row.id, col.id, parsed);
                        });
                    });
                }).catch(() => { });
                return;
            }

            // Ctrl+D — fill down
            if (!shift && !alt && e.key.toLowerCase() === "d") {
                if (!activeCell) return;
                e.preventDefault();

                const col = sheet.columns[activeCell.columnIndex];
                if (!col) return;
                const sourceRow = sheet.rows[activeCell.rowIndex];
                if (!sourceRow) return;
                const sourceValue = sourceRow.cells[col.id] ?? null;

                // Fill all rows below (or range if selection spans multiple rows)
                const startRow = activeCell.rowIndex + 1;
                const endRow =
                    selection && selection.type === "range"
                        ? selection.endRow
                        : maxRow;

                for (let r = startRow; r <= endRow; r++) {
                    const row = sheet.rows[r];
                    if (!row) continue;
                    onCellChange(row.id, col.id, sourceValue);
                }
                return;
            }

            // (Space shortcuts removed from here and placed above the Ctrl guard)

            // Ctrl+Shift+- — delete selected row or column
            if (shift && !alt && (e.key === "-" || e.key === "_")) {
                if (!selection) return;
                e.preventDefault();

                if (selection.type === "row" || selection.type === "cell") {
                    const row = sheet.rows[selection.startRow];
                    if (row) onDeleteRow(row.id);
                } else if (selection.type === "column") {
                    const col = sheet.columns[selection.startColumn];
                    if (col) onDeleteColumn(col.id);
                }
                return;
            }

            // Ctrl+Shift++ — insert row or column (handles '+', '=', and 'Plus' for cross-keyboard compatibility)
            if (shift && !alt && (e.key === "+" || e.key === "=" || e.code === "Equal" || e.code === "NumpadAdd")) {
                e.preventDefault();

                if (!selection || selection.type === "row" || selection.type === "cell") {
                    onAddRow();
                } else if (selection.type === "column") {
                    const newColumnId = `col-${Date.now()}`;
                    const newColumn = createColumn({
                        id: newColumnId,
                        label: `Column ${sheet.columns.length + 1}`,
                        type: ColumnType.TEXT,
                        width: 150,
                    });
                    onAddColumn(newColumn);
                }
                return;
            }

            // Ctrl+Shift+D — duplicate row (row selected) or fill column (column selected)
            if (shift && !alt && e.key.toLowerCase() === "d") {
                e.preventDefault();

                if (selection && selection.type === "column") {
                    // Fill entire column with value from active cell
                    if (!activeCell) return;
                    const col = sheet.columns[activeCell.columnIndex];
                    if (!col) return;
                    const sourceRow = sheet.rows[activeCell.rowIndex];
                    if (!sourceRow) return;
                    const sourceValue = sourceRow.cells[col.id] ?? null;
                    sheet.rows.forEach((row) => {
                        onCellChange(row.id, col.id, sourceValue);
                    });
                } else {
                    // Duplicate active row
                    if (!activeCell) return;
                    const row = sheet.rows[activeCell.rowIndex];
                    if (row) onCopyRow(row.id);
                }
                return;
            }
        },
        [
            activeCell,
            selection,
            sheet,
            maxRow,
            maxCol,
            onMoveActiveCell,
            onSelectRow,
            onSelectColumn,
            onCellChange,
            onAddRow,
            onDeleteRow,
            onAddColumn,
            onDeleteColumn,
            onCopyRow,
            getActiveCellValue,
            focusCell,
        ]
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // We attach to the window in the CAPTURE phase so we can intercept 
        // keys like Shift+Space BEFORE the browser natively types a space into the input field.
        const onKeyDown = (e: KeyboardEvent) => {
            // Check if focus is inside the spreadsheet OR inside a portal dropdown
            const isInsideGrid = container.contains(document.activeElement);
            const isInsidePortalDropdown = document.activeElement?.closest('[role="listbox"], [role="option"]') !== null;

            if (!isInsideGrid && !isInsidePortalDropdown) return;
            handleKeyDown(e);
        };

        window.addEventListener("keydown", onKeyDown, { capture: true });
        return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
    }, [containerRef, handleKeyDown]);
}
