/**
 * Core Sheet Builder - Spreadsheet Selection Hook
 *
 * Tracks active cell and selection state for Excel-like behavior.
 */

"use client";

import { useState, useCallback } from "react";

export interface ActiveCell {
    rowIndex: number;
    columnIndex: number;
}

export type SelectionType = "cell" | "row" | "column" | "range";

export interface Selection {
    type: SelectionType;
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface UseSpreadsheetSelectionReturn {
    activeCell: ActiveCell | null;
    selection: Selection | null;
    setActiveCell: (rowIndex: number, columnIndex: number) => void;
    setSelection: (selection: Selection | null) => void;
    moveActiveCell: (
        direction: Direction,
        maxRow: number,
        maxCol: number
    ) => void;
    selectRow: (rowIndex: number, maxCol: number) => void;
    selectColumn: (columnIndex: number, maxRow: number) => void;
    clearSelection: () => void;
    isCellSelected: (rowIndex: number, columnIndex: number) => boolean;
    isCellActive: (rowIndex: number, columnIndex: number) => boolean;
}

export function useSpreadsheetSelection(): UseSpreadsheetSelectionReturn {
    const [activeCell, setActiveCellState] = useState<ActiveCell | null>(null);
    const [selection, setSelection] = useState<Selection | null>(null);

    const setActiveCell = useCallback((rowIndex: number, columnIndex: number) => {
        setActiveCellState({ rowIndex, columnIndex });
        setSelection({
            type: "cell",
            startRow: rowIndex,
            endRow: rowIndex,
            startColumn: columnIndex,
            endColumn: columnIndex,
        });
    }, []);

    const moveActiveCell = useCallback(
        (direction: Direction, maxRow: number, maxCol: number) => {
            setActiveCellState((prev) => {
                if (!prev) {
                    const next = { rowIndex: 0, columnIndex: 0 };
                    setSelection({
                        type: "cell",
                        startRow: 0,
                        endRow: 0,
                        startColumn: 0,
                        endColumn: 0,
                    });
                    return next;
                }

                let { rowIndex, columnIndex } = prev;

                switch (direction) {
                    case "up":
                        rowIndex = Math.max(0, rowIndex - 1);
                        break;
                    case "down":
                        rowIndex = Math.min(maxRow, rowIndex + 1);
                        break;
                    case "left":
                        columnIndex = Math.max(0, columnIndex - 1);
                        break;
                    case "right":
                        columnIndex = Math.min(maxCol, columnIndex + 1);
                        break;
                }

                setSelection({
                    type: "cell",
                    startRow: rowIndex,
                    endRow: rowIndex,
                    startColumn: columnIndex,
                    endColumn: columnIndex,
                });

                return { rowIndex, columnIndex };
            });
        },
        []
    );

    const selectRow = useCallback((rowIndex: number, maxCol: number) => {
        setActiveCellState((prev) => ({
            rowIndex,
            columnIndex: prev?.columnIndex ?? 0,
        }));
        setSelection({
            type: "row",
            startRow: rowIndex,
            endRow: rowIndex,
            startColumn: 0,
            endColumn: maxCol,
        });
    }, []);

    const selectColumn = useCallback((columnIndex: number, maxRow: number) => {
        setActiveCellState((prev) => ({
            rowIndex: prev?.rowIndex ?? 0,
            columnIndex,
        }));
        setSelection({
            type: "column",
            startRow: 0,
            endRow: maxRow,
            startColumn: columnIndex,
            endColumn: columnIndex,
        });
    }, []);

    const clearSelection = useCallback(() => {
        setActiveCellState(null);
        setSelection(null);
    }, []);

    const isCellActive = useCallback(
        (rowIndex: number, columnIndex: number) => {
            return (
                activeCell?.rowIndex === rowIndex &&
                activeCell?.columnIndex === columnIndex
            );
        },
        [activeCell]
    );

    const isCellSelected = useCallback(
        (rowIndex: number, columnIndex: number) => {
            if (!selection) return false;
            return (
                rowIndex >= selection.startRow &&
                rowIndex <= selection.endRow &&
                columnIndex >= selection.startColumn &&
                columnIndex <= selection.endColumn
            );
        },
        [selection]
    );

    return {
        activeCell,
        selection,
        setActiveCell,
        setSelection,
        moveActiveCell,
        selectRow,
        selectColumn,
        clearSelection,
        isCellSelected,
        isCellActive,
    };
}
