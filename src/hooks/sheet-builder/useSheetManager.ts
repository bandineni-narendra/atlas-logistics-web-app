/**
 * Core Sheet Builder - Sheet Manager Hook
 *
 * Manages multiple sheets with tab switching and context persistence.
 * Generic - no domain logic.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { Sheet, createSheet } from "@/core/sheet-builder/models";
import { Column } from "@/core/sheet-builder/models";
import { useSheetBuilderContext } from "@/contexts/SheetBuilderContext";

export interface UseSheetManagerReturn {
  sheets: Sheet[];
  activeSheetId: string;
  activeSheet: Sheet | undefined;
  addSheet: (columns?: Column[]) => void;
  removeSheet: (sheetId: string) => void;
  setActiveSheet: (sheetId: string) => void;
  updateSheet: (sheetId: string, updater: (sheet: Sheet) => Sheet) => void;
  updateSheetName: (sheetId: string, newName: string) => void;
  resetSheet: (sheetId: string) => void;
}

export function useSheetManager(
  initialSheets?: Sheet[],
  storageKey?: string,
): UseSheetManagerReturn {
  // Always call the hook (Rules of Hooks)
  const context = useSheetBuilderContext();

  // Load from context on mount if storageKey is provided
  const [sheets, setSheets] = useState<Sheet[]>(() => {
    if (storageKey && context) {
      const stored = context.getSheetState(storageKey);
      if (
        stored?.sheets &&
        Array.isArray(stored.sheets) &&
        stored.sheets.length > 0
      ) {
        return stored.sheets;
      }
    }
    return initialSheets && initialSheets.length > 0
      ? initialSheets
      : [createSheet({ id: "1", name: "Sheet 1" })];
  });

  // Store initial columns for each sheet to enable proper reset
  // This must be initialized AFTER sheets state to include loaded sheets
  const [initialColumnsMap] = useState<Map<string, Column[]>>(() => {
    const map = new Map<string, Column[]>();

    // If we have loaded sheets from storage, we need to get initial columns from initialSheets
    if (storageKey && context) {
      const stored = context.getSheetState(storageKey);

      if (
        stored?.sheets &&
        Array.isArray(stored.sheets) &&
        stored.sheets.length > 0
      ) {
        // Map initial columns from initialSheets parameter
        if (initialSheets && initialSheets.length > 0) {
          // For loaded sheets, use columns from initialSheets parameter
          stored.sheets.forEach((sheet) => {
            const initialSheet = initialSheets.find((s) => s.id === sheet.id);
            if (initialSheet) {
              map.set(sheet.id, [...initialSheet.columns]);
            } else if (initialSheets[0]) {
              // If sheet not found, use the first initial sheet's columns as template
              map.set(sheet.id, [...initialSheets[0].columns]);
            }
          });
        }
        return map;
      }
    }

    // Normal initialization from initialSheets
    if (initialSheets && initialSheets.length > 0) {
      initialSheets.forEach((sheet) => {
        map.set(sheet.id, [...sheet.columns]);
      });
    }

    return map;
  });

  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    if (storageKey && context) {
      const stored = context.getSheetState(storageKey);
      if (stored?.activeSheetId) {
        return stored.activeSheetId;
      }
    }
    return initialSheets && initialSheets.length > 0
      ? initialSheets[0].id
      : "1";
  });

  const [nextSheetId, setNextSheetId] = useState<number>(() => {
    if (storageKey && context) {
      const stored = context.getSheetState(storageKey);
      if (stored?.nextSheetId) {
        return stored.nextSheetId;
      }
    }
    return initialSheets && initialSheets.length > 0
      ? Math.max(...initialSheets.map((s) => parseInt(s.id) || 0)) + 1
      : 2;
  });

  // Persist to context whenever sheets, activeSheetId, or nextSheetId change
  useEffect(() => {
    if (storageKey && context) {
      context.setSheetState(storageKey, {
        sheets,
        activeSheetId,
        nextSheetId,
      });
    }
    // Note: context is intentionally omitted from deps as it's stable via useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheets, activeSheetId, nextSheetId, storageKey]);

  const activeSheet = sheets.find((s) => s.id === activeSheetId);

  const addSheet = useCallback(
    (columns?: Column[]) => {
      const newSheetId = nextSheetId.toString();

      // Find the next available sheet number based on existing sheet names
      const existingNumbers = sheets
        .map((s) => {
          const match = s.name.match(/^Sheet (\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((n) => n > 0);

      // Find the smallest available number starting from 1
      let sheetNumber = 1;
      while (existingNumbers.includes(sheetNumber)) {
        sheetNumber++;
      }

      const initialColumns = columns || [];
      const newSheet = createSheet({
        id: newSheetId,
        name: `Sheet ${sheetNumber}`,
        columns: [...initialColumns],
        rows: [],
      });

      // Store initial columns for this sheet
      initialColumnsMap.set(newSheetId, [...initialColumns]);

      setSheets((prev) => [...prev, newSheet]);
      setActiveSheetId(newSheetId);
      setNextSheetId((prev) => prev + 1);
    },
    [nextSheetId, sheets, initialColumnsMap],
  );

  const removeSheet = useCallback(
    (sheetId: string) => {
      // Remove initial columns mapping for this sheet
      initialColumnsMap.delete(sheetId);

      setSheets((prev) => {
        const filtered = prev.filter((s) => s.id !== sheetId);
        // Ensure at least one sheet exists
        if (filtered.length === 0) {
          return [createSheet({ id: "1", name: "Sheet 1" })];
        }
        return filtered;
      });

      // If removing active sheet, switch to first remaining sheet
      if (sheetId === activeSheetId) {
        setSheets((currentSheets) => {
          const remaining = currentSheets.filter((s) => s.id !== sheetId);
          if (remaining.length > 0) {
            setActiveSheetId(remaining[0].id);
          }
          return currentSheets;
        });
      }
    },
    [activeSheetId, initialColumnsMap],
  );

  const updateSheet = useCallback(
    (sheetId: string, updater: (sheet: Sheet) => Sheet) => {
      setSheets((prev) =>
        prev.map((sheet) => (sheet.id === sheetId ? updater(sheet) : sheet)),
      );
    },
    [],
  );

  const updateSheetName = useCallback((sheetId: string, newName: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === sheetId ? { ...sheet, name: newName } : sheet,
      ),
    );
  }, []);

  const resetSheet = useCallback(
    (sheetId: string) => {
      setSheets((prev) => {
        return prev.map((sheet) => {
          if (sheet.id === sheetId) {
            // Get initial columns for this sheet (or empty array if not found)
            const initialColumns = initialColumnsMap.get(sheetId) || [];

            return {
              ...sheet,
              columns: [...initialColumns],
              rows: [],
            };
          }
          return sheet;
        });
      });
    },
    [initialColumnsMap],
  );

  return {
    sheets,
    activeSheetId,
    activeSheet,
    addSheet,
    removeSheet,
    setActiveSheet: setActiveSheetId,
    updateSheet,
    updateSheetName,
    resetSheet,
  };
}
