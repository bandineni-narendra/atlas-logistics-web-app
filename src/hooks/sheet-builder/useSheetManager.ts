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
  storageKey?: string
): UseSheetManagerReturn {
  const context = storageKey ? useSheetBuilderContext() : null;

  // Load from context on mount if storageKey is provided
  const [sheets, setSheets] = useState<Sheet[]>(() => {
    if (storageKey && context) {
      const stored = context.getSheetState(storageKey);
      if (stored?.sheets && Array.isArray(stored.sheets) && stored.sheets.length > 0) {
        return stored.sheets;
      }
    }
    return initialSheets && initialSheets.length > 0
      ? initialSheets
      : [createSheet({ id: "1", name: "Sheet 1" })];
  });

  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    if (storageKey && context) {
      const stored = context.getSheetState(storageKey);
      if (stored?.activeSheetId) {
        return stored.activeSheetId;
      }
    }
    return initialSheets && initialSheets.length > 0 ? initialSheets[0].id : "1";
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
      
      const newSheet = createSheet({
        id: newSheetId,
        name: `Sheet ${sheetNumber}`,
        columns: columns || [],
        rows: [],
      });
      setSheets((prev) => [...prev, newSheet]);
      setActiveSheetId(newSheetId);
      setNextSheetId((prev) => prev + 1);
    },
    [nextSheetId, sheets],
  );

  const removeSheet = useCallback(
    (sheetId: string) => {
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
    [activeSheetId],
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

  const resetSheet = useCallback((sheetId: string) => {
    setSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === sheetId ? { ...sheet, rows: [] } : sheet,
      ),
    );
  }, []);

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
